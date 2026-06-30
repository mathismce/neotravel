import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export type StatutDemande =
  | 'nouveau_lead'
  | 'en_qualification'
  | 'devis_en_cours'
  | 'devis_envoye'
  | 'relance_j2'
  | 'relance_j5'
  | 'reprise_humaine'
  | 'sans_suite'

export type StatutRdv =
  | 'propose'
  | 'confirme'
  | 'honore'
  | 'annule'

// DEMANDES 

export async function creerDemande(data: {
  prospect_nom:   string
  prospect_email: string
  prospect_tel?:  string
  trajet_depart:  string
  trajet_arrivee: string
  date_depart:    string
  nb_passagers:   number
  options?:        object
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
    .update({ statut, ...(notes && { notes }) })
    .eq('id', demande_id)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function getDemandes() {
  const { data, error } = await supabaseAdmin
    .from('demandes')
    .select('*, devis(*), rdv(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// DEVIS 

export async function creerDevis(data: {
  demande_id:   string
  prix_ht:      number
  tva:          number
  prix_ttc:     number
  distance:     number
  lignes:       object
  coefficients: object
  pdf_url?:     string
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
