// lib/siteSettings.ts
import { createServerClient } from "@/lib/supabaseServer";

export type SiteSettings = {
  id: string;
  office_hours: string | null;
  phone: string | null;
  email: string | null;
  harbor_status: string | null;
  updated_at: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("site_settings error", error.message);
    return null;
  }
  return data;
}
