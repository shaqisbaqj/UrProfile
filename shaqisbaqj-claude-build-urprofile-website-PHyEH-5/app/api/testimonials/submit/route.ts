import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { name, role, email, body } = await req.json();

  if (!name?.trim() || !body?.trim()) {
    return Response.json(
      { error: "Name and testimonial are required" },
      { status: 400 }
    );
  }

  if (body.trim().length < 20) {
    return Response.json(
      { error: "Testimonial must be at least 20 characters" },
      { status: 400 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Demo mode — accept without saving
    return Response.json({ success: true });
  }

  const supabase = createClient(url, key);

  const { error } = await supabase.from("testimonials").insert({
    name: name.trim(),
    role: role?.trim() || null,
    email: email?.trim() || null,
    body: body.trim(),
    approved: false,
  });

  if (error) {
    console.error("Testimonial insert error:", error);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }

  return Response.json({ success: true });
}
