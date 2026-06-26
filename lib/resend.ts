import { Resend } from 'resend'
import type { DevisOutput } from './calculer-devis'

const resend = new Resend(process.env.RESEND_API_KEY)

// TYPE 
interface ProspectInfo {
  nom: string
  email: string
  trajetDepart: string
  trajetArrivee: string
  dateDepart: string
  nbPassagers: number
}

// EMAIL 1 — Envoi du devis initial 
export async function envoyerDevis(
  prospect: ProspectInfo,
  devis: DevisOutput
) {
  return resend.emails.send({
    from: 'devis@neotravel.fr',
    to: prospect.email,
    subject: `Votre devis NeoTravel — ${prospect.trajetDepart} → ${prospect.trajetArrivee}`,
    html: `
      <h2>Bonjour ${prospect.nom},</h2>
      <p>Suite à votre demande, voici votre devis pour le transfert du ${prospect.dateDepart}.</p>

      <table>
        <tr><td>Trajet</td><td>${prospect.trajetDepart} → ${prospect.trajetArrivee}</td></tr>
        <tr><td>Passagers</td><td>${prospect.nbPassagers}</td></tr>
        <tr><td>Tarif base</td><td>${devis.tarifBase} €</td></tr>
        <tr><td>Suppléments</td><td>${devis.supplements.total} €</td></tr>
        <tr><td><strong>Total HT</strong></td><td><strong>${devis.totalHT} €</strong></td></tr>
        <tr><td><strong>Total TTC (TVA 10%)</strong></td><td><strong>${devis.totalTTC} €</strong></td></tr>
      </table>

      <p>Ce devis est valable 7 jours.</p>
      <p>
        Vous souhaitez en discuter avec l'un de nos conseillers ?<br/>
        <a href="${process.env.NEXT_PUBLIC_BOOKING_URL}" 
           style="
             display: inline-block;
             margin-top: 12px;
             padding: 12px 24px;
             background-color: #1D9E75;
             color: white;
             text-decoration: none;
             border-radius: 6px;
             font-weight: bold;
           ">
          📅 Prendre rendez-vous avec un conseiller
        </a>
      </p>

      <p>L'équipe NeoTravel</p>

      <p>L'équipe NeoTravel</p>
    `
  })
}

// EMAIL 2 — Relance J+2 
export async function envoyerRelanceJ2(prospect: ProspectInfo) {
  return resend.emails.send({
    from: 'devis@neotravel.fr',
    to: prospect.email,
    subject: `Votre devis NeoTravel — Avez-vous eu le temps de consulter notre proposition ?`,
    html: `
      <h2>Bonjour ${prospect.nom},</h2>
      <p>Nous espérons que vous avez bien reçu notre devis pour votre transfert 
      ${prospect.trajetDepart} → ${prospect.trajetArrivee}.</p>
      <p>Avez-vous eu le temps de le consulter ? Nous restons disponibles pour 
      toute question ou ajustement.</p>
      <p>L'équipe NeoTravel</p>
    `
  })
}

//  EMAIL 3 — Relance J+5 
export async function envoyerRelanceJ5(prospect: ProspectInfo) {
  return resend.emails.send({
    from: 'devis@neotravel.fr',
    to: prospect.email,
    subject: `NeoTravel — Votre date de départ approche`,
    html: `
      <h2>Bonjour ${prospect.nom},</h2>
      <p>Votre date de départ pour ${prospect.trajetDepart} → ${prospect.trajetArrivee} 
      approche. Souhaitez-vous confirmer votre réservation ?</p>
      <p>Notre équipe est disponible pour finaliser votre transfert dans les 
      meilleures conditions.</p>
      <p>L'équipe NeoTravel</p>
    `
  })
}

//  EMAIL 4 — Reprise humaine prospect 
export async function envoyerEmailRepriseProspect(prospect: ProspectInfo) {
  return resend.emails.send({
    from: 'devis@neotravel.fr',
    to: prospect.email,
    subject: `NeoTravel — Un conseiller va vous contacter`,
    html: `
      <h2>Bonjour ${prospect.nom},</h2>
      <p>Votre demande nécessite une attention particulière de notre équipe.</p>
      <p>Un conseiller NeoTravel vous contactera sous <strong>24h</strong> 
      pour finaliser votre devis personnalisé.</p>
      <p>L'équipe NeoTravel</p>
    `
  })
}

//  EMAIL 5 — Alerte commercial 
export async function envoyerAlerteCommercial(
  prospect: ProspectInfo,
  raison: string
) {
  return resend.emails.send({
    from: 'system@neotravel.fr',
    to: 'commercial@neotravel.fr',
    subject: `⚠ Reprise humaine requise — ${prospect.nom}`,
    html: `
      <h2>Intervention requise</h2>
      <p><strong>Prospect :</strong> ${prospect.nom} (${prospect.email})</p>
      <p><strong>Trajet :</strong> ${prospect.trajetDepart} → ${prospect.trajetArrivee}</p>
      <p><strong>Date départ :</strong> ${prospect.dateDepart}</p>
      <p><strong>Passagers :</strong> ${prospect.nbPassagers}</p>
      <p><strong>Raison de l'escalade :</strong> ${raison}</p>
    `
  })
}