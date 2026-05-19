import type { Metadata } from "next";
import Link from "next/link";
import { getProfileBySlug } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import MuxPlayer from "@/components/MuxPlayer";

// Demo profile — always available without Supabase
const DEMO_PROFILE: Profile = {
  id: "demo",
  slug: "demo",
  name: "Alex Rivera",
  headline: "Building the future of sustainable energy",
  role: "Founder & CEO, Luminar Energy",
  location: "Austin, TX",
  video_playback_id: "VZtzUzGRv02OhJ9hDTNbd4NLPklU3WS5RIawRIF200dAFU",
  contact_email: "alex@example.com",
  created_at: new Date().toISOString(),
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await resolveProfile(params.slug);

  if (!profile) {
    return { title: "Profile not found — UrProfile" };
  }

  return {
    title: `${profile.name} — UrProfile`,
    description: profile.headline,
    openGraph: {
      title: `${profile.name} — UrProfile`,
      description: profile.headline,
      images: [
        `https://image.mux.com/${profile.video_playback_id}/thumbnail.jpg?time=2&width=1200`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} — UrProfile`,
      description: profile.headline,
      images: [
        `https://image.mux.com/${profile.video_playback_id}/thumbnail.jpg?time=2&width=1200`,
      ],
    },
  };
}

async function resolveProfile(slug: string): Promise<Profile | null> {
  if (slug === "demo") return DEMO_PROFILE;
  const profile = await getProfileBySlug(slug);
  return profile;
}

export default async function ProfilePage({ params }: Props) {
  const profile = await resolveProfile(params.slug);

  if (!profile) {
    return <ProfileNotFound slug={params.slug} />;
  }

  return (
    <div className="min-h-screen bg-dark text-cream flex flex-col">
      {/* Mobile-first layout: video takes full width, content stacks below */}
      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        {/* ── Video Panel ─────────────────────────────────────────────────── */}
        <div className="w-full lg:w-[45%] xl:w-[40%] lg:sticky lg:top-0 lg:h-screen flex items-stretch bg-[#0e0d0b]">
          <div className="w-full flex items-center justify-center p-0 lg:p-6">
            <div className="w-full max-w-sm mx-auto">
              <MuxPlayer
                playbackId={profile.video_playback_id}
                title={`${profile.name} — UrProfile`}
              />
            </div>
          </div>
        </div>

        {/* ── Content Panel ───────────────────────────────────────────────── */}
        <div className="w-full lg:flex-1 flex flex-col justify-between px-8 py-12 lg:px-16 lg:py-20">
          <div>
            {/* UrProfile branding — subtle, top */}
            <Link
              href="/"
              className="font-display text-sm tracking-[0.2em] uppercase text-cream/30 hover:text-cream/60 transition-colors mb-12 inline-block"
            >
              UrProfile
            </Link>

            {/* Name */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light leading-tight text-cream mb-4">
              {profile.name}
            </h1>

            {/* Role */}
            <p className="font-body text-sm tracking-widest uppercase text-ember mb-8">
              {profile.role}
            </p>

            {/* Divider */}
            <span className="divider block mb-8" />

            {/* Headline */}
            <p className="font-display text-2xl sm:text-3xl font-light text-linen/80 leading-snug mb-8 text-balance italic">
              &ldquo;{profile.headline}&rdquo;
            </p>

            {/* Location */}
            <p className="font-body text-sm text-cream/40 tracking-wide flex items-center gap-2 mb-12">
              <svg
                className="w-4 h-4 text-ember/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {profile.location}
            </p>

            {/* CTA */}
            <a
              href={`mailto:${profile.contact_email}`}
              className="inline-flex items-center gap-3 bg-ember text-cream font-body text-sm font-medium tracking-widest uppercase px-10 py-4 transition-all duration-300 hover:bg-[#b05526] hover:scale-[1.02] active:scale-100"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Get in touch
            </a>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="font-body text-xs text-cream/25 tracking-widest uppercase">
              Profile by UrProfile
            </p>
            <Link
              href="/book"
              className="font-body text-xs text-ember/60 hover:text-ember tracking-widest uppercase underline underline-offset-4 transition-colors"
            >
              Get your own profile &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center px-6 text-center">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-ember mb-6">
        404
      </p>
      <h1 className="font-display text-6xl sm:text-7xl font-light text-cream mb-6">
        Profile not found.
      </h1>
      <p className="font-body text-linen/50 text-lg mb-12 max-w-md">
        There&apos;s no profile at{" "}
        <span className="text-cream/70">/{slug}</span>. It may have moved, or
        it doesn&apos;t exist yet.
      </p>
      <div className="flex flex-col xs:flex-row gap-4">
        <Link
          href="/"
          className="inline-block border border-cream/20 text-cream/70 font-body text-sm tracking-widest uppercase px-8 py-4 hover:border-cream/50 hover:text-cream transition-all"
        >
          Go home
        </Link>
        <Link
          href="/book"
          className="inline-block bg-ember text-cream font-body text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#b05526] transition-all"
        >
          Book your profile
        </Link>
      </div>
    </div>
  );
}
