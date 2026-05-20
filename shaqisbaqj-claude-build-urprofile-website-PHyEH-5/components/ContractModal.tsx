"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const CONTRACT_TEXT = `URPROFILE SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into between UrProfile ("Company") and the individual or entity booking services ("Client").

1. SERVICES
UrProfile agrees to provide the selected profile production tier as described on the booking page. Services include filming (where applicable), editing, profile page creation, and delivery of NFC cards as specified in the selected package.

2. PAYMENT
Client agrees to pay the full amount specified for their selected tier. Payment is due in full before production begins. All sales are final. No refunds will be issued once production has commenced.

3. TURNAROUND TIME
Completed profiles will be delivered within 5–7 business days of shoot completion or clip upload (self-guided). NFC cards will ship within 7–10 business days of profile going live.

4. CLIENT RESPONSIBILITIES
Client agrees to provide accurate information, be available for their scheduled shoot (concierge tiers), or upload complete footage within 14 days of purchase (self-guided). Client is responsible for obtaining any necessary permissions for locations or individuals appearing in their profile.

5. INTELLECTUAL PROPERTY
Client grants UrProfile the right to use their produced profile for portfolio and marketing purposes unless otherwise agreed in writing. Client retains ownership of their personal story and likeness.

6. PROFILE HOSTING
Profile hosting is included for 12 months from the date the profile goes live. Continued hosting after 12 months is available at a rate to be determined by UrProfile.

7. NFC CARDS
NFC cards are programmed to the client's profile URL at time of production. Additional NFC cards are available at $25 per card.

8. LIMITATION OF LIABILITY
UrProfile's liability is limited to the amount paid for services. UrProfile is not responsible for outcomes resulting from use of the profile including but not limited to employment decisions, business results, or third party actions.

9. GOVERNING LAW
This agreement is governed by the laws of the State of Maryland.

10. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, or agreements.

By providing an electronic signature below, Client acknowledges they have read, understood, and agree to all terms of this Service Agreement.`;

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (data: { name: string; timestamp: string }) => void;
  tier: string;
  price: string;
}

export default function ContractModal({
  isOpen,
  onClose,
  onSign,
  tier,
  price,
}: ContractModalProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [sigName, setSigName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolled = scrollProgress >= 98;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScrollProgress(0);
      setAgreed(false);
      setSigName("");
      // Small delay to let the modal render before scrolling
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 50);
    }
  }, [isOpen]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setScrollProgress(Math.min(100, progress));
  }

  const canSign = hasScrolled && agreed && sigName.trim().length >= 2;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-dark/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto w-full sm:max-w-2xl bg-cream flex flex-col"
              style={{ maxHeight: "92vh" }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-dark/10 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/30 mb-2">
                      Service Agreement
                    </p>
                    <h2 className="font-display font-light text-dark text-2xl sm:text-3xl leading-tight">
                      UrProfile {tier}
                    </h2>
                    <p className="font-body text-sm text-ember mt-1">{price}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="font-body text-dark/25 hover:text-dark/60 transition-colors text-xl mt-1"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Scroll progress bar */}
                <div className="mt-5 h-px bg-dark/10 relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-ember"
                    style={{ width: `${scrollProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                {!hasScrolled && (
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-dark/25 mt-2">
                    Scroll to read the full agreement
                  </p>
                )}
              </div>

              {/* Scrollable contract */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-8 py-6"
                style={{ minHeight: 0 }}
              >
                <pre className="font-body text-sm text-dark/60 leading-relaxed whitespace-pre-wrap">
                  {CONTRACT_TEXT}
                </pre>
              </div>

              {/* Footer — signature area */}
              <div className="px-8 py-6 border-t border-dark/10 shrink-0 space-y-5">
                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      disabled={!hasScrolled}
                    />
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-colors duration-200 ${
                        agreed
                          ? "bg-ember border-ember"
                          : hasScrolled
                          ? "border-dark/30 group-hover:border-ember/60"
                          : "border-dark/15"
                      }`}
                    >
                      {agreed && (
                        <svg className="w-2.5 h-2.5 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`font-body text-xs leading-relaxed ${hasScrolled ? "text-dark/60" : "text-dark/25"}`}>
                    I have read and agree to the UrProfile Service Agreement
                  </span>
                </label>

                {/* Signature field */}
                <div>
                  <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-dark/30 mb-2">
                    Electronic Signature — Type your full legal name
                  </label>
                  <input
                    type="text"
                    value={sigName}
                    onChange={(e) => setSigName(e.target.value)}
                    disabled={!agreed}
                    placeholder="Your full name"
                    className="w-full bg-transparent border border-dark/20 focus:border-ember outline-none px-4 py-3 font-display text-lg text-dark placeholder:text-dark/20 transition-colors duration-200 disabled:opacity-40"
                  />
                </div>

                {/* Timestamp */}
                <p className="font-body text-[10px] text-dark/25">
                  Signed on {dateStr} at {timeStr}
                </p>

                {/* CTA */}
                <button
                  disabled={!canSign}
                  onClick={() => onSign({ name: sigName.trim(), timestamp: now.toISOString() })}
                  className="w-full py-4 font-body text-xs tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-dark text-cream hover:bg-ember"
                >
                  Sign &amp; Continue to Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
