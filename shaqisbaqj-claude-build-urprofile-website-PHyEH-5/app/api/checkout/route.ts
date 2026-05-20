import Stripe from "stripe";

const PRICES: Record<string, number> = {
  "self-guided": 29900,
  "starter":     59900,
  "signature":   99900,
  "executive":   249900,
};

const TIER_NAMES: Record<string, string> = {
  "self-guided": "UrProfile Self Guided",
  "starter":     "UrProfile Starter",
  "signature":   "UrProfile Signature",
  "executive":   "UrProfile Executive",
};

export async function POST(req: Request) {
  const { tier, name, email, successUrl, cancelUrl } = await req.json();

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // Demo mode — no Stripe keys configured
  if (!stripeKey || stripeKey === "placeholder") {
    return Response.json({ url: `${successUrl}?demo=true`, demo: true });
  }

  const stripe = new Stripe(stripeKey);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: TIER_NAMES[tier] ?? "UrProfile Profile",
          description: `One-time payment · ${TIER_NAMES[tier] ?? tier}`,
        },
        unit_amount: PRICES[tier] ?? 59900,
      },
      quantity: 1,
    }],
    metadata: { tier, name, email },
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  return Response.json({ url: session.url });
}
