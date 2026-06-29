import { tool } from 'ai'
import { z } from 'zod'

export const tools = {

  // OUTIL 1 — Enregistrer la demande 
  enregistrer_demande: tool({
    description: `
      Enregistre les informations du prospect dans Supabase.
      À appeler dès que le prospect a donné ses coordonnées de base.
      Retourne un demande_id à utiliser pour le calcul du devis.
    `,
    inputSchema: z.object({
      prospect_nom:   z.string().describe('Nom complet du prospect'),
      prospect_email: z.string().describe('Email du prospect'),
      prospect_tel:   z.string().optional().describe('Téléphone du prospect'),
      trajet_depart:  z.string().describe('Ville de départ'),
      trajet_arrivee: z.string().describe("Ville d'arrivée"),
      date_depart:    z.string().describe('Date de départ YYYY-MM-DD'),
      nb_passagers:   z.number().describe('Nombre de passagers'),
      options:        z.array(z.string()).describe('Options souhaitées'),
    }),
    execute: async (params) => {
      const { creerDemande } = await import('@/lib/supabase')
      const result = await creerDemande(params)
      return { success: true, demande_id: result.id }
    },
  }),

  // OUTIL 2 — Calculer le devis 
  calculer_devis: tool({
    description: `
      Calcule le prix, enregistre le devis dans Supabase
      et envoie l'ID à n8n pour la génération du PDF et l'envoi email.
      À appeler uniquement quand TOUTES les informations sont collectées.
    `,
    inputSchema: z.object({
      demande_id:    z.string().describe('ID récupéré après enregistrer_demande'),
      distanceKm:    z.number().describe('Distance en kilomètres'),
      isAllerRetour: z.boolean().describe('Aller-retour ou simple'),
      nbPassagers:   z.number().describe('Nombre de passagers'),
      dateDepart:    z.string().describe('Date de départ YYYY-MM-DD'),
      dateDemande:   z.string().describe("Date d'aujourd'hui YYYY-MM-DD"),
      options: z.object({
        guide:         z.object({ nbJours: z.number() }).optional(),
        nuitChauffeur: z.object({ nbNuits: z.number() }).optional(),
        peages:        z.number().optional(),
      }).optional(),
    }),
    execute: async ({ demande_id, distanceKm, isAllerRetour,
                      nbPassagers, dateDepart, dateDemande, options }) => {

      const { calculerDevis } = await import('@/lib/calculer-devis')
      const { supabaseAdmin, updateStatut, creerRelance } = await import('@/lib/supabase')

      // 1. Calcule le devis
      const devis = calculerDevis({
        distanceKm, isAllerRetour, nbPassagers,
        dateDepart:  new Date(dateDepart),
        dateDemande: new Date(dateDemande),
        options
      })

      // 2. Enregistre dans la table "devis"
      const { data: devisData, error } = await supabaseAdmin
        .from('devis')
        .insert({
          demande_id,
          prix_ht:      devis.totalHT,
          tva:          devis.totalHT * 0.10,
          prix_ttc:     devis.totalTTC,
          lignes:       devis.supplements,
          coefficients: {
            saison:   devis.coeffSaisonValue,
            date:     devis.coeffDateValue,
            capacite: devis.coeffCapaciteValue,
          }
        })
        .select()
        .single()

      if (error) throw new Error(error.message)

      // 3. Met à jour le statut de la demande
      await updateStatut(demande_id, 'devis_en_cours')

      // 4. Crée une entrée dans la table relance (J+2 automatique)
      await creerRelance(devisData.id)

      // 5. Envoie JUSTE les IDs à n8n
      await fetch(process.env.N8N_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demande_id,
          devis_id: devisData.id
        })
      })

      return {
        success:  true,
        prix_ttc: devis.totalTTC,
        prix_ht:  devis.totalHT,
        message:  `Devis calculé : ${devis.totalTTC}€ TTC. Vous allez recevoir votre proposition par email dans quelques instants.`
      }
    },
  }),

  // OUTIL 3 — Escalader vers un humain 
  escalader_humain: tool({
    description: `
      À appeler quand la demande est hors périmètre ou incohérente.
      Exemples : plus de 85 passagers, zone internationale, date impossible.
    `,
    inputSchema: z.object({
      demande_id: z.string().describe('ID de la demande dans Supabase'),
      raison:     z.string().describe("Raison de l'escalade"),
    }),
    execute: async ({ demande_id, raison }) => {
      const { updateStatut, creerRdv } = await import('@/lib/supabase')

      // 1. Met à jour le statut
      await updateStatut(demande_id, 'reprise_humaine', raison)

      // 2. Crée un RDV en attente pour le commercial
      await creerRdv({
        demande_id,
        canal: 'email',
        notes: raison
      })

      // 3. Notifie n8n pour l'alerte commercial
      await fetch(process.env.N8N_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demande_id,
          type:  'reprise_humaine',
          raison
        })
      })

      return {
        success: true,
        message: 'Un conseiller NeoTravel va vous contacter sous 24h.'
      }
    },
  }),
}