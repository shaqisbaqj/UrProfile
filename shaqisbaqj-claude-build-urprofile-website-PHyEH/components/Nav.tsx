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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const isTransparent = transparent && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent"
          : "bg-cream/95 backdrop-blur-sm border-b border-linen"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className={`font-display text-2xl font-semibold tracking-wide transition-colors duration-300 ${
            isTransparent ? "text-cream" : "text-dark"
          }`}
        >
          UrProfile
        </Link>

        <Link
          href="/book"
          className={`
            text-sm font-body font-medium tracking-widest uppercase px-6 py-2.5
            border transition-all duration-300
            ${
              isTransparent
                ? "border-cream/60 text-cream hover:bg-cream hover:text-dark"
                : "border-ember text-ember hover:bg-ember hover:text-cream"
            }
          `}
        >
          Book Your Profile
        </Link>
      </div>
    </nav>
  );
}
