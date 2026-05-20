import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const INTERVIEW_SYSTEM_PROMPT = (name: string, tier: string) => `
You are conducting a pre-production story interview for UrProfile, a premium video profile service. Your role is to help ${name} articulate their professional story so the creative director arrives at the shoot fully prepared.

You have 10 specific questions to work through. Ask them one at a time. Be warm, direct, and genuinely curious — this should feel like a real conversation, not a questionnaire. Use ${name}'s first name naturally. If an answer is brief or feels surface-level, ask one thoughtful follow-up before moving to the next question.

The 10 questions (ask in this order):
1. What do you do — and who specifically do you do it for? Not your job title — tell me what actually changes for people after they work with you.
2. What's the moment that made you certain you were built for this kind of work? The story behind the why, not just the what.
3. When someone hires your competitor instead of you — what are they giving up? What do you do that others in your space don't?
4. Describe your best client relationship. Not demographics — what were they struggling with when they found you, and what's different about their situation after?
5. What do most people get wrong about what you do? The misconception you find yourself correcting again and again.
6. If someone finished watching ${name}'s profile film and walked away feeling one specific thing — what do you want that feeling to be?
7. What's something true about you that your resume, bio, or LinkedIn would never tell someone?
8. What outcome do you want from this profile? Specifically — what doors do you want it to open in the next 6 months?
9. Give me a line you actually say to clients. Your exact words. The language you naturally use when you're explaining what you do.
10. Anything else that's essential to who you are that we haven't captured?

CRITICAL: When you have worked through all 10 questions and have substantive answers, end the interview. Tell ${name} you have everything you need, thank them warmly, then respond with ONLY a valid JSON object wrapped in <OUTPUT> tags (nothing outside the tags):

<OUTPUT>
{
  "storyBrief": "A 2-3 paragraph narrative for the creative director. Write in third person. Cover: who they are, their origin story or defining moment, what makes them genuinely different, who they serve, and the emotional core of their story.",
  "scriptFramework": "A structured outline of talking points for the film. Include: opening hook, their core story, their differentiator, who they serve, the feeling they want to leave, and a closing line. Use their exact phrases from the interview wherever possible.",
  "shotList": ["Specific shot description 1", "Specific shot description 2"]
}
</OUTPUT>

Do not generate the OUTPUT until you have received substantive answers to all 10 questions. Keep the conversation going naturally until then. The tier is ${tier} — keep this in mind for the scope and complexity of the story you're building.

Start by greeting ${name} warmly by first name and asking question 1.
`.trim();

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const { stripeSessionId, name, email, tier } = await req.json();

  if (!stripeSessionId && !email) {
    return Response.json({ error: "Missing session identifier" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "AI not configured" }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  let sessionId: string | null = null;
  let existingMessages: { role: string; content: string }[] = [];

  // Check for existing interview session
  if (supabase && stripeSessionId) {
    const { data: existing } = await supabase
      .from("interview_sessions")
      .select("id, messages, status")
      .eq("stripe_session_id", stripeSessionId)
      .maybeSingle();

    if (existing) {
      sessionId = existing.id;
      existingMessages = existing.messages || [];

      // If already complete, return status
      if (existing.status === "complete") {
        return Response.json({ sessionId, alreadyComplete: true });
      }
    }
  }

  // Generate first message from Claude
  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const clientName = name || "there";
  const clientTier = tier || "Signature";

  const systemPrompt = INTERVIEW_SYSTEM_PROMPT(clientName, clientTier);

  // If resuming, return the last assistant message; else generate opening
  if (existingMessages.length > 0) {
    const lastAssistant = [...existingMessages]
      .reverse()
      .find((m) => m.role === "assistant");
    return Response.json({
      sessionId,
      message: lastAssistant?.content ?? "",
      questionNumber: Math.floor(existingMessages.length / 2) + 1,
    });
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: systemPrompt,
    messages: [],
  });

  const firstMessage = (response.content[0] as { text: string }).text;
  const initialMessages = [{ role: "assistant", content: firstMessage }];

  // Persist new session
  if (supabase) {
    const insertData: Record<string, unknown> = {
      messages: initialMessages,
      status: "in-progress",
    };
    if (stripeSessionId) insertData.stripe_session_id = stripeSessionId;
    if (name) insertData.name = name;
    if (email) insertData.email = email;
    if (tier) insertData.tier = tier;

    const { data: created } = await supabase
      .from("interview_sessions")
      .insert(insertData)
      .select("id")
      .single();

    sessionId = created?.id ?? null;
  }

  return Response.json({ sessionId, message: firstMessage, questionNumber: 1 });
}
