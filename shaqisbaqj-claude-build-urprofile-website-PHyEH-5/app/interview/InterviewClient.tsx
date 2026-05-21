"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL_QUESTIONS = 10;

type Message = { role: "assistant" | "user"; content: string };
type Phase = "loading" | "interview" | "complete" | "error";

function ThinkingDots() {
  return (
    <div className="flex gap-2 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-ember"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.22 }}
        />
      ))}
    </div>
  );
}

export default function InterviewClient({
  sessionToken,
  isDemo,
}: {
  sessionToken: string | null;
  isDemo: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const progress = Math.min((questionNumber - 1) / TOTAL_QUESTIONS, 1);

  // Start the interview on mount
  useEffect(() => {
    if (!sessionToken && !isDemo) {
      setPhase("error");
      setErrorMsg("No session found. Please complete your booking first.");
      return;
    }

    fetch("/api/interview/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stripeSessionId: sessionToken }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setPhase("error");
          setErrorMsg(data.error);
          return;
        }
        if (data.alreadyComplete) {
          setPhase("complete");
          return;
        }
        setSessionId(data.sessionId);
        setMessages([{ role: "assistant", content: data.message }]);
        setQuestionNumber(data.questionNumber || 1);
        setPhase("interview");
      })
      .catch(() => {
        setPhase("error");
        setErrorMsg("Something went wrong. Please try again or contact us.");
      });
  }, [sessionToken, isDemo]);

  // Scroll to bottom after each message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending || !sessionId) return;

    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/interview/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, content: text }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong — please try again." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
        setQuestionNumber(data.questionNumber ?? questionNumber + 1);
        if (data.done) setPhase("complete");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong — please try again." },
      ]);
    }

    setSending(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-8">
          UrProfile
        </p>
        <ThinkingDots />
        <p className="font-body text-xs text-cream/30 mt-6 tracking-wide">
          Preparing your interview…
        </p>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-8 text-center">
        <div className="w-8 h-px bg-ember mb-12" />
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-6">
          UrProfile
        </p>
        <p className="font-display font-light text-cream text-3xl mb-6">{errorMsg}</p>
        <Link
          href="/book"
          className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 transition-colors"
        >
          Book your profile &rarr;
        </Link>
      </div>
    );
  }

  // ─── Complete ─────────────────────────────────────────────────────────────
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-8 text-center">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="w-full h-[2px] bg-ember mb-16" />

          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-8">
            Interview complete
          </p>

          <h1 className="font-display font-light text-cream text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.9] tracking-tight mb-8">
            You&rsquo;re all set.
          </h1>

          <p className="font-body text-base text-cream/40 leading-relaxed mb-12">
            Your story brief is ready. Your creative director will review it before your
            shoot so they arrive knowing exactly how to capture who you are.
          </p>

          <p className="font-body text-xs text-cream/20 leading-relaxed mb-12">
            Questions? <a href="mailto:hello@urprofile.co" className="text-ember/60 hover:text-ember transition-colors">hello@urprofile.co</a>
          </p>

          <Link
            href="/"
            className="font-body text-xs tracking-[0.22em] uppercase text-cream/40 hover:text-cream/70 transition-colors"
          >
            Back to home
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Interview ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark flex flex-col">

      {/* Progress bar */}
      <div className="fixed top-0 inset-x-0 h-[2px] bg-dark/50 z-50">
        <motion.div
          className="h-full bg-ember"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 pt-3 flex items-center justify-between px-8 sm:px-12 h-14">
        <p className="font-display text-cream/30 text-sm tracking-wide">UrProfile</p>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-cream/20">
          Story Interview &nbsp;&middot;&nbsp; {Math.min(questionNumber, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}
        </p>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto pt-24 pb-44 px-8 sm:px-12 max-w-2xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className={`mb-10 ${msg.role === "user" ? "flex justify-end" : ""}`}
            >
              {msg.role === "assistant" ? (
                <div className="max-w-xl">
                  <p className="font-display font-light text-cream text-[clamp(1.15rem,2.5vw,1.55rem)] leading-[1.55] whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div className="max-w-sm">
                  <p className="font-body text-sm text-cream/55 leading-relaxed text-right whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking indicator */}
        {sending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10"
          >
            <ThinkingDots />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="fixed bottom-0 inset-x-0 bg-dark border-t border-white/[0.05] px-8 sm:px-12 py-6">
        <div className="max-w-2xl mx-auto flex gap-4 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer…"
            rows={1}
            disabled={sending}
            className="flex-1 bg-transparent resize-none font-body text-sm text-cream placeholder:text-cream/20 focus:outline-none leading-relaxed py-2 max-h-32 overflow-y-auto"
            style={{ lineHeight: "1.6" }}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="font-body text-xs tracking-[0.22em] uppercase text-ember disabled:text-cream/15 transition-colors duration-200 pb-2 shrink-0"
          >
            Send &rarr;
          </button>
        </div>
        <div className="max-w-2xl mx-auto mt-3 border-t border-white/[0.05]" />
        <p className="max-w-2xl mx-auto mt-2 font-body text-[9px] tracking-[0.15em] uppercase text-cream/15">
          Enter to send &nbsp;&middot;&nbsp; Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
