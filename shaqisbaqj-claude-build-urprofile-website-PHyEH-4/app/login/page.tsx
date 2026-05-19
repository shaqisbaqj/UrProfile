"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Authentication is not configured.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <Link
        href="/"
        className="font-display text-2xl tracking-wide text-dark/50 hover:text-dark transition-colors duration-300 mb-20"
      >
        UrProfile
      </Link>

      <div className="w-full max-w-sm">
        {/* Headline */}
        <div className="overflow-hidden mb-12">
          <h1 className="font-display font-light text-dark text-[clamp(2.5rem,6vw,3.5rem)] leading-none">
            Client Login
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="border-b border-dark/15 pb-1 mb-8">
            <label className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30 block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent font-body text-sm text-dark placeholder-dark/20 outline-none pb-1"
              placeholder="you@example.com"
            />
          </div>

          <div className="border-b border-dark/15 pb-1 mb-12">
            <label className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30 block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent font-body text-sm text-dark placeholder-dark/20 outline-none pb-1"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="font-body text-xs text-ember mb-6 -mt-6">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 disabled:text-ember/40 transition-colors duration-300"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-20 pt-8 border-t border-dark/10">
          <Link
            href="/"
            className="font-body text-[10px] tracking-[0.2em] uppercase text-dark/25 hover:text-dark/50 transition-colors duration-300"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
