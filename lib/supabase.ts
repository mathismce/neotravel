import { createClient } from '@supabase/supabase-js'


// CLIENTS 

// Client public — frontend
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Client admin — API routes et tools 
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// TYPES 

export type StatutDemande =
  | 'nouveau_lead'
  | 'en_qualification'
  | 'devis_en_cours'
  | 'devis_envoye'
  | 'relance_j2'
  | 'relance_j5'
  | 'reprise_humaine'
  | 'sans_suite'

// HELPERS DEMANDES 

export async function creerDemande(data: {
  prospect_nom: string
  prospect_email: string
  trajet_depart: string
  trajet_arrivee: string
  date_depart: string
  nb_passagers: number
  options: object
}) {
  const { data: result, error } = await supabaseAdmin
    .from('demandes')
    .insert({ ...data, statut: 'nouveau_lead' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return result
}

export async function updateStatut(
  demande_id: string,
  statut: StatutDemande,
  notes?: string
) {
  const { error } = await supabaseAdmin
    .from('demandes')
    .update({
      statut,
      ...(notes && { notes })  
    })
    .eq('id', demande_id)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function getDemandes() {
  const { data, error } = await supabaseAdmin
    .from('demandes')
    .select('*, devis(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// HELPERS DEVIS 

export async function creerDevis(data: {
  demande_id: string
  prix_ht: number
  tva: number
  prix_ttc: number
  lignes: object
  coefficients: object
  pdf_url?: string
}) {
  const { data: result, error } = await supabaseAdmin
    .from('devis')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return result
}

export async function updatePdfUrl(devis_id: string, pdf_url: string) {
  const { error } = await supabaseAdmin
    .from('devis')
    .update({ pdf_url })
    .eq('id', devis_id)

  if (error) throw new Error(error.message)
  return { success: true }
}

// HELPERS RELANCE 

export async function creerRelance(devis_id: string) {
  // Planifie automatiquement J+2
  const prochaineRelance = new Date(
    Date.now() + 2 * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data: result, error } = await supabaseAdmin
    .from('relance')
    .insert({
      devis_id,
      nb_relances: 0,
      prochaine_relance: prochaineRelance
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return result
}

export async function incrementerRelance(relance_id: string) {
  // Récupère le nb_relances actuel
  const { data: relance, error: fetchError } = await supabaseAdmin
    .from('relance')
    .select('nb_relances')
    .eq('id', relance_id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const nbRelances = relance.nb_relances + 1

  // Calcule la prochaine relance 
  const prochaineRelance = nbRelances === 1
    ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    : nbRelances === 2
    ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    : null  // plus de relances après 3

  const { error } = await supabaseAdmin
    .from('relance')
    .update({ nb_relances: nbRelances, prochaine_relance: prochaineRelance })
    .eq('id', relance_id)

  if (error) throw new Error(error.message)
  return { success: true, nbRelances }
}

export async function getRelancesDues() {
  // Retourne toutes les relances dont la date est dépassée
  const { data, error } = await supabaseAdmin
    .from('relance')
    .select('*, devis(*, demandes(*))')
    .lte('prochaine_relance', new Date().toISOString())
    .lt('nb_relances', 3)  // max 3 relances

  if (error) throw new Error(error.message)
  return data
}

