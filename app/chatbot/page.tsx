"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

function ChatbotContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const collected = [name && `Nom: ${name}`, email && `Email: ${email}`, phone && `Téléphone: ${phone}`]
      .filter(Boolean)
      .join(" • ");

    return [
      {
        id: 1,
        role: "assistant" as const,
        text: "Bonjour, je suis l'assistant NeoTravel. Décrivez votre trajet et je vous aide à qualifier votre demande.",
      },
      ...(collected
        ? [
            {
              id: 2,
              role: "assistant" as const,
              text: `Merci. J'ai bien reçu vos informations (${collected}). Quel est votre point de départ ?`,
            },
          ]
        : []),
    ];
  });
  
  const endRef = useRef<HTMLDivElement | null>(null);

  // Gestion de la soumission via la touche Entrée
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); 

      const form = event.currentTarget.form;
      if (form) {
        form.requestSubmit(); 
      }
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); // On ajoute isLoading pour défiler aussi quand l'animation apparaît

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = searchParams.get("name") || '';
    const email = searchParams.get("email") || '';
    const phone = searchParams.get("phone") || '';

    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: trimmed
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    const messagesAvecContexte = [
      {
        role: 'system' as const,
        content: `Informations déjà collectées via le formulaire :
        - Nom : ${name}
        - Email : ${email}
        - Téléphone : ${phone}
        Ne redemande JAMAIS ces informations au prospect. Tu les as déjà.`
      },
      ...updatedMessages.map(m => ({
        role: m.role,
        content: m.text
      }))
    ];

    setIsLoading(true); // On lance l'animation de réflexion

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesAvecContexte })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let agentText = '';
      let hasCreatedMessage = false;
      const agentMessageId = Date.now() + 1;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const raw = line.slice(6).trim();
              if (raw === '[DONE]') break;

              try {
                const parsed = JSON.parse(raw);

                if (parsed.type === 'text-delta') {
                  agentText += parsed.delta;
                  
                  if (!hasCreatedMessage) {
                    setIsLoading(false); // On coupe l'animation dès le premier mot reçu
                    setMessages(prev => [...prev, { id: agentMessageId, role: 'assistant', text: agentText }]);
                    hasCreatedMessage = true;
                  } else {
                    setMessages(prev =>
                      prev.map(m =>
                        m.id === agentMessageId ? { ...m, text: agentText } : m
                      )
                    );
                  }
                }
              } catch {
                // ignore
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Sécurité pour couper l'animation quoi qu'il arrive
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08111f] px-4 py-10 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,104,174,0.38),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(25,49,100,0.26),transparent_24%),linear-gradient(180deg,rgba(5,10,20,0.94),rgba(9,19,35,0.98))]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <section className="flex h-[calc(100vh-5rem)] w-full flex-col overflow-hidden rounded-[36px] border border-white/12 bg-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <header className="border-b border-white/10 px-6 py-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-200/80">
              Assistant NeoTravel
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              Discussion de qualification
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-base">
              Parlez directement à l&apos;assistant. Il collecte les informations de votre trajet au fil de la conversation.
            </p>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[70%] sm:text-[0.98rem] ${
                      message.role === "user"
                        ? "bg-lime-300 text-zinc-950"
                        : "border border-white/10 bg-black/25 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Animation de réflexion de l'assistant */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-lime-300 [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-lime-300 [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-lime-300"></span>
                  </div>
                </div>
              )}
              
              <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl items-end gap-3">
              <div className="flex-1">
                <label htmlFor="chat-input" className="sr-only">
                  Votre message
                </label>
                <textarea
                  id="chat-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrivez votre message..."
                  rows={2}
                  className="min-h-[56px] w-full resize-none rounded-2xl border border-white/12 bg-[#f7f4ec] px-4 py-3 text-zinc-950 outline-none transition placeholder:text-slate-500 focus:border-lime-300 focus:ring-2 focus:ring-lime-200"
                />
              </div>
              <button
                type="submit"
                className="flex h-[56px] items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#e6f45d,#a9e45b)] px-5 text-sm font-black text-zinc-950 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Envoyer
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ChatbotPage() {
  return (
    <Suspense fallback={null}>
      <ChatbotContent />
    </Suspense>
  );
}