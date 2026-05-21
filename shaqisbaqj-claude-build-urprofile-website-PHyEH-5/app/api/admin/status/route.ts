import { createClient } from "@supabase/supabase-js";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function PATCH(req: Request) {
  const body = await req.json();
  const { profileId, status, secret } = body ?? {};

  if (secret !== process.env.ADMIN_SECRET) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: "Service unavailable" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Fetch profile to get user_id and name
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, name, status")
    .eq("id", profileId)
    .single();

  if (profileError || !profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  // Get user email from auth.users via admin API
  const { data: authUser, error: userError } =
    await supabase.auth.admin.getUserById(profile.user_id);

  if (userError || !authUser?.user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const email = authUser.user.email;

  if (!email) {
    return Response.json({ error: "User has no email" }, { status: 422 });
  }

  // Update profile status
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", profileId);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  // Send status update email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urprofile.co";
  await sendStatusUpdateEmail({
    name: profile.name ?? "there",
    email,
    status,
    portalUrl: `${appUrl}/portal`,
  });

  return Response.json({ ok: true });
}
