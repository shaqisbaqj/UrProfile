import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed — UrProfile",
};

export default function BookSuccessPage({
  searchParams,
}: {
  searchParams: { demo?: string; session_id?: string };
}) {
  const isDemo = searchParams.demo === "true";
  const sessionId = searchParams.session_id;
  const interviewHref = sessionId
    ? `/interview?session=${sessionId}`
    : isDemo
    ? `/interview?demo=true`
    : null;

  return (
    <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center px-8 text-center">
      {/* Ember line */}
      <div className="w-12 h-px bg-ember mb-16" />

      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-6">
        {isDemo ? "Demo mode" : "Confirmed"}
      </p>

      <h1 className="font-display font-light text-cream text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-tight mb-8">
        You&apos;re in.
      </h1>

      <p className="font-body text-base text-cream/40 leading-relaxed max-w-md mb-6">
        Your shoot is confirmed. Before we arrive, complete your story interview —
        it takes about 20 minutes and helps us show up knowing exactly how to
        capture who you are.
      </p>

      {isDemo && (
        <p className="font-body text-xs text-ember/60 leading-relaxed max-w-sm mb-10 border border-ember/20 px-5 py-3">
          This was a demo — no payment was taken. Add your Stripe keys to
          STRIPE_SECRET_KEY to process real payments.
        </p>
      )}

      {/* Interview CTA */}
      {interviewHref && (
        <div className="mt-4 mb-14 border border-ember/30 px-10 py-8 max-w-sm w-full">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ember/60 mb-4">
            Next step
          </p>
          <p className="font-body text-sm text-cream/60 leading-relaxed mb-8">
            Your creative director reviews this before your shoot. It&apos;s the
            difference between a good shoot and an exceptional one.
          </p>
          <Link
            href={interviewHref}
            className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 transition-colors duration-300"
          >
            Complete My Interview &rarr;
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <Link
          href="/"
          className="font-body text-xs tracking-[0.22em] uppercase text-cream/30 hover:text-cream/60 transition-colors duration-300"
        >
          Back to home
        </Link>
        <Link
          href="/profile/demo"
          className="font-body text-xs tracking-[0.22em] uppercase text-cream/20 hover:text-cream/40 transition-colors duration-300"
        >
          See a demo profile
        </Link>
      </div>
    </div>
  );
}
