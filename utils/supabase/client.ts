import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseBrowserConfig } from "./config";

export const createClient = () => {
  const { url, key } = getSupabaseBrowserConfig();
  return createBrowserClient(url, key);
};
