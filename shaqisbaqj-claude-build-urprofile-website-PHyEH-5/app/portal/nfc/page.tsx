"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PortalNav from "@/components/PortalNav";
import { getSupabaseClient } from "@/lib/supabase";

function NFCPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const successParam = searchParams.get("success");
  const isSuccess = successParam === "true" || successParam === "demo";
  const isDemo = successParam === "demo";

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleOrder() {
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      let token: string | undefined;
      let userId = "";
      let profileId = "";

      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
        userId = session?.user?.id ?? "";
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/checkout/nfc", {
        method: "POST",
        headers,
        body: JSON.stringify({ quantity, profileId, userId }),
      });

      const data = await res.json();

      if (data.url) {
        router.push(data.url);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <>
        <PortalNav />
        <main className="bg-cream min-h-screen pt-28 pb-28 px-8 sm:px-12">
          <div className="max-w-2xl mx-auto">
            {/* Label */}
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-6">
              NFC Cards
            </p>

            {/* Headline */}
            <h1 className="font-display font-light text-dark text-[clamp(2.5rem,5vw,3.5rem)] leading-none mb-10">
              Your order is confirmed.
            </h1>

            {/* Body */}
            <p className="font-body text-sm text-dark/50 mb-4">
              Your NFC cards will arrive within 5–7 business days.
            </p>

            {isDemo && (
              <p className="font-body text-xs text-dark/35 mb-10">
                This was a demo — no cards were ordered.
              </p>
            )}

            {!isDemo && <div className="mb-10" />}

            <Link
              href="/portal"
              className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 transition-colors duration-300"
            >
              ← Back to portal
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Order form
  return (
    <>
      <PortalNav />
      <main className="bg-cream min-h-screen pt-28 pb-28 px-8 sm:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Label */}
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-6">
            NFC Cards
          </p>

          {/* Headline */}
          <h1 className="font-display font-light text-dark text-[clamp(2.5rem,5vw,3.5rem)] leading-none mb-6">
            Order additional cards.
          </h1>

          {/* Price note */}
          <p className="font-body text-sm text-dark/50 mb-12">
            $25 per card — tap any smartphone to open your profile instantly
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3 mb-16">
            {[
              "Works with any iPhone or Android — no app needed",
              "Instant open — one tap loads your full profile",
              "Reorder anytime",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-[5px] w-1 h-1 shrink-0 bg-ember" />
                <span className="font-body text-sm text-dark/50">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Quantity selector */}
          <div className="flex items-center gap-6 mb-10">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 border border-dark/20 font-body text-sm text-dark flex items-center justify-center hover:border-dark/40 transition-colors duration-200"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span className="font-display text-3xl text-dark font-light w-16 text-center select-none">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-10 h-10 border border-dark/20 font-body text-sm text-dark flex items-center justify-center hover:border-dark/40 transition-colors duration-200"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Total */}
          <p className="font-display text-2xl text-dark font-light mb-10">
            Total: ${quantity * 25}
          </p>

          {/* Order button */}
          <button
            onClick={handleOrder}
            disabled={loading}
            className="bg-dark text-cream px-10 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-ember disabled:opacity-40 transition-colors duration-300 mb-8"
          >
            {loading ? "Redirecting…" : "Order Now →"}
          </button>

          {/* Free shipping note */}
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-dark/25">
            Free shipping included
          </p>
        </div>
      </main>
    </>
  );
}

export default function NFCPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-ember animate-pulse" />
        </div>
      }
    >
      <NFCPageInner />
    </Suspense>
  );
}
