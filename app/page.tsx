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
  id="qui-sommes-nous"
  className="relative flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8"
>
  <div className="relative z-10 mx-auto w-full max-w-6xl rounded-[32px] border border-white/12 bg-white/10 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-8">
    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-200/80">
      Qui sommes-nous
    </p>
    <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
      Un intermédiaire de confiance pour vos trajets en groupe.
    </h2>

    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <p className="text-base leading-8 text-white/70">
        Neotravel est né d'un constat simple : organiser un trajet en groupe ne devrait pas être une source de stress. Trop souvent, les entreprises, associations et établissements scolaires perdent un temps précieux à comparer des prestataires, négocier des tarifs et coordonner des devis incomplets. Nous avons décidé de changer ça.
      </p>
      <p className="text-base leading-8 text-white/70">
        En tant qu'intermédiaire spécialisé dans le transport collectif par autocar, nous mettons en relation nos clients avec un réseau de transporteurs fiables et sélectionnés. Notre rôle : simplifier chaque étape, de la demande de devis jusqu'à la confirmation de réservation, grâce à un processus entièrement digitalisé et piloté par l'intelligence artificielle.
      </p>
    </div>

    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">Notre mission</p>
        <p className="mt-3 text-base leading-7 text-white/80">
          Rendre le transport de groupe accessible, transparent et sans friction pour tous nos clients.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">Notre approche</p>
        <p className="mt-3 text-base leading-7 text-white/80">
          Un assistant IA qualifie votre besoin, génère un devis sur-mesure et déclenche un suivi automatisé, sans vous faire attendre.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">Notre engagement</p>
        <p className="mt-3 text-base leading-7 text-white/80">
          Réponse sous 2 heures, devis personnalisé et accompagnement humain disponible du lundi au samedi.
        </p>
      </div>
    </div>
  </div>
</section>

      <section
  
  id="avis"
  className="relative flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8"
