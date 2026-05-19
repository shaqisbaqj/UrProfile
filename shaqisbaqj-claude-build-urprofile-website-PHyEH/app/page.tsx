import Link from "next/link";
import Nav from "@/components/Nav";
import ProfileCard from "@/components/ProfileCard";

const DEMO_PROFILES = [
  {
    slug: "demo",
    name: "Alex Rivera",
    headline: "Building the future of sustainable energy",
    role: "Founder & CEO",
    company: "Luminar Energy",
    location: "Austin, TX",
    video_playback_id: "VZtzUzGRv02OhJ9hDTNbd4NLPklU3WS5RIawRIF200dAFU",
  },
  {
    slug: "morgan",
    name: "Morgan Chen",
    headline: "Designing systems that outlast trends",
    role: "Principal Designer",
    company: "Studio Meridian",
    location: "New York, NY",
    video_playback_id: "VZtzUzGRv02OhJ9hDTNbd4NLPklU3WS5RIawRIF200dAFU",
  },
  {
    slug: "dara",
    name: "Dara Osei",
    headline: "Turning data into decisions at scale",
    role: "VP of Growth",
    company: "Fable Health",
    location: "London, UK",
    video_playback_id: "VZtzUzGRv02OhJ9hDTNbd4NLPklU3WS5RIawRIF200dAFU",
  },
];

const WHAT_IS_INCLUDED = [
  "Half-day professional video shoot",
  "Expert editing & color grade",
  "Custom branded profile page",
  "Shareable link — forever yours",
  "Mobile-optimized, instant loading",
  "Dedicated creative director",
];

export default function Home() {
  return (
    <>
      <Nav transparent />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark text-cream">
        {/* Grain texture overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle ember gradient bottom */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(196,98,45,0.12) 0%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="animate-fade-up text-sand text-sm tracking-[0.25em] uppercase mb-8 font-body font-medium">
            Premium Concierge Video Profile
          </p>

          <h1 className="animate-fade-up-delay-1 font-display text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-light leading-[0.9] tracking-tight text-balance">
            They&apos;ll profile you.
            <br />
            <em className="text-ember not-italic">Give them</em>
            <br />
            your profile.
          </h1>

          <p className="animate-fade-up-delay-2 mt-10 text-linen/70 font-body text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            One shoot. One edit. One link that tells your whole story — before
            the room goes quiet.
          </p>

          <div className="animate-fade-up-delay-3 mt-12 flex flex-col xs:flex-row gap-4 justify-center items-center">
            <Link
              href="/book"
              className="inline-block bg-ember text-cream font-body text-sm font-medium tracking-widest uppercase px-10 py-4 transition-all duration-300 hover:bg-[#b05526] hover:scale-[1.02] active:scale-100"
            >
              Book Your Profile
            </Link>
            <Link
              href="/profile/demo"
              className="inline-block border border-cream/30 text-cream/80 font-body text-sm font-medium tracking-widest uppercase px-10 py-4 transition-all duration-300 hover:border-cream/60 hover:text-cream"
            >
              See a Demo Profile
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-cream/50 animate-pulse" />
        </div>
      </section>

      {/* ── What is UrProfile ─────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <span className="divider mb-8 block" />
          <h2 className="font-display text-5xl sm:text-6xl font-light text-dark leading-tight mb-8">
            The profile they look at
            <em className="text-ember"> before</em> they look you up.
          </h2>
          <p className="font-body text-lg text-dark/70 leading-relaxed mb-6">
            UrProfile is a premium concierge service that produces a single,
            cinematic video profile page — built for founders, executives, and
            creatives who understand that first impressions are everything.
          </p>
          <p className="font-body text-lg text-dark/70 leading-relaxed mb-6">
            We handle everything: the shoot, the edit, the page. You get a
            shareable link that captures who you are in 60 seconds — and lasts
            forever.
          </p>
          <p className="font-body text-lg text-dark/70 leading-relaxed">
            Think of it as a business card for people who&apos;ve outgrown
            business cards.
          </p>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-dark text-cream">
        <div className="max-w-5xl mx-auto">
          <span className="divider mb-8 block" />
          <h2 className="font-display text-5xl sm:text-6xl font-light mb-20 text-balance">
            Three steps.{" "}
            <em className="text-ember">One profile.</em>
          </h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                step: "01",
                title: "We shoot.",
                body: "A dedicated creative director and cinematographer come to you. Half a day, zero stress. We know exactly how to draw out your story.",
              },
              {
                step: "02",
                title: "We edit.",
                body: "Our editors craft a 45–90 second film from your footage. Color graded, sound designed, and paced to hold attention from the first second.",
              },
              {
                step: "03",
                title: "We build your profile.",
                body: "Your film goes live on a custom UrProfile page — mobile-optimized, instantly shareable, and yours forever. urprofile.com/yourname.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="group">
                <p className="font-display text-8xl font-light text-ember/30 leading-none mb-4 transition-colors duration-300 group-hover:text-ember/50">
                  {step}
                </p>
                <h3 className="font-display text-3xl font-medium mb-4 text-cream">
                  {title}
                </h3>
                <p className="font-body text-linen/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Profiles ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-linen/40">
        <div className="max-w-5xl mx-auto">
          <span className="divider mb-8 block" />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <h2 className="font-display text-5xl sm:text-6xl font-light text-dark">
              Profiles in the wild.
            </h2>
            <Link
              href="/profile/demo"
              className="font-body text-sm tracking-widest uppercase text-ember underline underline-offset-4 hover:text-dark transition-colors shrink-0"
            >
              View full demo &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEMO_PROFILES.map((profile) => (
              <ProfileCard key={profile.slug} profile={profile} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <span className="divider mb-8 block" />
          <h2 className="font-display text-5xl sm:text-6xl font-light text-dark mb-4">
            One package.
          </h2>
          <p className="font-display text-7xl sm:text-8xl font-light text-ember mb-6">
            $2,500.
          </p>
          <p className="font-display text-4xl font-light text-dark mb-16 italic">
            Everything included.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {WHAT_IS_INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-4">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ember shrink-0" />
                <p className="font-body text-dark/80">{item}</p>
              </div>
            ))}
          </div>

          <Link
            href="/book"
            className="inline-block bg-dark text-cream font-body text-sm font-medium tracking-widest uppercase px-12 py-5 transition-all duration-300 hover:bg-ember active:scale-[0.98]"
          >
            Book Your Profile
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-dark border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-display text-xl text-cream/60 tracking-wide">
            UrProfile
          </p>
          <p className="font-body text-xs text-cream/30 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} UrProfile. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
