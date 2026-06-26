export default function HeroSection() {
  return (
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
  );
}