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
        We&apos;ll be in touch within 24 hours to schedule your shoot and walk
        you through everything.
      </p>

      {isDemo && (
        <p className="font-body text-xs text-ember/60 leading-relaxed max-w-sm mb-10 border border-ember/20 px-5 py-3">
          This was a demo — no payment was taken. Add your Stripe keys to
          STRIPE_SECRET_KEY to process real payments.
        </p>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-6 items-center">
        <Link
          href="/"
          className="font-body text-xs tracking-[0.22em] uppercase text-cream/40 hover:text-cream/70 transition-colors duration-300"
        >
          Back to home
        </Link>
        <Link
          href="/profile/demo"
          className="font-body text-xs tracking-[0.22em] uppercase text-ember/60 hover:text-ember transition-colors duration-300"
        >
          See a demo profile &rarr;
        </Link>
      </div>
    </div>
  );
}
