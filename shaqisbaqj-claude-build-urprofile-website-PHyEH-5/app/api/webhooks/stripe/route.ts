import Stripe from "stripe";

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

    // TODO Phase 2: create Supabase auth user, insert order record, send welcome email
    console.log("✓ Payment completed:", { tier, name, email, sessionId: session.id });
  }

  return new Response("OK", { status: 200 });
}
