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
        <Link
          href="/"
          className={`font-display text-xl tracking-wide transition-colors duration-500 ${
            isTransparent ? "text-cream/80" : "text-cream/70"
          } hover:text-cream`}
        >
          UrProfile
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className={`font-body text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              isTransparent ? "text-cream/30 hover:text-cream/60" : "text-cream/25 hover:text-cream/50"
            }`}
          >
            Client Login
          </Link>
          <Link
            href="/book"
            className={`font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
              isTransparent ? "text-cream/50 hover:text-cream" : "text-cream/40 hover:text-ember"
            }`}
          >
            Book
          </Link>
        </div>
      </div>
    </nav>
  );
}
