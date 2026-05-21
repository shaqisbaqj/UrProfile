"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PortalNav from "@/components/PortalNav";
import { getSupabaseClient } from "@/lib/supabase";

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Status config ──────────────────────────────────────────────────────────

type StatusKey =
  | "order-received"
  | "shoot-scheduled"
  | "shoot-complete"
  | "in-editing"
  | "review-ready"
  | "live"
  | "nfc-shipped";

const STATUSES: { key: StatusKey; label: string; description: string }[] = [
  {
    key: "order-received",
    label: "Order Received",
    description:
      "We've received your booking. You'll hear from us within 24 hours to schedule your shoot.",
  },
  {
    key: "shoot-scheduled",
    label: "Shoot Scheduled",
    description: "Your shoot is on the calendar. Check your email for details.",
  },
  {
    key: "shoot-complete",
    label: "Shoot Complete",
    description: "Your shoot is done. We're working on your profile film.",
  },
  {
    key: "in-editing",
    label: "In Editing",
    description:
      "Your film is in post-production. We'll notify you when it's ready to review.",
  },
  {
    key: "review-ready",
    label: "Review Ready",
    description:
      "Your profile film is ready. Review it and let us know your thoughts.",
  },
  {
    key: "live",
    label: "Live",
    description:
      "Your UrProfile is live. Share your link and control every first impression.",
  },
  {
    key: "nfc-shipped",
    label: "NFC Shipped",
    description:
      "Your NFC cards are on the way. Tap one on any smartphone to open your profile.",
  },
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface PortalProfile {
  name?: string;
  status?: StatusKey;
  story_brief?: string | null;
}

interface PortalOrder {
  stripe_session_id?: string;
  unread_messages?: number;
}

interface PortalData {
  profile: PortalProfile | null;
  order: PortalOrder | null;
}

// ─── Status Tracker ──────────────────────────────────────────────────────────

function StatusTracker({ status }: { status: StatusKey }) {
  const currentIndex = STATUSES.findIndex((s) => s.key === status);
  const currentStatus = STATUSES[currentIndex];

  return (
    <div>
      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-0 sm:hidden mb-6">
        {STATUSES.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={step.key} className="flex items-start gap-4">
              {/* Indicator column */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-4 h-4 flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? "bg-ember"
                      : isDone
                      ? "bg-ember/40"
                      : "bg-dark/10"
                  }`}
                >
                  {isDone && (
                    <span className="text-cream text-[9px] leading-none">✓</span>
                  )}
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 bg-cream" />
                  )}
                </div>
                {/* Connector line */}
                {i < STATUSES.length - 1 && (
                  <div
                    className={`w-px flex-1 min-h-[2rem] ${
                      i < currentIndex ? "bg-ember/30" : "bg-dark/10"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <p
                className={`font-body text-[10px] tracking-[0.2em] uppercase pt-[3px] pb-8 ${
                  isCurrent
                    ? "text-ember"
                    : isDone
                    ? "text-ember/50"
                    : "text-dark/20"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Desktop: horizontal steps */}
      <div className="hidden sm:flex flex-row items-center gap-0 mb-8">
        {STATUSES.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              {/* Step indicator + label */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`w-4 h-4 flex items-center justify-center ${
                    isCurrent
                      ? "bg-ember"
                      : isDone
                      ? "bg-ember/40"
                      : "bg-dark/10"
                  }`}
                >
                  {isDone && (
                    <span className="text-cream text-[9px] leading-none">✓</span>
                  )}
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 bg-cream" />
                  )}
                </div>
                <p
                  className={`font-body text-[9px] tracking-[0.15em] uppercase text-center max-w-[72px] leading-tight ${
                    isCurrent
                      ? "text-ember"
                      : isDone
                      ? "text-ember/50"
                      : "text-dark/20"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector line (not after last) */}
              {i < STATUSES.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    i < currentIndex ? "bg-ember/30" : "bg-dark/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Description */}
      {currentStatus && (
        <motion.p
          key={status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-body text-sm text-dark/50 leading-relaxed max-w-xl"
        >
          {currentStatus.description}
        </motion.p>
      )}
    </div>
  );
}

// ─── Quick Link Card ──────────────────────────────────────────────────────────

function QuickCard({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  badge?: number;
}) {
  return (
    <Link href={href} className="block border border-dark/10 p-6 hover:border-dark/20 transition-colors duration-300 group">
      <div className="flex items-center gap-2 mb-2">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25">
          {title}
        </p>
        {badge != null && badge > 0 && (
          <span className="font-body text-[9px] bg-ember text-cream px-1.5 py-0.5 leading-none tracking-[0.1em]">
            {badge}
          </span>
        )}
      </div>
      <p className="font-body text-sm text-dark/50 leading-relaxed mb-6">
        {description}
      </p>
      <span className="font-body text-xs tracking-[0.22em] uppercase text-ember group-hover:text-ember/70 transition-colors duration-200">
        Open &rarr;
      </span>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-dark/5 animate-pulse ${className ?? ""}`} />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PortalData>({ profile: null, order: null });
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();

      // No Supabase — graceful dev fallback
      if (!supabase) {
        setData({
          profile: { name: "Demo User", status: "in-editing", story_brief: null },
          order: { stripe_session_id: "demo", unread_messages: 2 },
        });
        setUserEmail("demo@example.com");
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      setUserEmail(session.user.email ?? "");

      try {
        const res = await fetch("/api/portal/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const json = await res.json();
        setData({ profile: json.profile ?? null, order: json.order ?? null });
      } catch {
        // API unavailable — show setup state
      }

      setLoading(false);
    }

    load();
  }, []);

  const { profile, order } = data;
  const displayName = profile?.name || userEmail || "";
  const currentStatus = (profile?.status as StatusKey) ?? "order-received";
  const unread = order?.unread_messages ?? 0;
  const sessionId = order?.stripe_session_id ?? "portal";

  const showInterviewCTA =
    currentStatus === "order-received" && !profile?.story_brief;

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <PortalNav />
        <main className="pt-28 pb-28 px-8 sm:px-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-3 w-20 mb-6" />
            <Skeleton className="h-10 w-64 mb-20" />

            <Skeleton className="h-3 w-28 mb-8" />
            <div className="hidden sm:flex items-center gap-0 mb-10">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <Skeleton className="w-4 h-4 shrink-0" />
                  {i < 6 && <Skeleton className="flex-1 h-px mx-2" />}
                </div>
              ))}
            </div>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-20" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-36" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Setup state (profile not yet created) ─────────────────────────────────
  if (profile === null) {
    return (
      <div className="min-h-screen bg-cream">
        <PortalNav />
        <main className="pt-28 pb-28 px-8 sm:px-12 flex items-center justify-center">
          <div className="text-center">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-6">
              Your Portal
            </p>
            <h1 className="font-display font-light text-dark text-[clamp(2rem,4vw,3rem)] mb-4">
              Setting up your profile...
            </h1>
            <p className="font-body text-sm text-dark/40 leading-relaxed max-w-sm mx-auto">
              We&apos;re preparing your client portal. This usually takes less than a minute.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ─── Main portal ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream">
      <PortalNav />

      <main className="pt-28 pb-28 px-8 sm:px-12">
        <div className="max-w-4xl mx-auto">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-20"
          >
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-5">
              Your Portal
            </p>
            <h1 className="font-display font-light text-dark text-[clamp(2rem,4vw,3.5rem)] leading-none">
              Welcome back, {displayName}.
            </h1>
          </motion.div>

          {/* ── Production Status ── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="mb-16"
          >
            <div className="border-t-2 border-ember pt-8 mb-10">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-8">
                Production Status
              </p>
              <StatusTracker status={currentStatus} />
            </div>
          </motion.section>

          {/* ── Interview CTA ── */}
          {showInterviewCTA && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="border-l-2 border-ember/40 pl-4 mb-16"
            >
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-2">
                Next Step
              </p>
              <p className="font-body text-sm text-dark/60 leading-relaxed mb-3">
                Complete your story interview to help your creative director arrive fully prepared.
              </p>
              <Link
                href={`/interview?session=${sessionId}`}
                className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 transition-colors duration-200"
              >
                Complete your story interview &rarr;
              </Link>
            </motion.div>
          )}

          {/* ── Quick Links ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <QuickCard
              href="/portal/messages"
              title="Messages"
              description="Your thread with the UrProfile team. We reply within one business day."
              badge={unread}
            />
            <QuickCard
              href="/portal/nfc"
              title="NFC Cards"
              description="Order additional NFC cards. Tap on any smartphone to open your profile."
            />
            <QuickCard
              href="/portal/settings"
              title="Settings"
              description="Update your account details, email, and password."
            />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
