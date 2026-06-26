export default function ReviewsSection() {
  return (
    <section
      id="avis"
      className="relative flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl rounded-[32px] border border-white/12 bg-white/10 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/40 bg-lime-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              Avis certifiés
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              Ils nous ont fait confiance
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-4 text-right">
            <p className="text-4xl font-black text-lime-300">5/5</p>
            <p className="mt-1 text-sm text-white/60">6 avis vérifiés</p>
            <p className="text-sm text-white/60">Trusted Shops</p>
            <a href="#" className="mt-2 block text-sm text-white/40 underline underline-offset-2 transition-colors hover:text-white/70">
              Voir la source externe
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-sm text-lime-300">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm italic leading-6 text-white/80">
              Service impeccable, chauffeur ponctuel et véhicule très confortable. Je recommande sans hésiter.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              - Sophie M., Directrice RH
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-sm text-lime-300">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm italic leading-6 text-white/80">
              Rapport qualité-prix imbattable pour notre voyage de fin d&apos;année. Toute l&apos;équipe était ravie.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              - Lucas B., BDE Sciences Po
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-sm text-lime-300">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm italic leading-6 text-white/80">
              Dix ans de collaboration sans une seule mauvaise surprise. Un partenaire de confiance pour nos déplacements professionnels.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              - François D., Association Nationale
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}