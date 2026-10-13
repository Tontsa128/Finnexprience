import { createBrowserClient } from "@supabase/ssr";

const BUILD_FALLBACK_URL = "https://build-placeholder.supabase.co";
const BUILD_FALLBACK_KEY = "build-placeholder-anon-key";

/**
 * The admin page is prerendered by Next.js during production builds. Keep that
 * prerender from failing when Vercel environment variables have not yet been
 * configured. The admin UI separately detects missing real credentials and
 * displays a setup message instead of attempting requests against this fallback.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return createBrowserClient(BUILD_FALLBACK_URL, BUILD_FALLBACK_KEY);
  }

  return createBrowserClient(url, key);
}
