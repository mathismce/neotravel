// app/api/chat/route.ts

import { streamText, stepCountIs } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { tools } from '@/lib/tools'

const SYSTEM_PROMPT = `
Tu es l'assistant commercial de NeoTravel, une agence de transport haut de gamme.

TON RÔLE :
- Accueillir le prospect chaleureusement
- Collecter les informations nécessaires pour établir un devis
- Appeler l'outil calculer_devis quand tu as TOUTES les informations
- Enregistrer la demande dans la base de données

INFORMATIONS OBLIGATOIRES à collecter :
1. Ville de départ
2. Ville d'arrivée
3. Distance en kilomètres (calcule ou demande, de préférence calcule)
4. Aller simple ou aller-retour
5. Date de départ
6. Heure de départ souhaitée
7. Nombre de passagers

OPTIONS À PROPOSER SYSTÉMATIQUEMENT :
- Guide / accompagnateur : +80€ par jour — combien de jours ?
- Nuit chauffeur : +120€ par nuit — combien de nuits ?
- Péages inclus : forfait selon trajet — souhaite-t-il les inclure ?

RÈGLES IMPORTANTES :
- Ne calcule JAMAIS un prix toi-même — utilise toujours l'outil calculer_devis
- Si nbPassagers > 85 → utilise l'outil escalader_humain immédiatement
- Si la date de depart est dans moins de 3 jours → utilise l'outil escalader_humain 
- Si le montant du devis depasse les 3000 euro → utilise l'outil escalader_humain
- Si la demande est hors zone ou incohérente → utilise l'outil escalader_humain
- Pose une seule question à la fois
- Sois concis et professionnel
- Toujours proposer les options avant d'appeler calculer_devis
- Si le prospect refuse toutes les options, appelle calculer_devis sans options
`

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Messages au format simple {role, content} — pas besoin de convertToModelMessages
    const messages = body.messages as { role: 'user' | 'assistant', content: string }[]

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Messages manquants' }, { status: 400 })
    }

    const result = streamText({
      model: gateway('deepseek-v4-flash'),
      system: SYSTEM_PROMPT,
      messages, // ← directement sans conversion
      tools,
      stopWhen: stepCountIs(5),
    })

    return result.toUIMessageStreamResponse()

  } catch (error) {
    console.error('ERREUR AGENT:', error)
    return Response.json({ error: String(error) }, { status: 500 })
  }
}