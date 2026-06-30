import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type TrendType = "positive" | "negative" | "neutral";

type KpiValue = {
  value: string;
  delta: string;
  trend: TrendType;
  note: string;
};

type DemandeRow = {
  id: string;
  statut: string | null;
  created_at: string | null;
};

type DevisRow = {
  demande_id: string;
  prix_ttc: number | null;
};

type EventRow = {
  type: string;
  demande_id: string | null;
  created_at: string | null;
};

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase n'est pas configuré: une URL et une clé Supabase sont requises.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

function isReserved(statut: string | null): boolean {
  const s = statut?.toLowerCase().trim();
  return s === "réservé" || s === "reserve" || s === "réserve" || s === "reservé";
}

function isEscalade(statut: string | null): boolean {
  const s = statut?.toLowerCase().trim();
  return s === "reprise_humaine" || s === "reprise humaine" || s === "à rappeler" || s === "a rappeler";
}

function formatPct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

async function computeKpis(): Promise<Record<string, KpiValue>> {
  const supabase = getSupabaseClient();

  const { data: demandesData, error: demandesError } = await supabase
    .from("demandes")
    .select("id, statut, created_at");

  if (demandesError) {
    throw demandesError;
  }

  const demandes = (demandesData ?? []) as DemandeRow[];

  const demandeIds = demandes.map((d) => d.id);

  const { data: devisData, error: devisError } = await supabase
    .from("devis")
    .select("demande_id, prix_ttc")
    .in("demande_id", demandeIds.length > 0 ? demandeIds : ["__none__"]);

  if (devisError) {
    throw devisError;
  }

  const devis = (devisData ?? []) as DevisRow[];

  // Events : facultatif. Si la table n'existe pas encore, on n'interrompt pas le calcul.
  let events: EventRow[] = [];
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("type, demande_id, created_at");
  if (eventsError) {
    console.warn("Impossible de charger les events:", eventsError.message);
  } else {
    events = (eventsData ?? []) as EventRow[];
  }

  // --- Bornes temporelles (jour glissant) ---
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const startToday = now - DAY;
  const startYesterday = now - 2 * DAY;

  let leadsToday = 0;
  let leadsYesterday = 0;
  for (const d of demandes) {
    if (!d.created_at) continue;
    const t = new Date(d.created_at).getTime();
    if (Number.isNaN(t)) continue;
    if (t >= startToday) leadsToday += 1;
    else if (t >= startYesterday) leadsYesterday += 1;
  }

  const deltaLeads = leadsYesterday === 0
    ? (leadsToday > 0 ? "nouveaux leads" : "0 vs hier")
    : `${leadsToday - leadsYesterday >= 0 ? "+" : ""}${leadsToday - leadsYesterday} vs hier`;
  const trendLeads: TrendType =
    leadsToday > leadsYesterday ? "positive" : leadsToday < leadsYesterday ? "negative" : "neutral";

  // --- Agrégats devis ---
  const demandesAvecDevis = new Set(devis.map((d) => d.demande_id));
  const totalDemandes = demandes.length;
  const totalDevisDemandes = demandesAvecDevis.size;

  const reservedIds = new Set(demandes.filter((d) => isReserved(d.statut)).map((d) => d.id));
  const escaladeCount = demandes.filter((d) => isEscalade(d.statut)).length;

  // Ticket moyen : priorité aux devis des demandes réservées, sinon tous les devis.
  const devisReserves = devis.filter((d) => reservedIds.has(d.demande_id) && d.prix_ttc != null);
  const baseTicket = devisReserves.length > 0 ? devisReserves : devis.filter((d) => d.prix_ttc != null);
  const ticketMoyen =
    baseTicket.length > 0
      ? baseTicket.reduce((sum, d) => sum + (d.prix_ttc ?? 0), 0) / baseTicket.length
      : 0;

  const qualifFraction = totalDemandes > 0 ? totalDevisDemandes / totalDemandes : 0;
  const conversionFraction = totalDevisDemandes > 0 ? reservedIds.size / totalDevisDemandes : 0;
  const escaladeFraction = totalDemandes > 0 ? escaladeCount / totalDemandes : 0;

  // --- KPI basés sur les events ---

  // Taux d'erreur calculer_devis : échecs / (échecs + succès).
  const devisOkCount = events.filter((e) => e.type === "devis_calcule").length;
  const devisErrCount = events.filter((e) => e.type === "devis_erreur").length;
  const devisTotalCount = devisOkCount + devisErrCount;
  const erreurDevisFraction = devisTotalCount > 0 ? devisErrCount / devisTotalCount : 0;

  // Délai devis → réservation : pour chaque demande, premier devis_calcule puis
  // première reservation postérieure. Moyenne exprimée en jours.
  const firstEventTime = (type: string) => {
    const map = new Map<string, number>();
    for (const e of events) {
      if (e.type !== type || !e.demande_id || !e.created_at) continue;
      const t = new Date(e.created_at).getTime();
      if (Number.isNaN(t)) continue;
      const prev = map.get(e.demande_id);
      if (prev === undefined || t < prev) map.set(e.demande_id, t);
    }
    return map;
  };
  const devisTimes = firstEventTime("devis_calcule");
  const resaTimes = firstEventTime("reservation");

  const delais: number[] = [];
  for (const [demandeId, resaT] of resaTimes) {
    const devisT = devisTimes.get(demandeId);
    if (devisT !== undefined && resaT >= devisT) {
      delais.push((resaT - devisT) / DAY);
    }
  }
  const delaiMoyenJours =
    delais.length > 0 ? delais.reduce((sum, d) => sum + d, 0) / delais.length : null;

  // Délai de reprise : entre l'escalade et la première action humaine (reprise_traitee).
  const escaladeTimes = firstEventTime("escalade");
  const repriseTimes = firstEventTime("reprise_traitee");
  const reprises: number[] = [];
  for (const [demandeId, repriseT] of repriseTimes) {
    const escaladeT = escaladeTimes.get(demandeId);
    if (escaladeT !== undefined && repriseT >= escaladeT) {
      reprises.push(repriseT - escaladeT); // en ms
    }
  }
  const delaiRepriseMs =
    reprises.length > 0 ? reprises.reduce((sum, d) => sum + d, 0) / reprises.length : null;

  const formatDuree = (ms: number): string => {
    const minutes = ms / 60000;
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const heures = minutes / 60;
    if (heures < 24) return `${heures.toFixed(1).replace(".", ",")} h`;
    return `${(heures / 24).toFixed(1).replace(".", ",")} j`;
  };

  return {
    leads_jour: {
      value: String(leadsToday),
      delta: deltaLeads,
      trend: trendLeads,
      note: `${totalDemandes} demandes au total dans la base.`,
    },
    qualif_auto: {
      value: formatPct(qualifFraction),
      delta: `${totalDevisDemandes}/${totalDemandes} avec devis`,
      trend: "neutral",
      note: "Part des demandes ayant abouti à un devis.",
    },
    escalade: {
      value: formatPct(escaladeFraction),
      delta: `${escaladeCount} dossier${escaladeCount > 1 ? "s" : ""}`,
      trend: "neutral",
      note: "Demandes transférées à un humain.",
    },
    conversion_devis_resa: {
      value: formatPct(conversionFraction),
      delta: `${reservedIds.size}/${totalDevisDemandes} réservés`,
      trend: "neutral",
      note: "Devis transformés en réservation.",
    },
    ticket_moyen: {
      value: ticketMoyen > 0 ? formatEuro(ticketMoyen) : "—",
      delta: devisReserves.length > 0 ? "sur réservations" : "sur tous les devis",
      trend: "neutral",
      note: devisReserves.length > 0
        ? "Panier moyen des dossiers réservés."
        : "Panier moyen estimé sur l'ensemble des devis.",
    },
    erreur_devis: {
      value: devisTotalCount > 0 ? formatPct(erreurDevisFraction) : "—",
      delta: `${devisErrCount}/${devisTotalCount} appels`,
      // Moins d'erreurs = mieux : vert si 0, rouge sinon.
      trend: devisErrCount === 0 ? "positive" : "negative",
      note: devisTotalCount > 0
        ? "Échecs du calcul de devis sur le total des appels."
        : "Aucun appel calculer_devis enregistré pour l'instant.",
    },
    delai_devis_resa: {
      value: delaiMoyenJours !== null ? `${delaiMoyenJours.toFixed(1).replace(".", ",")} j` : "—",
      delta: `${delais.length} réservation${delais.length > 1 ? "s" : ""}`,
      trend: "neutral",
      note: delaiMoyenJours !== null
        ? "Temps moyen entre le devis et la réservation."
        : "Pas encore de réservation après devis.",
    },
    delai_reprise: {
      value: delaiRepriseMs !== null ? formatDuree(delaiRepriseMs) : "—",
      delta: `${reprises.length} reprise${reprises.length > 1 ? "s" : ""}`,
      trend: "neutral",
      note: delaiRepriseMs !== null
        ? "Temps moyen entre l'escalade et la prise en charge humaine."
        : "Aucun dossier escaladé repris pour l'instant.",
    },
  };
}

export async function GET() {
  try {
    const kpis = await computeKpis();
    return NextResponse.json({ kpis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de calculer les KPI.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
