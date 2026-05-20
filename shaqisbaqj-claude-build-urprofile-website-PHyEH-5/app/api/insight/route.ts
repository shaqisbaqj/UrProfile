import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const data = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      insight: "Your profile is active and reaching new people.",
    });
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `You are writing a weekly insight for an UrProfile client. Based on this data, write ONE encouraging, specific, human-sounding sentence (max 20 words) that tells them something useful about their profile activity this week. Do not start with "Your". Be specific. Data: ${JSON.stringify(data)}`,
      },
    ],
  });

  const insight = (message.content[0] as { text: string }).text;
  return Response.json({ insight });
}
