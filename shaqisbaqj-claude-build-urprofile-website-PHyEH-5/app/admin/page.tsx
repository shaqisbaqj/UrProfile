import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import ApproveButton from "./ApproveButton";

export const metadata: Metadata = { title: "Admin — UrProfile" };

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string };
}) {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || searchParams.secret !== adminSecret) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-cream/20">
          Access denied.
        </p>
      </div>
    );
  }

  const supabase = getSupabaseAdmin();

  let interviews: Record<string, unknown>[] = [];
  let testimonials: Record<string, unknown>[] = [];

  if (supabase) {
    const [{ data: iv }, { data: tm }] = await Promise.all([
      supabase
        .from("interview_sessions")
        .select("id, name, email, tier, status, created_at, story_brief, script_framework, shot_list")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("testimonials")
        .select("id, name, role, email, tier, body, approved, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    interviews = iv || [];
    testimonials = tm || [];
  }

  const pendingTestimonials = testimonials.filter((t) => !t.approved);
  const approvedTestimonials = testimonials.filter((t) => t.approved);
  const completeInterviews = interviews.filter((i) => i.status === "complete");
  const pendingInterviews = interviews.filter((i) => i.status !== "complete");

  const secret = searchParams.secret!;

  return (
    <div className="min-h-screen bg-dark text-cream">
      <div className="max-w-5xl mx-auto px-8 sm:px-12 py-20">

        {/* Header */}
        <div className="border-b border-white/[0.06] pb-10 mb-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/20 mb-4">
            UrProfile
          </p>
          <h1 className="font-display font-light text-cream text-4xl sm:text-5xl">
            Admin
          </h1>
          <div className="flex gap-10 mt-8">
            <div>
              <p className="font-body text-2xl text-ember">{completeInterviews.length}</p>
              <p className="font-body text-[9px] tracking-[0.25em] uppercase text-cream/25 mt-1">Interviews complete</p>
            </div>
            <div>
              <p className="font-body text-2xl text-cream/40">{pendingInterviews.length}</p>
              <p className="font-body text-[9px] tracking-[0.25em] uppercase text-cream/25 mt-1">Awaiting interview</p>
            </div>
            <div>
              <p className="font-body text-2xl text-ember">{pendingTestimonials.length}</p>
              <p className="font-body text-[9px] tracking-[0.25em] uppercase text-cream/25 mt-1">Testimonials pending</p>
            </div>
          </div>
        </div>

        {/* Pending Testimonials */}
        {pendingTestimonials.length > 0 && (
          <section className="mb-20">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ember mb-8">
              Testimonials — pending approval
            </p>
            <div className="space-y-6">
              {pendingTestimonials.map((t) => (
                <div key={t.id as string} className="border border-ember/20 p-6">
                  <div className="flex items-start justify-between gap-8 mb-4">
                    <div>
                      <p className="font-body text-sm text-cream font-medium">{t.name as string}</p>
                      <p className="font-body text-xs text-cream/30 mt-0.5">
                        {t.role as string} {t.tier ? `· ${t.tier as string}` : ""} · {formatDate(t.created_at as string)}
                      </p>
                    </div>
                    <ApproveButton id={t.id as string} secret={secret} />
                  </div>
                  <p className="font-body text-sm text-cream/55 leading-relaxed">
                    &ldquo;{t.body as string}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interview Sessions */}
        <section className="mb-20">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-8">
            Story interviews
          </p>
          <div className="space-y-0">
            {interviews.length === 0 && (
              <p className="font-body text-sm text-cream/25">No interviews yet.</p>
            )}
            {interviews.map((iv) => {
              const isComplete = iv.status === "complete";
              return (
                <div
                  key={iv.id as string}
                  className="border-b border-white/[0.05] py-6"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`inline-block w-1.5 h-1.5 shrink-0 ${isComplete ? "bg-ember" : "bg-cream/15"}`}
                        />
                        <p className="font-body text-sm text-cream truncate">
                          {(iv.name as string) || "—"}
                        </p>
                        <span className="font-body text-[9px] tracking-[0.2em] uppercase text-cream/20">
                          {iv.tier as string}
                        </span>
                      </div>
                      <p className="font-body text-xs text-cream/30 pl-[1.125rem]">
                        {(iv.email as string) || "no email"} · {formatDate(iv.created_at as string)}
                      </p>
                    </div>
                    <span
                      className={`font-body text-[9px] tracking-[0.2em] uppercase shrink-0 ${
                        isComplete ? "text-ember" : "text-cream/20"
                      }`}
                    >
                      {isComplete ? "Complete" : "Pending"}
                    </span>
                  </div>

                  {/* Story brief (expanded when complete) */}
                  {isComplete && Boolean(iv.story_brief) && (
                    <div className="mt-4 pl-[1.125rem] border-l border-ember/20">
                      <p className="font-body text-[9px] tracking-[0.2em] uppercase text-ember/50 mb-2">
                        Story brief
                      </p>
                      <p className="font-body text-xs text-cream/40 leading-relaxed line-clamp-4">
                        {iv.story_brief as string}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Approved Testimonials */}
        {approvedTestimonials.length > 0 && (
          <section>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-8">
              Approved testimonials ({approvedTestimonials.length})
            </p>
            <div className="space-y-4">
              {approvedTestimonials.map((t) => (
                <div key={t.id as string} className="border-b border-white/[0.04] pb-4">
                  <p className="font-body text-xs text-cream/30 mb-1">
                    {t.name as string} · {t.role as string}
                  </p>
                  <p className="font-body text-xs text-cream/40 leading-relaxed line-clamp-2">
                    &ldquo;{t.body as string}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!supabase && (
          <div className="mt-16 border border-ember/20 p-6">
            <p className="font-body text-xs text-ember/60 leading-relaxed">
              Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to see live data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
