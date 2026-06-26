// app/api/devis/route.ts

import { calculerDevis } from '@/lib/calculer-devis'

export async function POST(req: Request) {
  const body = await req.json()

  // Convertit les strings en Date 
  const input = {
    distanceKm:    body.distanceKm,
    isAllerRetour: body.isAllerRetour,
    nbPassagers:   body.nbPassagers,
    dateDepart:    new Date(body.dateDepart),
    dateDemande:   new Date(body.dateDemande),
    options:       body.options ?? {},
  }

  // Vérifie les données reçues
  if (!input.distanceKm || !input.nbPassagers || !input.dateDepart || !input.dateDemande) {
    return Response.json(
      { error: 'Paramètres manquants' },
      { status: 400 }
    )
  }

  try {
    const result = calculerDevis(input)
    return Response.json(result)
  } catch (error: any) {
    // Gère le cas CAPACITE_EXCEDEE → escalade humaine
    if (error.message.startsWith('CAPACITE_EXCEDEE')) {
      return Response.json(
        { error: error.message, escalade: true },
        { status: 422 }
      )
    }
    return Response.json(
      { error: 'Erreur de calcul' },
      { status: 500 }
    )
  }
}