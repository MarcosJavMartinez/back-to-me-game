import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Avatar } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

const namePattern = /^.{2,40}$/u;
const colorPattern = /^#[0-9a-f]{6}$/i;
const hairStyles: Avatar["appearance"]["hairStyle"][] = ["short", "curly", "long", "ponytail", "mohawk", "none"];
const genders: Avatar["appearance"]["gender"][] = ["woman", "man", "unspecified"];
const eyeStyles: Avatar["appearance"]["eyeStyle"][] = ["round", "happy", "sleepy", "sparkle"];
const facialHairStyles: Avatar["appearance"]["facialHair"][] = ["none", "stubble", "mustache", "beard"];

function friendCodeFor(userId: string) {
  return userId.replace(/-/g, "").slice(0, 12).toUpperCase();
}

function validAppearance(value: unknown): value is Avatar["appearance"] {
  if (!value || typeof value !== "object") return false;
  const appearance = value as Partial<Avatar["appearance"]>;
  return Boolean(
    appearance.skinTone && colorPattern.test(appearance.skinTone)
    && appearance.hairColor && colorPattern.test(appearance.hairColor)
    && appearance.shirtColor && colorPattern.test(appearance.shirtColor)
    && appearance.pantsColor && colorPattern.test(appearance.pantsColor)
    && appearance.gender && genders.includes(appearance.gender)
    && appearance.hairStyle && hairStyles.includes(appearance.hairStyle)
    && appearance.eyeStyle && eyeStyles.includes(appearance.eyeStyle)
    && appearance.facialHair && facialHairStyles.includes(appearance.facialHair)
    && Number.isFinite(appearance.height) && Number(appearance.height) >= 0 && Number(appearance.height) <= 100
    && Number.isFinite(appearance.bodyBuild) && Number(appearance.bodyBuild) >= 0 && Number(appearance.bodyBuild) <= 100
    && Number.isFinite(appearance.muscularity) && Number(appearance.muscularity) >= 0 && Number(appearance.muscularity) <= 100
  );
}

export async function GET() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Necesitas iniciar sesion." }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("id,display_name,friend_code,avatar,level,streak_current")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: "No pude cargar el perfil." }, { status: 500 });
  return NextResponse.json({ profile: data });
}

export async function PATCH(request: Request) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Necesitas iniciar sesion." }, { status: 401 });

  let body: { name?: string; appearance?: Avatar["appearance"]; equippedItems?: Avatar["equippedItems"]; onboardingCompleted?: boolean };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "El contenido no es JSON valido." }, { status: 400 });
  }
  const name = body.name?.trim();
  if (!name || !namePattern.test(name) || !validAppearance(body.appearance)) {
    return NextResponse.json({ error: "El nombre o la apariencia no son validos." }, { status: 400 });
  }

  const avatar = {
    appearance: body.appearance,
    equippedItems: body.equippedItems ?? {}
  };
  const updatedAt = new Date().toISOString();
  const profileUpdate = {
    display_name: name,
    avatar,
    updated_at: updatedAt,
    ...(body.onboardingCompleted === true ? { onboarding_completed: true } : {})
  };
  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (updateError) return NextResponse.json({ error: "No pude guardar el perfil." }, { status: 500 });
  if (!updatedProfile) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        friend_code: friendCodeFor(user.id),
        ...profileUpdate
      });
    if (insertError) return NextResponse.json({ error: "No pude crear el perfil." }, { status: 500 });
  }

  await supabase.auth.updateUser({
    data: {
      display_name: name,
      ...(body.onboardingCompleted === true ? { onboarding_completed: true } : {})
    }
  });
  return NextResponse.json({ ok: true });
}
