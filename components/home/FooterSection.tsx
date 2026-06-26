export default function FooterSection() {
  return (
    <footer className="relative border-t border-white/10 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-xs font-black tracking-[0.22em] text-lime-200">
                NT
              </div>
              <div className="leading-tight">
                <span className="block text-sm font-semibold uppercase tracking-[0.26em] text-white/90">
                  NeoTravel
                </span>
                <span className="block text-xs text-white/50">Estimation de trajet</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/50">
              L&apos;intermédiaire digital pour vos trajets en groupe. Devis personnalisé, réponse rapide, zéro friction.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Navigation</p>
            <ul className="mt-4 space-y-2">
              <li><a href="#form" className="text-sm text-white/60 transition-colors hover:text-white">Réserver un trajet</a></li>
              <li><a href="#vehicules" className="text-sm text-white/60 transition-colors hover:text-white">Nos véhicules</a></li>
              <li><a href="#qui-sommes-nous" className="text-sm text-white/60 transition-colors hover:text-white">Qui sommes-nous</a></li>
              <li><a href="#avis" className="text-sm text-white/60 transition-colors hover:text-white">Avis clients</a></li>
              <li><a href="#faq" className="text-sm text-white/60 transition-colors hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Contact</p>
            <ul className="mt-4 space-y-2">
              <li><a href="mailto:contact@neotravel.fr" className="text-sm text-white/60 transition-colors hover:text-white">contact@neotravel.fr</a></li>
              <li><span className="text-sm text-white/60">Lun – Sam, 9h – 19h</span></li>
            </ul>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Suivez-nous</p>
            <div className="mt-3 flex gap-3">
              <a href="#" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 transition-colors hover:text-white">LinkedIn</a>
              <a href="#" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 transition-colors hover:text-white">Instagram</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-xs text-white/30">© 2025 Neotravel. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">Mentions légales</a>
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">Politique de confidentialité</a>
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
}