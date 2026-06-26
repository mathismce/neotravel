import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type LeadStatus = "À traiter" | "À rappeler" | "Réservé" | "Relance en cours" | "À relancer";

type DemandeRow = {
  id: string;
  prospect_nom: string | null;
  prospect_email: string | null;
  trajet_depart: string | null;
  trajet_arrivee: string | null;
  date_depart: string | null;
  nb_passagers: number | null;
  options: Record<string, unknown> | null;
  statut: string | null;
  created_at: string | null;
};

type LeadPayload = {
  id: string;
  name: string;
  phone: string;
  email: string;
  route: string;
  departureDate: string;
  passengers: number | string;
  createdAt: string;
  budget: string;
  status: LeadStatus;
  priority: "Haute" | "Moyenne" | "Basse";
};

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase n'est pas configuré: SUPABASE_URL et SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY sont requis.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

function normalizeStatus(status: string | null | undefined): LeadStatus {
  const lowerStatus = status?.toLowerCase().trim();

  if (lowerStatus === "à traiter" || lowerStatus === "a traiter") {
    return "À traiter";
  }
  if (lowerStatus === "à rappeler" || lowerStatus === "a rappeler") {
    return "À rappeler";
  }
  if (lowerStatus === "réservé" || lowerStatus === "reserve") {
    return "Réservé";
  }
  if (lowerStatus === "relance en cours") {
    return "Relance en cours";
  }
  if (lowerStatus === "à relancer" || lowerStatus === "a relancer") {
    return "À relancer";
  }

  return "À traiter";
}

function formatLeadDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDepartureDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatBudget(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPriority(status: LeadStatus): "Haute" | "Moyenne" | "Basse" {
  if (status === "À traiter" || status === "À rappeler") {
    return "Haute";
  }

  if (status === "Relance en cours" || status === "À relancer") {
    return "Moyenne";
  }

  return "Basse";
}

function getPhoneFromOptions(options: Record<string, unknown> | null) {
  const phone = options?.phone ?? options?.telephone ?? options?.tel;

  return typeof phone === "string" && phone.trim().length > 0 ? phone : "—";
}

async function loadLeads() {
  const supabase = getSupabaseClient();

  const { data: demandes, error: demandesError } = await supabase
    .from("demandes")
    .select("id, prospect_nom, prospect_email, trajet_depart, trajet_arrivee, date_depart, nb_passagers, options, statut, created_at")
    .order("created_at", { ascending: false });

  if (demandesError) {
    throw demandesError;
  }

  const demandeIds = (demandes ?? []).map((demande) => demande.id);

  const { data: devis, error: devisError } = await supabase
    .from("devis")
    .select("demande_id, prix_ttc")
    .in("demande_id", demandeIds);

  if (devisError) {
    throw devisError;
  }

  const budgetByDemandeId = new Map<string, number | null>();

  for (const item of devis ?? []) {
    budgetByDemandeId.set(item.demande_id, item.prix_ttc ?? null);
  }

  const leads: LeadPayload[] = (demandes ?? []).map((demande: DemandeRow) => {
    const status = normalizeStatus(demande.statut);
    const route = [demande.trajet_depart, demande.trajet_arrivee].filter(Boolean).join(" → ");

    return {
      id: demande.id,
      name: demande.prospect_nom ?? "Contact sans nom",
      phone: getPhoneFromOptions(demande.options),
      email: demande.prospect_email ?? "—",
      route: route.length > 0 ? route : "—",
      departureDate: formatDepartureDate(demande.date_depart),
      passengers: demande.nb_passagers ?? "—",
      createdAt: formatLeadDate(demande.created_at),
      budget: formatBudget(budgetByDemandeId.get(demande.id) ?? null),
      status,
      priority: getPriority(status),
    };
  });

  return leads;
}

export async function GET() {
  try {
    const leads = await loadLeads();

    return NextResponse.json({ leads });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de récupérer les leads.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; status?: LeadStatus };

    if (!body.id || !body.status) {
      return NextResponse.json({ error: "id et status sont requis." }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("demandes").update({ statut: body.status }).eq("id", body.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de mettre à jour le statut.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}