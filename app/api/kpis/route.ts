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
