const missingConfigMessage = "Faltan las variables de entorno de Supabase.";

export function getSupabaseBrowserConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(`${missingConfigMessage} Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.`);
  }

  return { url, key };
}

export function getSupabaseServerConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(`${missingConfigMessage} Configura SUPABASE_URL o NEXT_PUBLIC_SUPABASE_URL, y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.`);
  }

  return { url, key };
}

export function hasSupabaseServerConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key);
}
