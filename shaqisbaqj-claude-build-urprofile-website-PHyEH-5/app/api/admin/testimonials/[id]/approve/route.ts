import { createClient } from "@supabase/supabase-js";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { secret } = await req.json();

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || secret !== adminSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("testimonials")
    .update({ approved: true })
    .eq("id", params.id);

  if (error) {
    return Response.json({ error: "Failed to approve" }, { status: 500 });
  }

  return Response.json({ success: true });
}
