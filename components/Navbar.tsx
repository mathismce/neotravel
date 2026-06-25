export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#08111f]/75 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <a href="#form" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sm font-black tracking-[0.22em] text-lime-200 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
            NT
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-semibold uppercase tracking-[0.26em] text-white/90">
              NeoTravel
            </span>
            <span className="block text-xs text-white/55">Estimation de trajet</span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/75 md:flex">
          <a href="#form" className="transition-colors hover:text-white">
            Réserver un trajet
          </a>
          <a href="#vehicules" className="transition-colors hover:text-white">
            Nos Véhicules
          </a>
          <a href="#qui-sommes-nous" className="transition-colors hover:text-white">
  Qui sommes-nous
</a>
          <a href="#avis" className="transition-colors hover:text-white">
            Avis
          </a>
          <a href="#faq" className="transition-colors hover:text-white">
            FAQ
          </a>
        </nav>

        <a
          href="#form"
          className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/15"
        >
          Commencer
        </a>
      </div>
    </header>
  );
}
