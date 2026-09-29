import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const allowedLocales = new Set(["es", "en", "fi"]);

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  const travelDate = String(form.get("date") ?? "").trim();
  const interest = String(form.get("interest") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const localeValue = String(form.get("locale") ?? "es");
  const locale = allowedLocales.has(localeValue) ? localeValue : "es";

  const returnTo = locale === "es" ? "/planifica" : `/${locale}/planifica`;
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`${returnTo}?error=${encodeURIComponent(reason)}`, request.url), 303);

  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !travelDate || !interest || message.length < 10) {
    return fail("invalid");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("service");

  const { error } = await supabase.from("trip_requests").insert({
    name: name || null,
    email,
    travel_date: travelDate,
    interest,
    message,
    locale,
  });

  if (error) return fail("service");

  return NextResponse.redirect(
    new URL(`${returnTo}?sent=1`, request.url),
    303,
  );
}
