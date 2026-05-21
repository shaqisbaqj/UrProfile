import { createClient } from "@supabase/supabase-js";

function getAuthedClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") ?? "";

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role to verify token and fetch data
  const admin = getAdminClient();
  if (!admin) {
    return Response.json({ profile: null, order: null });
  }

  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: profile }, { data: order }] = await Promise.all([
    admin
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    admin
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return Response.json({ profile: profile ?? null, order: order ?? null });
}
