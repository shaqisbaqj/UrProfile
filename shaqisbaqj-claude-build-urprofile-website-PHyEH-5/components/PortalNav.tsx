"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

const navLinks = [
  { href: "/portal", label: "Overview" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/portal/nfc", label: "NFC Cards" },
  { href: "/portal/settings", label: "Settings" },
];

export default function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-sm border-b border-dark/[0.06]">
      <div className="h-full px-8 sm:px-12 flex items-center justify-between">
        {/* Left: wordmark */}
        <span className="font-display text-lg text-dark/60 font-light">
          UrProfile
        </span>

        {/* Center: nav links — hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-body text-[10px] tracking-[0.3em] uppercase transition-colors ${
                  isActive ? "text-dark" : "text-dark/35 hover:text-dark/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: sign out */}
        <button
          onClick={handleSignOut}
          className="font-body text-[10px] tracking-[0.2em] uppercase text-dark/25 hover:text-dark/60 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
