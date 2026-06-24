import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#08111f] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,72,123,0.52),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(26,44,88,0.35),transparent_26%),linear-gradient(180deg,rgba(6,10,18,0.92),rgba(8,17,31,0.98))]" />

      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/img_bg.jpg')] bg-cover bg-center bg-no-repeat opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,72,123,0.18),transparent_30%),linear-gradient(180deg,rgba(6,10,18,0.72),rgba(8,17,31,0.88))]" />

        <div className="relative z-10 w-full max-w-[690px] rounded-[40px] border border-lime-300/80 bg-[rgba(247,244,236,0.96)] px-6 py-5 shadow-[0_35px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-10 sm:py-7">
          <div className="mb-10 flex gap-5 px-7 sm:px-9">
            <div className="h-1.5 flex-1 rounded-full bg-lime-300" />
            <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
            <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
            <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
          </div>

          <div className="mx-auto max-w-[560px] text-center">
            <h1 className="text-[clamp(2rem,4vw,3.15rem)] font-black tracking-[-0.04em] text-zinc-950">
              Réservez votre trajet
            </h1>
            <p className="mt-1 text-[1.05rem] text-slate-500 sm:text-[1.1rem]">
              Entrez vos informations pour demarrer la qualification AI.
            </p>
          </div>

          <form
            id="form"
            action="/chatbot"
            method="get"
            target="_blank"
            className="mx-auto mt-8 max-w-[560px] space-y-4 sm:mt-7"
          >
            <input
              type="text"
              name="name"
              placeholder="Nom & Prenom"
              className="h-12 w-full rounded-md border border-slate-200 bg-white/90 px-5 text-[1.02rem] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-lime-300 focus:ring-2 focus:ring-lime-200"
            />
            <input
              type="email"
              name="email"
              placeholder="Adresse E-mail"
              className="h-12 w-full rounded-md border border-slate-200 bg-white/90 px-5 text-[1.02rem] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-lime-300 focus:ring-2 focus:ring-lime-200"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telephone"
              className="h-12 w-full rounded-md border border-slate-200 bg-white/90 px-5 text-[1.02rem] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-lime-300 focus:ring-2 focus:ring-lime-200"
            />

            <button
              type="submit"
              className="mt-8 flex h-[60px] w-full items-center justify-center gap-3 rounded-md bg-[linear-gradient(90deg,#e6f45d,#a9e45b)] px-6 text-[1.05rem] font-black text-zinc-950 shadow-[0_14px_30px_rgba(171,226,90,0.42)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Lancer mon estimation en direct
              <span aria-hidden="true" className="text-[1.45rem] leading-none">
                →
              </span>
            </button>
          </form>

          <p className="mt-5 text-center text-[0.95rem] text-slate-500">
            En ligne - Reponse sous 2 h - Lun-Sam
          </p>
        </div>
      </section>

      <section
        id="vehicules"
        className="relative flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,104,174,0.42),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(25,49,100,0.32),transparent_24%),linear-gradient(180deg,rgba(5,10,20,0.94),rgba(9,19,35,0.98))]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl rounded-[32px] border border-white/12 bg-white/10 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-200/80">
              Nos véhicules
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              Une flotte pensée pour chaque trajet.
            </h2>
            <p className="mt-4 max-w-xl text-white/72">
              Choisis la configuration adaptée à ton besoin, du transport discret au véhicule premium pour groupe ou long trajet.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <div className="relative h-48 w-full">
                <Image src="/voiture.jpg" alt="Voiture de transport" fill className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,14,0.04),rgba(4,8,14,0.65))]" />
              </div>
              <div className="p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-white/50">Voiture</p>
              <h3 className="mt-3 text-xl font-bold">Confort urbain</h3>
              <p className="mt-2 text-sm text-white/68">Pour les trajets rapides, rendez-vous et transferts simples.</p>
              </div>
            </article>
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <div className="relative h-48 w-full">
                <Image src="/bus.jpg" alt="Bus de transport" fill className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,14,0.04),rgba(4,8,14,0.65))]" />
              </div>
              <div className="p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-white/50">Bus</p>
              <h3 className="mt-3 text-xl font-bold">Groupe & bagages</h3>
              <p className="mt-2 text-sm text-white/68">Idéal pour les familles, équipes et trajets avec volume important.</p>
              </div>
            </article>
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <div className="relative h-48 w-full">
                <Image src="/vip.jpeg" alt="Véhicule VIP" fill className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,14,0.04),rgba(4,8,14,0.65))]" />
              </div>
              <div className="p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-white/50">VIP</p>
              <h3 className="mt-3 text-xl font-bold">Expérience premium</h3>
              <p className="mt-2 text-sm text-white/68">Pour les déplacements exigeants avec une présentation haut de gamme.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        id="tarifs"
        className="relative flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-white/12 bg-[#f7f4ec] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.22)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-700/80">
            Tarifs
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-zinc-950 sm:text-4xl">
            Des prix lisibles et adaptés à ton trajet.
          </h2>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-bold text-zinc-950">à definir</h3>
              <p className="mt-2 text-sm text-slate-500"></p>
              <p className="mt-6 text-4xl font-black text-zinc-950"></p>
            </article>
            <article className="rounded-3xl border border-lime-300 bg-lime-50 p-6 ring-1 ring-lime-200">
              <h3 className="text-xl font-bold text-zinc-950">à definir</h3>
              <p className="mt-2 text-sm text-slate-600">.</p>
              <p className="mt-6 text-4xl font-black text-zinc-950"></p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-bold text-zinc-950">à definir</h3>
              <p className="mt-2 text-sm text-slate-500"></p>
              <p className="mt-6 text-4xl font-black text-zinc-950"></p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-white/12 bg-white/10 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-200/80">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
            Les réponses aux questions les plus fréquentes.
          </h2>

          <div className="mt-8 space-y-4">
            <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
              <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
                Combien de temps pour recevoir une estimation ?
              </summary>
              <p className="mt-3 text-sm leading-6 text-white/70">
                La réponse est généralement envoyée sous 2 heures ouvrées, du lundi au samedi.
              </p>
            </details>
            <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
              <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
                Peut-on réserver pour plusieurs passagers ?
              </summary>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Oui, les véhicules Van et VIP sont adaptés aux groupes et aux transferts avec bagages.
              </p>
            </details>
            <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
              <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
                Les tarifs sont-ils fixes ?
              </summary>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Les prix indiqués servent de repères. Le devis final dépend surtout du trajet, de l’horaire et du véhicule choisi.
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 bg-[#08111f] px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/50">
          À définir
        </p>
      </footer>
    </main>
  );
}
