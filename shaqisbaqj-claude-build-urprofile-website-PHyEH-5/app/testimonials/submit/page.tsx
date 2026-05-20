"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TestimonialSubmitPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, body }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-8 py-24">
      <div className="w-full max-w-lg">

        <div className="w-8 h-px bg-ember mb-16" />

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-8">
                Thank you
              </p>
              <h1 className="font-display font-light text-dark text-[clamp(2.2rem,6vw,4rem)] leading-[1.0] mb-8">
                We&rsquo;ll share your story.
              </h1>
              <p className="font-body text-base text-dark/45 leading-relaxed mb-12">
                Your testimonial has been received. We review every submission before
                it appears on the site — usually within a day or two.
              </p>
              <Link
                href="/"
                className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 transition-colors"
              >
                Back to home
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-8">
                Share your experience
              </p>
              <h1 className="font-display font-light text-dark text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] mb-4">
                What changed for you?
              </h1>
              <p className="font-body text-sm text-dark/40 leading-relaxed mb-14">
                Your words help the next person understand what&rsquo;s possible.
                One honest sentence is worth more than a paragraph of marketing.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="border-b border-dark/10 pb-2">
                  <label className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30 block mb-3">
                    Your name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Marcus T."
                    className="w-full bg-transparent font-body text-base text-dark placeholder:text-dark/20 focus:outline-none"
                  />
                </div>

                <div className="border-b border-dark/10 pb-2">
                  <label className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30 block mb-3">
                    Your title / role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Financial Advisor"
                    className="w-full bg-transparent font-body text-base text-dark placeholder:text-dark/20 focus:outline-none"
                  />
                </div>

                <div className="border-b border-dark/10 pb-2">
                  <label className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30 block mb-3">
                    Email (not displayed publicly)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent font-body text-base text-dark placeholder:text-dark/20 focus:outline-none"
                  />
                </div>

                <div className="border-b border-dark/10 pb-2">
                  <label className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30 block mb-3">
                    Your testimonial *
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={4}
                    placeholder="What changed after you got your profile? Be specific — the next person reading this is deciding whether to take the leap."
                    className="w-full bg-transparent font-body text-base text-dark placeholder:text-dark/20 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {error && (
                  <p className="font-body text-xs text-ember leading-relaxed">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || !name.trim() || !body.trim()}
                  className="font-body text-xs tracking-[0.22em] uppercase text-ember disabled:text-dark/20 transition-colors duration-200"
                >
                  {status === "sending" ? "Sending…" : "Submit My Testimonial →"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