>
  <div className="relative z-10 mx-auto w-full max-w-6xl rounded-[32px] border border-white/12 bg-white/10 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-8">

    <div className="flex items-start justify-between gap-6 flex-wrap">
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
        <a href="#" className="mt-2 block text-sm text-white/40 underline underline-offset-2 hover:text-white/70 transition-colors">
          Voir la source externe
        </a>
      </div>
    </div>

    <div className="mt-10 grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <div className="inline-flex items-center gap-0.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1">
          {"★★★★★".split("").map((s, i) => (
            <span key={i} className="text-lime-300 text-sm">{s}</span>
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
            <span key={i} className="text-lime-300 text-sm">{s}</span>
          ))}
        </div>
        <p className="mt-5 text-sm italic leading-6 text-white/80">
          Rapport qualité-prix imbattable pour notre voyage de fin d'année. Toute l'équipe était ravie.
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          - Lucas B., BDE Sciences Po
        </p>
      </article>

      <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <div className="inline-flex items-center gap-0.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1">
          {"★★★★★".split("").map((s, i) => (
            <span key={i} className="text-lime-300 text-sm">{s}</span>
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
          Une fois votre demande soumise via le formulaire, notre système génère une première estimation en temps réel. Un conseiller valide ensuite le devis et vous le transmet par e-mail sous 2 heures ouvrées, du lundi au samedi. Pour les demandes complexes (groupes importants, trajets sur plusieurs jours), un rappel téléphonique peut être organisé.
        </p>
      </details>
      <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
        <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
          Peut-on réserver pour plusieurs passagers ?
        </summary>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Oui, absolument. Nous disposons de véhicules adaptés à toutes les tailles de groupe : voiture confort jusqu'à 4 passagers, van jusqu'à 8 passagers avec bagages, et bus pour les groupes plus importants. Que ce soit pour une sortie scolaire, un séminaire d'entreprise ou un transfert collectif, nous dimensionnons la flotte à votre besoin.
        </p>
      </details>
      <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
        <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
          Les tarifs sont-ils fixes ?
        </summary>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Nous ne pratiquons pas de tarification à la course fixe. Chaque devis est calculé selon votre trajet, le nombre de passagers, le véhicule souhaité et les éventuelles options (prise en charge à domicile, attente sur place, retour inclus). Cette approche nous permet de vous proposer un prix juste, sans mauvaise surprise.
        </p>
      </details>
      <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
        <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
          Comment fonctionne le processus de réservation ?
        </summary>
        <p className="mt-3 text-sm leading-6 text-white/70">
          C'est simple et rapide : renseignez vos informations dans le formulaire, notre assistant IA qualifie votre demande en vous posant quelques questions sur votre trajet, puis génère un devis personnalisé. Vous recevez ce devis par e-mail, le validez en ligne, et la réservation est confirmée. Aucun appel téléphonique nécessaire.
        </p>
      </details>
      <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
        <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
          Quels types de trajets prenez-vous en charge ?
        </summary>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Nous couvrons une large gamme de besoins : transferts aéroport et gare, trajets domicile-travail réguliers, sorties scolaires et périscolaires, déplacements professionnels et séminaires d'entreprise, ainsi que les longs trajets interrégionaux. Si vous avez un besoin spécifique, n'hésitez pas à nous le soumettre via le formulaire.
        </p>
      </details>
      <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
        <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
          Peut-on réserver à la dernière minute ?
        </summary>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Nous acceptons les demandes jusqu'à 3 heures avant le départ, sous réserve de disponibilité. Pour garantir votre créneau et le véhicule de votre choix, nous recommandons de réserver au minimum 24 heures à l'avance. Pour les groupes ou événements, un délai de 48 à 72 heures est conseillé.
        </p>
      </details>
      <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
        <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
          Quelles sont les conditions d'annulation ?
        </summary>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Toute annulation effectuée plus de 24 heures avant le départ est gratuite et intégralement remboursée. En deçà de ce délai, des frais d'annulation peuvent s'appliquer selon les conditions du trajet. En cas de force majeure, contactez-nous directement : nous étudions chaque situation au cas par cas.
        </p>
      </details>
      <details className="group rounded-2xl border border-white/10 bg-black/20 p-5">
        <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
          Les chauffeurs parlent-ils plusieurs langues ?
        </summary>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Nos chauffeurs sont francophones et la plupart maîtrisent l'anglais pour les trajets avec des passagers internationaux. Si vous avez besoin d'un accompagnement dans une autre langue, signalez-le dans votre demande et nous ferons notre possible pour y répondre.
        </p>
      </details>
    </div>
  </div>
</section>
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
          L'intermédiaire digital pour vos trajets en groupe. Devis personnalisé, réponse rapide, zéro friction.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Navigation</p>
        <ul className="mt-4 space-y-2">
          <li><a href="#form" className="text-sm text-white/60 hover:text-white transition-colors">Réserver un trajet</a></li>
          <li><a href="#vehicules" className="text-sm text-white/60 hover:text-white transition-colors">Nos véhicules</a></li>
          <li><a href="#qui-sommes-nous" className="text-sm text-white/60 hover:text-white transition-colors">Qui sommes-nous</a></li>
          <li><a href="#avis" className="text-sm text-white/60 hover:text-white transition-colors">Avis clients</a></li>
          <li><a href="#faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</a></li>
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Contact</p>
        <ul className="mt-4 space-y-2">
          <li><a href="mailto:contact@neotravel.fr" className="text-sm text-white/60 hover:text-white transition-colors">contact@neotravel.fr</a></li>
          <li><span className="text-sm text-white/60">Lun – Sam, 9h – 19h</span></li>
        </ul>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Suivez-nous</p>
        <div className="mt-3 flex gap-3">
          <a href="#" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
    </div>

    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
      <p className="text-xs text-white/30">© 2025 Neotravel. Tous droits réservés.</p>
      <div className="flex gap-6">
        <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Mentions légales</a>
        <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Politique de confidentialité</a>
        <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">CGU</a>
      </div>
    </div>

  </div>
</footer>
</main>

  );
}