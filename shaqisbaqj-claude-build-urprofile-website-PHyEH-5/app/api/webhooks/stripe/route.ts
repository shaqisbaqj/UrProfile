import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendBookingConfirmationEmail, sendWelcomeEmail } from "@/lib/email";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || stripeKey === "placeholder") {
    return new Response("Stripe not configured", { status: 200 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret!);
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { tier, name, email } = session.metadata ?? {};

    console.log("✓ Payment completed:", { tier, name, email, sessionId: session.id });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urprofile.co";
    const interviewUrl = `${appUrl}/interview?session=${session.id}`;

    if (email && name) {
      // Send interview CTA email
      await sendBookingConfirmationEmail({
        name,
        email,
        tier: tier || "The First Impression",
        interviewUrl,
      });

      // Create Supabase auth user + portal records
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          // Create or retrieve auth user
          const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { name },
          });

          let userId = userData?.user?.id;

          // If user already exists, look them up
          if (createError && createError.message?.includes("already been registered")) {
            const { data: listData } = await supabase.auth.admin.listUsers();
            const existing = listData?.users?.find((u) => u.email === email);
            userId = existing?.id;
          }

          if (userId) {
            // Insert order record
            await supabase.from("orders").insert({
              user_id: userId,
              tier: "the-first-impression",
              amount_paid: 50000,
              stripe_session_id: session.id,
              payment_status: "paid",
              fulfillment_status: "pending",
              client_name: name,
              client_email: email,
            });

            // Create profile record with unique slug
            const baseSlug = slugify(name);
            const slug = `${baseSlug}-${Date.now().toString(36)}`;
            await supabase.from("profiles").insert({
              user_id: userId,
              name,
              slug,
              status: "order-received",
              tier: "the-first-impression",
              contact_email: email,
            });

            // Generate password setup link
            const { data: linkData } = await supabase.auth.admin.generateLink({
              type: "recovery",
              email,
            });

            const passwordSetupUrl =
              (linkData as { properties?: { action_link?: string } })?.properties?.action_link ||
              `${appUrl}/portal`;

            await sendWelcomeEmail({
              name,
              email,
              portalUrl: `${appUrl}/portal`,
              passwordSetupUrl,
            });
          }
        } catch (err) {
          console.error("Portal onboarding error:", err);
        }
      }
    }

    // Handle NFC add-on checkout
    if (session.metadata?.type === "nfc") {
      const { profileId, userId, quantity } = session.metadata;
      const supabase = getSupabaseAdmin();
      if (supabase && profileId && userId) {
        await supabase.from("nfc_orders").insert({
          user_id: userId,
          profile_id: profileId,
          quantity: parseInt(quantity || "1"),
          amount_paid: 2500 * parseInt(quantity || "1"),
          stripe_payment_intent_id: session.payment_intent as string,
          status: "paid",
        });
      }
    }
  }

  return new Response("OK", { status: 200 });
}
