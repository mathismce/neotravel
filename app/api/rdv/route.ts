import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type RdvBody = {
  demande_id?: string;
  date_rdv?: string;
  canal?: string;
};

const ALLOWED_CANAUX = ["visio", "telephone", "presentiel"];

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase n'est pas configuré: une URL et une clé Supabase sont requises.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const demandeId = searchParams.get("demande_id");

    if (!demandeId) {
      return NextResponse.json(
        { error: "demande_id est requis." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("demandes")
      .select("prospect_nom")
      .eq("id", demandeId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ prospect_nom: data?.prospect_nom ?? null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de charger la demande.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RdvBody;

    if (!body.demande_id || !body.date_rdv) {
      return NextResponse.json(
        { error: "demande_id et date_rdv sont requis." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(body.date_rdv);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "date_rdv n'est pas une date valide." },
        { status: 400 }
      );
    }

    const canal = body.canal && ALLOWED_CANAUX.includes(body.canal) ? body.canal : "visio";

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("rdv")
      .insert({
        demande_id: body.demande_id,
        date_rdv: parsedDate.toISOString(),
        canal,
        statut: "propose",
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible d'enregistrer le rendez-vous.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
