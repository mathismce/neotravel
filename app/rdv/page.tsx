"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function RdvPage() {
  const searchParams = useSearchParams();
  const demandeId = searchParams.get("demande_id");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: "",
    time: "",
    canal: "visio",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!demandeId) {
      setError("Aucune demande associée à ce rendez-vous.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/rdv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demande_id: demandeId,
          date_rdv: `${form.date}T${form.time}`,
          canal: form.canal,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? `Erreur (${response.status})`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08111f] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,72,123,0.52),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(26,44,88,0.35),transparent_26%),linear-gradient(180deg,rgba(6,10,18,0.92),rgba(8,17,31,0.98))]" />

      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="relative z-10 w-full max-w-[560px] rounded-[40px] border border-lime-300/80 bg-[rgba(247,244,236,0.96)] px-6 py-8 shadow-[0_35px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-10">
          <div className="text-center">
            <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-black tracking-[-0.04em] text-zinc-950">
              Prendre rendez-vous
            </h1>
            <p className="mt-2 text-[1.02rem] text-slate-500">
              Choisissez un créneau avec un commercial pour finaliser votre
              demande.
            </p>
          </div>

          {demandeId ? (
            <p className="mt-5 rounded-md border border-slate-200 bg-white/70 px-4 py-2.5 text-center text-sm text-slate-500">
              Demande&nbsp;
              <span className="font-semibold text-slate-700">#{demandeId}</span>
            </p>
          ) : (
            <p className="mt-5 rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-700">
              Aucune demande associée. Le rendez-vous doit être lancé depuis une
              demande existante.
            </p>
          )}

          {submitted ? (
            <div className="mt-8 rounded-md border border-lime-300 bg-lime-50 px-6 py-8 text-center">
              <p className="text-[1.1rem] font-black text-zinc-950">
                Rendez-vous demandé ✓
              </p>
              <p className="mt-2 text-[0.98rem] text-slate-600">
                Un commercial vous confirmera le créneau du{" "}
                <span className="font-semibold">
                  {form.date} à {form.time}
                </span>{" "}
                très vite.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Modifier le créneau
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Date
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-md border border-slate-200 bg-white/90 px-5 text-[1.02rem] text-slate-800 outline-none transition focus:border-lime-300 focus:ring-2 focus:ring-lime-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Heure
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-md border border-slate-200 bg-white/90 px-5 text-[1.02rem] text-slate-800 outline-none transition focus:border-lime-300 focus:ring-2 focus:ring-lime-200"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                Canal du rendez-vous
                <select
                  name="canal"
                  value={form.canal}
                  onChange={handleChange}
                  className="h-12 w-full rounded-md border border-slate-200 bg-white/90 px-5 text-[1.02rem] text-slate-800 outline-none transition focus:border-lime-300 focus:ring-2 focus:ring-lime-200"
                >
                  <option value="visio">Visioconférence</option>
                  <option value="telephone">Téléphone</option>
                  <option value="presentiel">Présentiel</option>
                </select>
              </label>

              {error && (
                <p className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2.5 text-center text-sm text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !demandeId}
                className="mt-4 flex h-[60px] w-full items-center justify-center gap-3 rounded-md bg-[linear-gradient(90deg,#e6f45d,#a9e45b)] px-6 text-[1.05rem] font-black text-zinc-950 shadow-[0_14px_30px_rgba(171,226,90,0.42)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isSubmitting ? "Envoi en cours…" : "Confirmer mon rendez-vous"}
                {!isSubmitting && (
                  <span aria-hidden="true" className="text-[1.45rem] leading-none">
                    →
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
