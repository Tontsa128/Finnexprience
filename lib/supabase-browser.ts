import { createBrowserClient } from "@supabase/ssr";

const BUILD_FALLBACK_URL = "https://build-placeholder.supabase.co";
const BUILD_FALLBACK_KEY = "build-placeholder-anon-key";

function isValidSupabaseUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Next.js prerenders the admin page during production builds. Invalid or missing
 * public Supabase settings must not crash that build. The admin page detects
 * missing/invalid settings and shows a configuration message instead.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidSupabaseUrl(url) || !key) {
    return createBrowserClient(BUILD_FALLBACK_URL, BUILD_FALLBACK_KEY);
  }

  return createBrowserClient(url, key);
}
