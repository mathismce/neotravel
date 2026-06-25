import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const { text } = await generateText({
  model: deepseek("deepseek-v4-flash"),
  prompt: "Explique les agents IA en français",
});

console.log(text);

curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model":"deepseek-v4-flash",
    "messages":[
      {"role":"user","content":"Bonjour"}
    ]
  }'
  