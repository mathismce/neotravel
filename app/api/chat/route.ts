// app/api/chat/route.ts

import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import type { UIMessage } from 'ai'
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
3. Date de départ
4. Heure de départ souhaitée
5. Nombre de passagers
6. Options souhaitées (guide, nuit chauffeur, péages)

RÈGLES IMPORTANTES :
- Ne calcule JAMAIS un prix toi-même — utilise toujours l'outil calculer_devis
- Si la demande est hors zone ou incohérente, utilise l'outil escalader_humain
- Pose une seule question à la fois
- Sois concis et professionnel
`

export async function POST(req: Request) {

  // 1. Récupère les messages 
  const { messages }: { messages: UIMessage[] } = await req.json()

  // 2. streamText 
  const result = streamText({
    model: gateway('deepseek-v4-flash'),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages), // ← v6 obligatoire
    tools,
    stopWhen: stepCountIs(5), // ← remplace maxSteps en v6
  })

  // 3. Retourne le stream
  return result.toUIMessageStreamResponse()
}