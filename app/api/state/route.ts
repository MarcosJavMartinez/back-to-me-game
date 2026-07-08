import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { AppState } from "@/lib/types";
import { hasSupabaseServerConfig } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const table = "user_states";
const maxStateBytes = 1_000_000;

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<AppState>;
  return Array.isArray(state.activities)
    && Array.isArray(state.logs)
    && Boolean(state.progress && typeof state.progress === "object")
    && Boolean(state.avatar && typeof state.avatar === "object");
}

export async function GET() {
  if (!hasSupabaseServerConfig()) {
    return NextResponse.json({ enabled: false, state: null }, { status: 503 });
  }

  const supabase = createClient(await cookies());
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Necesitas iniciar sesion." }, { status: 401 });
  }
  const { data, error } = await supabase
    .from(table)
    .select("state,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205") {
      return NextResponse.json({ enabled: false, state: null }, { status: 503 });
    }
    console.error("Supabase state load failed:", error.code, error.message);
    return NextResponse.json({ error: "No pude cargar el estado remoto." }, { status: 500 });
  }

  return NextResponse.json({ enabled: true, state: (data?.state as AppState | undefined) ?? null, updatedAt: data?.updated_at ?? null });
}

export async function POST(request: Request) {
  if (!hasSupabaseServerConfig()) {
    return NextResponse.json({ enabled: false }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxStateBytes) {
    return NextResponse.json({ error: "El estado es demasiado grande." }, { status: 413 });
  }

  let body: { state?: AppState; expectedUpdatedAt?: string | null; force?: boolean };
  try {
    body = await request.json() as { state?: AppState; expectedUpdatedAt?: string | null; force?: boolean };
  } catch {
    return NextResponse.json({ error: "El contenido no es JSON valido." }, { status: 400 });
  }
  if (!isAppState(body.state)) {
    return NextResponse.json({ error: "El estado no tiene un formato valido." }, { status: 400 });
  }
  if (new TextEncoder().encode(JSON.stringify(body.state)).byteLength > maxStateBytes) {
    return NextResponse.json({ error: "El estado es demasiado grande." }, { status: 413 });
  }

  const supabase = createClient(await cookies());
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Necesitas iniciar sesion." }, { status: 401 });
  }

  const { data: current, error: loadError } = await supabase
    .from(table)
    .select("state,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadError) {
    if (loadError.code === "PGRST205") {
      return NextResponse.json({ enabled: false }, { status: 503 });
    }
    console.error("Supabase state version check failed:", loadError.code, loadError.message);
    return NextResponse.json({ error: "No pude comprobar la version remota." }, { status: 500 });
  }

  if (current && !body.force && body.expectedUpdatedAt !== current.updated_at) {
    return NextResponse.json({
      conflict: true,
      state: current.state as AppState,
      updatedAt: current.updated_at
    }, { status: 409 });
  }

  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from(table)
    .upsert({
      user_id: user.id,
      state: body.state,
      updated_at: updatedAt
    }, { onConflict: "user_id" });

  if (error) {
    if (error.code === "PGRST205") {
      return NextResponse.json({ enabled: false }, { status: 503 });
    }
    console.error("Supabase state save failed:", error.code, error.message);
    return NextResponse.json({ error: "No pude guardar el estado remoto." }, { status: 500 });
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: body.state.avatar.name,
      avatar: {
        appearance: body.state.avatar.appearance,
        equippedItems: body.state.avatar.equippedItems
      },
      level: body.state.progress.level,
      streak_current: body.state.progress.streakCurrent,
      updated_at: updatedAt
    })
    .eq("id", user.id);
  if (profileError) console.error("Supabase social profile sync failed:", profileError.code, profileError.message);

  return NextResponse.json({ ok: true, updatedAt });
}
