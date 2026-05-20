import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return Response.json({ testimonials: [] });
  }

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("testimonials")
    .select("id, name, role, tier, body")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return Response.json({ testimonials: data || [] });
}
