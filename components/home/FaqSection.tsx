export default function FaqSection() {
  return (
    <section id="faq" className="relative flex items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-6xl text-white">
        <div className="mx-auto mb-16 w-3/4 border-t border-white/20" />

        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-200/80">
          FAQ
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Les réponses aux questions les plus fréquentes.
        </h2>

        <div className="mt-8 space-y-4">
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Combien de temps pour recevoir une estimation ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Une fois votre demande soumise via le formulaire, notre système génère une première estimation en temps réel. Un conseiller valide ensuite le devis et vous le transmet par e-mail sous 2 heures ouvrées, du lundi au samedi. Pour les demandes complexes (groupes importants, trajets sur plusieurs jours), un rappel téléphonique peut être organisé.
            </p>
          </details>
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Peut-on réserver pour plusieurs passagers ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Oui, absolument. Nous disposons de véhicules adaptés à toutes les tailles de groupe : voiture confort jusqu&apos;à 4 passagers, van jusqu&apos;à 8 passagers avec bagages, et bus pour les groupes plus importants. Que ce soit pour une sortie scolaire, un séminaire d&apos;entreprise ou un transfert collectif, nous dimensionnons la flotte à votre besoin.
            </p>
          </details>
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Les tarifs sont-ils fixes ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Nous ne pratiquons pas de tarification à la course fixe. Chaque devis est calculé selon votre trajet, le nombre de passagers, le véhicule souhaité et les éventuelles options (prise en charge à domicile, attente sur place, retour inclus). Cette approche nous permet de vous proposer un prix juste, sans mauvaise surprise.
            </p>
          </details>
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Comment fonctionne le processus de réservation ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              C&apos;est simple et rapide : renseignez vos informations dans le formulaire, notre assistant IA qualifie votre demande en vous posant quelques questions sur votre trajet, puis génère un devis personnalisé. Vous recevez ce devis par e-mail, le validez en ligne, et la réservation est confirmée. Aucun appel téléphonique nécessaire.
            </p>
          </details>
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Quels types de trajets prenez-vous en charge ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Nous couvrons une large gamme de besoins : transferts aéroport et gare, trajets domicile-travail réguliers, sorties scolaires et périscolaires, déplacements professionnels et séminaires d&apos;entreprise, ainsi que les longs trajets interrégionaux. Si vous avez un besoin spécifique, n&apos;hésitez pas à nous le soumettre via le formulaire.
            </p>
          </details>
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Peut-on réserver à la dernière minute ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Nous acceptons les demandes jusqu&apos;à 3 heures avant le départ, sous réserve de disponibilité. Pour garantir votre créneau et le véhicule de votre choix, nous recommandons de réserver au minimum 24 heures à l&apos;avance. Pour les groupes ou événements, un délai de 48 à 72 heures est conseillé.
            </p>
          </details>
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Quelles sont les conditions d&apos;annulation ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Toute annulation effectuée plus de 24 heures avant le départ est gratuite et intégralement remboursée. En deçà de ce délai, des frais d&apos;annulation peuvent s&apos;appliquer selon les conditions du trajet. En cas de force majeure, contactez-nous directement : nous étudions chaque situation au cas par cas.
            </p>
          </details>
          <details className="group rounded-2xl border border-white/10 bg-white/10 p-5">
            <summary className="cursor-pointer list-none text-lg font-semibold outline-none">
              Les chauffeurs parlent-ils plusieurs langues ?
            </summary>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Nos chauffeurs sont francophones et la plupart maîtrisent l&apos;anglais pour les trajets avec des passagers internationaux. Si vous avez besoin d&apos;un accompagnement dans une autre langue, signalez-le dans votre demande et nous ferons notre possible pour y répondre.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}