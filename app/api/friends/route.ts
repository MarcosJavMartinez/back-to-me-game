import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Necesitas iniciar sesion." }, { status: 401 });

  const { data: relations, error } = await supabase
    .from("friendships")
    .select("id,requester_id,addressee_id,status,created_at")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "No pude cargar las amistades." }, { status: 500 });
  const profileIds = Array.from(new Set((relations ?? []).flatMap((relation) => [relation.requester_id, relation.addressee_id])));
  const { data: profiles, error: profileError } = profileIds.length
    ? await supabase.from("profiles").select("id,display_name,friend_code,avatar,level,streak_current").in("id", profileIds)
    : { data: [], error: null };

  if (profileError) return NextResponse.json({ error: "No pude cargar los perfiles." }, { status: 500 });
  return NextResponse.json({ userId: user.id, relations: relations ?? [], profiles: profiles ?? [] });
}

export async function POST(request: Request) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Necesitas iniciar sesion." }, { status: 401 });

  let body: { action?: string; code?: string; friendshipId?: string };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "El contenido no es JSON valido." }, { status: 400 });
  }

  if (body.action === "request") {
    const code = body.code?.replace(/\s/g, "").toUpperCase();
    if (!code || !/^[A-F0-9]{12}$/.test(code)) {
      return NextResponse.json({ error: "El codigo de amistad no es valido." }, { status: 400 });
    }
    const { data: friend, error: profileError } = await supabase.from("profiles").select("id").eq("friend_code", code).maybeSingle();
    if (profileError) return NextResponse.json({ error: "No pude buscar ese codigo." }, { status: 500 });
    if (!friend) return NextResponse.json({ error: "No encontramos una cuenta con ese codigo." }, { status: 404 });
    if (friend.id === user.id) return NextResponse.json({ error: "Ese codigo es el tuyo." }, { status: 400 });

    const { error } = await supabase.from("friendships").insert({ requester_id: user.id, addressee_id: friend.id });
    if (error?.code === "23505") return NextResponse.json({ error: "Ya existe una solicitud o amistad con esa cuenta." }, { status: 409 });
    if (error) return NextResponse.json({ error: "No pude enviar la solicitud." }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const friendshipId = body.friendshipId;
  if (!friendshipId || !uuidPattern.test(friendshipId)) {
    return NextResponse.json({ error: "La solicitud no es valida." }, { status: 400 });
  }

  if (body.action === "accept") {
    const { data, error } = await supabase
      .from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", friendshipId)
      .eq("addressee_id", user.id)
      .select("id")
      .maybeSingle();
    if (error || !data) return NextResponse.json({ error: "No pude aceptar la solicitud." }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "reject" || body.action === "remove") {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
    if (error) return NextResponse.json({ error: "No pude actualizar la amistad." }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Accion desconocida." }, { status: 400 });
}
