import Stripe from "stripe";

export async function POST(req: Request) {
  const { name, email, successUrl, cancelUrl } = await req.json();

  const stripeKey = process.env.STRIPE_SECRET_KEY;

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
          name: "UrProfile — The First Impression",
          description: "60–90 second profile film · Profile page · NFC card · QR code",
        },
        unit_amount: 50000,
      },
      quantity: 1,
    }],
    metadata: { tier: "the-first-impression", name, email },
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  return Response.json({ url: session.url });
}
