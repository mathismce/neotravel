export default function AboutSection() {
  return (
    <section
      id="qui-sommes-nous"
      className="relative flex items-center px-4 py-0 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl text-white">
        <div className="mx-auto mb-16 w-3/4 border-t border-white/20" />

        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-200/80">
          Qui sommes-nous
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Un intermédiaire de confiance pour vos trajets en groupe.
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-base leading-8 text-white/70">
            Neotravel est né d&apos;un constat simple : organiser un trajet en groupe ne devrait pas être une source de stress. Trop souvent, les entreprises, associations et établissements scolaires perdent un temps précieux à comparer des prestataires, négocier des tarifs et coordonner des devis incomplets. Nous avons décidé de changer ça.
          </p>
          <p className="text-base leading-8 text-white/70">
            En tant qu&apos;intermédiaire spécialisé dans le transport collectif par autocar, nous mettons en relation nos clients avec un réseau de transporteurs fiables et sélectionnés. Notre rôle : simplifier chaque étape, de la demande de devis jusqu&apos;à la confirmation de réservation, grâce à un processus entièrement digitalisé et piloté par l&apos;intelligence artificielle.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">Notre mission</p>
            <p className="mt-3 text-base leading-7 text-white/80">
              Rendre le transport de groupe accessible, transparent et sans friction pour tous nos clients.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">Notre approche</p>
            <p className="mt-3 text-base leading-7 text-white/80">
              Un assistant IA qualifie votre besoin, génère un devis sur-mesure et déclenche un suivi automatisé, sans vous faire attendre.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">Notre engagement</p>
            <p className="mt-3 text-base leading-7 text-white/80">
              Réponse sous 2 heures, devis personnalisé et accompagnement humain disponible du lundi au samedi.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 w-3/4 border-b border-white/20" />
      </div>
    </section>
  );
}