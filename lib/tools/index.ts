// lib/tools/index.ts

import { tool } from 'ai'
import { z } from 'zod'

export const tools = {

  // OUTIL 1 — Calculer le devis
  calculer_devis: tool({
    description: `
      Calcule le prix d'un transfert de manière déterministe.
      À appeler uniquement quand TOUTES les informations sont collectées.
      Ne jamais calculer un prix manuellement.
    `,
    inputSchema: z.object({                          
      distance_km:   z.number().describe('Distance en kilomètres'),
      nb_passagers:  z.number().describe('Nombre de passagers'),
      date_depart:   z.string().describe('Date de départ (YYYY-MM-DD)'),
      date_demande:  z.string().describe("Date d'aujourd'hui (YYYY-MM-DD)"),
      type_vehicule: z.string().describe('berline, van ou bus'),
      options: z.object({
         guide:         z.object({ nbJours: z.number() }).optional(),
         nuitChauffeur: z.object({ nbNuits: z.number() }).optional(),
         peages:        z.number().optional(),
      }).optional(),
    }),
    execute: async ({ distance_km, nb_passagers, date_depart, date_demande, type_vehicule, options }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/devis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distance_km, nb_passagers, date_depart, date_demande, type_vehicule, options }),
      })
      return res.json()
    },
  }),

  //  OUTIL 2 — Enregistrer la demande 
  enregistrer_demande: tool({
    description: `
      Enregistre les informations du prospect dans Supabase.
      À appeler dès que le prospect a donné ses coordonnées.
    `,
    inputSchema: z.object({
      prospect_nom:   z.string().describe('Nom du prospect'),
      prospect_email: z.string().describe('Email du prospect'),
      trajet_depart:  z.string().describe('Ville de départ'),
      trajet_arrivee: z.string().describe("Ville d'arrivée"),
      date_depart:    z.string().describe('Date de départ'),
      nb_passagers:   z.number().describe('Nombre de passagers'),
      options:        z.array(z.string()).describe('Options souhaitées'),
    }),
    execute: async ({ prospect_nom, prospect_email, trajet_depart, trajet_arrivee, date_depart, nb_passagers, options }) => {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('demandes')
        .insert({ prospect_nom, prospect_email, trajet_depart, trajet_arrivee, date_depart, nb_passagers, options, statut: 'en_qualification' })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return { success: true, demande_id: data.id }
    },
  }),

  //  OUTIL 3 — Escalader vers un humain 
  escalader_humain: tool({
    description: `
      À appeler quand la demande est hors périmètre ou incohérente.
      Exemples : zone internationale, montant élevé, date impossible.
    `,
    inputSchema: z.object({
      demande_id: z.string().describe('ID de la demande dans Supabase'),
      raison:     z.string().describe("Raison de l'escalade"),
    }),
    execute: async ({ demande_id, raison }) => {
      const { supabase } = await import('@/lib/supabase')
      await supabase
        .from('demandes')
        .update({ statut: 'reprise_humaine', notes: raison })
        .eq('id', demande_id)

      return { success: true, message: 'Un conseiller va vous contacter sous 24h.' }
    },
  }),
}