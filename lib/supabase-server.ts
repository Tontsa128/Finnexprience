import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function isValidSupabaseUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Incomplete or malformed production configuration should not crash public pages.
  // In that case, callers can use their built-in default content.
  if (!isValidSupabaseUrl(url) || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(items) {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
      }
    }
  });
}
