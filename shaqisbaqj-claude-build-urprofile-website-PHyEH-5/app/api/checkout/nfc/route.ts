import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.json();
  const { quantity, profileId, userId } = body ?? {};

  const qty = Number(quantity);
  if (!qty || qty < 1 || qty > 10) {
    return Response.json(
      { error: "Quantity must be between 1 and 10" },
      { status: 400 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urprofile.co";

  if (!stripeKey || stripeKey === "placeholder") {
    return Response.json({ url: "/portal/nfc?success=demo" });
  }

  const stripe = new Stripe(stripeKey);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "NFC Business Cards",
            description:
              "Tap-to-open NFC cards that instantly pull up your UrProfile page.",
          },
          unit_amount: 2500,
        },
        quantity: qty,
      },
    ],
    metadata: {
      profileId: profileId ?? "",
      userId: userId ?? "",
      quantity: String(qty),
      type: "nfc",
    },
    success_url: `${appUrl}/portal/nfc?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/portal/nfc`,
  });

  return Response.json({ url: session.url });
}
