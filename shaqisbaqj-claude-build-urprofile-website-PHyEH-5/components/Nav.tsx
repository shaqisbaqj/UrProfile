"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavProps {
  transparent?: boolean;
}

export default function Nav({ transparent = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const isTransparent = transparent && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-dark/98 border-b border-white/[0.06]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 sm:px-12 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className={`font-display text-xl tracking-wide transition-colors duration-500 ${
            isTransparent ? "text-cream/80" : "text-cream/70"
          } hover:text-cream`}
        >
          UrProfile
        </Link>

        {/* Center: Nav links (desktop only) */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#how-it-works"
            className={`font-body text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              isTransparent
                ? "text-cream/30 hover:text-cream/60"
                : "text-dark/40 hover:text-ember"
            }`}
          >
            How It Works
          </a>
          <a
            href="/#pricing"
            className={`font-body text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              isTransparent
                ? "text-cream/30 hover:text-cream/60"
                : "text-dark/40 hover:text-ember"
            }`}
          >
            Pricing
          </a>
          <Link
            href="/self-guided"
            className={`font-body text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              isTransparent
                ? "text-cream/30 hover:text-cream/60"
                : "text-dark/40 hover:text-ember"
            }`}
          >
            Self Guided
          </Link>
        </div>

        {/* Right: Book CTA */}
        <Link
          href="/book"
          className={`font-body text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
            isTransparent
              ? "text-ember/70 hover:text-ember"
              : "text-ember/80 hover:text-ember"
          }`}
        >
          Book Your Profile
        </Link>
      </div>
    </nav>
  );
}
