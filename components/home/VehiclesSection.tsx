import Image from "next/image";

export default function VehiclesSection() {
  return (
    <section
      id="vehicules"
      className="relative flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8"
    >
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
  );
}