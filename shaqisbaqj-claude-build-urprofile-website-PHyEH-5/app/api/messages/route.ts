import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function verifyToken(token: string) {
  const client = getAdminClient();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser(token);
  return user ?? null;
}

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const user = await verifyToken(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getAdminClient();
  if (!admin) return Response.json({ messages: [] });

  const { data: messages } = await admin
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  return Response.json({ messages: messages ?? [] });
}

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const user = await verifyToken(token);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const messageBody: string = body?.body ?? "";
  if (!messageBody.trim()) {
    return Response.json({ error: "Message body is required" }, { status: 400 });
  }

  const admin = getAdminClient();
  if (!admin) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const { data: message, error } = await admin
    .from("messages")
    .insert({ user_id: user.id, sender_type: "client", body: messageBody })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(message, { status: 201 });
}
