import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { buildSystemPrompt, parseInterviewOutput } from "@/lib/interview";
import { sendInterviewCompleteEmail } from "@/lib/email";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const { sessionId, content } = await req.json();

  if (!sessionId || !content?.trim()) {
    return Response.json({ error: "Missing sessionId or content" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "AI not configured" }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  let session: Record<string, unknown> | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    session = data;
  }

  if (!session && !supabase) {
    // Demo mode without DB — run stateless (won't persist)
    session = {
      id: sessionId,
      name: "there",
      tier: "Signature",
      messages: [],
    };
  }

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const history: { role: string; content: string }[] = Array.isArray(session.messages)
    ? (session.messages as { role: string; content: string }[])
    : [];

  const updatedHistory = [...history, { role: "user", content: content.trim() }];

  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(
      (session.name as string) || "there",
      (session.tier as string) || "Signature"
    ),
    messages: updatedHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const assistantText = (response.content[0] as { text: string }).text;
  const finalHistory = [...updatedHistory, { role: "assistant", content: assistantText }];
  const questionNumber = updatedHistory.filter((m) => m.role === "user").length;

  const output = parseInterviewOutput(assistantText);

  if (supabase) {
    if (output) {
      await supabase
        .from("interview_sessions")
        .update({
          messages: finalHistory,
          story_brief: output.storyBrief,
          script_framework: output.scriptFramework,
          shot_list: JSON.stringify(output.shotList),
          status: "complete",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urprofile.co";
      const adminSecret = process.env.ADMIN_SECRET || "";

      await sendInterviewCompleteEmail({
        clientName: (session.name as string) || "Client",
        clientEmail: (session.email as string) || "",
        tier: (session.tier as string) || "Unknown",
        storyBrief: output.storyBrief,
        scriptFramework: output.scriptFramework,
        shotList: output.shotList,
        adminUrl: `${appUrl}/admin?secret=${adminSecret}`,
      });
    } else {
      await supabase
        .from("interview_sessions")
        .update({
          messages: finalHistory,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }
  }

  // Strip the <OUTPUT> block from the message shown to the client
  const displayMessage = assistantText.replace(/<OUTPUT>[\s\S]*?<\/OUTPUT>/, "").trim();

  return Response.json({
    message: displayMessage || assistantText,
    done: !!output,
    questionNumber,
  });
}
