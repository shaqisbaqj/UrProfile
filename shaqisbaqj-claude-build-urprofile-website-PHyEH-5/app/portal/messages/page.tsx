"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortalNav from "@/components/PortalNav";
import { getSupabaseClient } from "@/lib/supabase";

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  sender_type: "client" | "admin";
  body: string;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (diffDays === 1) {
      return `Yesterday, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    } else {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        ", " +
        d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
  } catch {
    return "";
  }
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isClient = message.sender_type === "client";

  if (isClient) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-sm sm:max-w-md">
          <div className="bg-dark px-4 py-3">
            <p className="font-body text-sm text-cream leading-relaxed whitespace-pre-wrap">
              {message.body}
            </p>
          </div>
          <p className="font-body text-[10px] text-dark/30 text-right mt-1.5">
            {formatTimestamp(message.created_at)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-sm sm:max-w-md">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-dark/30 mb-1.5">
          UrProfile
        </p>
        <div className="bg-linen px-4 py-3">
          <p className="font-body text-sm text-dark leading-relaxed whitespace-pre-wrap">
            {message.body}
          </p>
        </div>
        <p className="font-body text-[10px] text-dark/30 mt-1.5">
          {formatTimestamp(message.created_at)}
        </p>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-dark/5 animate-pulse ${className ?? ""}`} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Load messages on mount ─────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();

      // No Supabase — graceful dev fallback
      if (!supabase) {
        setMessages([
          {
            id: "demo-1",
            sender_type: "admin",
            body: "Welcome to UrProfile! We're excited to work with you. Your creative director will be in touch within 24 hours to schedule your shoot.",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          },
          {
            id: "demo-2",
            sender_type: "client",
            body: "Looking forward to it — thank you!",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
        ]);
        setToken("demo");
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

      setToken(session.access_token);

      try {
        const res = await fetch("/api/messages", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const json = await res.json();
        if (Array.isArray(json.messages)) {
          setMessages(json.messages);
        }
      } catch {
        // API unavailable — show empty state
      }

      setLoading(false);
    }

    load();
  }, []);

  // ── Send message ────────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.trim();
    if (!text || sending || !token) return;

    // Optimistic append
    const optimistic: Message = {
      id: `optimistic-${Date.now()}`,
      sender_type: "client",
      body: text,
      created_at: new Date().toISOString(),
    };

    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: text }),
      });

      const json = await res.json();

      // Replace optimistic with real message if server returns it
      if (json.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? json.message : m))
        );
      }
    } catch {
      // Leave optimistic message — user can see it was "sent" locally
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

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <PortalNav />
        <main className="pt-28 pb-40 px-8 sm:px-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-3 w-20 mb-5" />
            <Skeleton className="h-9 w-56 mb-16" />
            <div className="flex flex-col gap-6">
              <div className="flex justify-start">
                <Skeleton className="h-16 w-64" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-12 w-48" />
              </div>
              <div className="flex justify-start">
                <Skeleton className="h-20 w-72" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <PortalNav />

      {/* ── Thread area ── */}
      <main className="flex-1 pt-28 pb-40 px-8 sm:px-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-16"
          >
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-5">
              Messages
            </p>
            <h1 className="font-display font-light text-dark text-[clamp(2rem,4vw,3.5rem)] leading-none">
              Your thread with UrProfile.
            </h1>
          </motion.div>

          {/* Empty state */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="border-l-2 border-dark/10 pl-4 py-2"
            >
              <p className="font-body text-sm text-dark/40 leading-relaxed">
                No messages yet. We&apos;ll reach out within 24 hours of your booking.
              </p>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── Sticky send form ── */}
      <div className="fixed bottom-0 inset-x-0 bg-cream border-t border-dark/10 px-8 sm:px-12 py-4 z-40">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message…"
              rows={2}
              disabled={sending}
              className="flex-1 bg-cream resize-none font-body text-sm text-dark placeholder:text-dark/25 border border-dark/15 focus:border-ember focus:outline-none px-4 py-3 leading-relaxed transition-colors duration-200"
              style={{ minHeight: "70px" }}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="bg-dark text-cream font-body text-xs tracking-[0.2em] uppercase px-6 py-3 disabled:opacity-25 transition-opacity duration-200 shrink-0 self-end"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
          <p className="font-body text-[9px] tracking-[0.15em] uppercase text-dark/20 mt-2">
            Enter to send &nbsp;&middot;&nbsp; Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
