import Link from "next/link";
import Nav from "@/components/Nav";

const STEPS = [
  {
    n: "01",
    title: "We shoot.",
    body: "A creative director and cinematographer come to you. Half a day. We've done this enough times to know exactly how to draw out what makes you worth knowing.",
  },
  {
    n: "02",
    title: "We edit.",
    body: "Sixty to ninety seconds. Color graded, sound designed, paced to hold attention from the first frame. Not a talking-head video. A film.",
  },
  {
    n: "03",
    title: "We build your profile.",
    body: "Your film lives on a page at urprofile.com/you. Mobile-first, instant-loading, yours forever. Share the link. Tap the card. Scan the code.",
  },
];

const INCLUDED = [
  "Half-day professional shoot",
  "Expert editing and color grade",
  "Custom profile page live on UrProfile",
  "Two branded NFC cards linked to your profile",
  "Shareable link — yours forever",
  "Dedicated creative director",
];

export default function Home() {
  return (
    <>
      <Nav transparent />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col justify-end bg-dark overflow-hidden">

        {/* Single vertical rule — left margin reference */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-[max(3rem,calc(50vw-36rem))] w-px bg-white/[0.04]"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 sm:px-12 pb-20 sm:pb-28">

          {/* Label */}
          <p className="fade-up font-body text-[10px] tracking-[0.3em] uppercase text-cream/30 mb-10">
            Premium Concierge Video Profile
          </p>

          {/* Tagline */}
          <h1 className="fade-up-1 font-display font-light text-cream leading-[0.88] tracking-tight text-[clamp(3.5rem,9vw,8rem)]">
            They&apos;ll profile you.
            <br />
            <em className="text-ember not-italic">Give them</em>
            <br />
            your profile.
          </h1>

          {/* CTA row */}
          <div className="fade-up-2 mt-16 flex items-center gap-10">
            <Link
              href="/book"
              className="font-body text-xs tracking-[0.2em] uppercase text-cream/90 hover:text-ember transition-colors duration-300"
            >
              Book your profile &rarr;
            </Link>
            <Link
              href="/profile/demo"
              className="font-body text-xs tracking-[0.2em] uppercase text-cream/30 hover:text-cream/60 transition-colors duration-300"
            >
              See a demo
            </Link>
          </div>
        </div>

        {/* Scroll line */}
        <div aria-hidden className="absolute bottom-0 left-[max(3rem,calc(50vw-36rem))] w-px h-20 bg-gradient-to-b from-white/0 to-white/10" />
      </section>

      {/* ─── Pull quote ───────────────────────────────────────────────────── */}
      <section className="bg-cream py-40 sm:py-52 px-8 sm:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/30 mb-16">
            What it is
          </p>
          <blockquote className="font-display font-light text-dark leading-[1.1] text-[clamp(2.2rem,5vw,4.5rem)]">
            A business card for people who&apos;ve outgrown business cards.
          </blockquote>
          <p className="mt-12 font-body text-base text-dark/50 leading-relaxed max-w-xl">
            You get one chance to be remembered. UrProfile makes sure that
            chance counts — a single, cinematic page that says more in sixty
            seconds than a résumé says in six pages.
          </p>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-dark text-cream py-40 sm:py-52 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto">

          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-24">
            How it works
          </p>

          <div className="space-y-28">
            {STEPS.map(({ n, title, body }) => (
              <div
                key={n}
                className="grid grid-cols-[auto_1fr] sm:grid-cols-[6rem_1fr_1fr] gap-x-10 gap-y-4 items-start"
              >
                {/* Number */}
                <span className="font-display font-light text-ember text-[clamp(3rem,6vw,5rem)] leading-none mt-1">
                  {n}
                </span>

                {/* Title */}
                <h3 className="font-display font-light text-cream text-[clamp(1.8rem,3.5vw,3rem)] leading-tight col-start-2 sm:col-start-auto">
                  {title}
                </h3>

                {/* Body */}
                <p className="font-body text-cream/40 leading-relaxed text-base col-start-2 sm:col-start-auto">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured profile ─────────────────────────────────────────────── */}
      <section className="bg-dark">
        <Link href="/profile/demo" className="group block relative">

          {/* Cinematic 16:9 frame — shows Mux thumbnail */}
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0a0907]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://image.mux.com/VZtzUzGRv02OhJ9hDTNbd4NLPklU3WS5RIawRIF200dAFU/thumbnail.jpg?time=4&width=1600"
              alt="Alex Rivera — UrProfile demo"
              className="w-full h-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-75 scale-[1.02] group-hover:scale-100 transition-transform duration-700"
            />

            {/* Dark vignette — bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent" />

            {/* Film letterbox bars */}
            <div aria-hidden className="absolute top-0 left-0 right-0 h-[6%] bg-dark" />
            <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[6%] bg-dark" />
          </div>

          {/* Caption — overlaid bottom left */}
          <div className="absolute bottom-[6%] left-0 right-0 px-8 sm:px-12 pb-8 sm:pb-12 flex items-end justify-between">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/30 mb-3">
                Demo profile
              </p>
              <h2 className="font-display font-light text-cream text-3xl sm:text-5xl leading-tight">
                Alex Rivera
              </h2>
              <p className="font-body text-xs tracking-widest uppercase text-ember mt-2">
                Founder & CEO, Luminar Energy &ensp;·&ensp; Austin, TX
              </p>
            </div>
            <p className="hidden sm:block font-body text-xs tracking-[0.2em] uppercase text-cream/30 group-hover:text-cream/60 transition-colors duration-300">
              View profile &rarr;
            </p>
          </div>
        </Link>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────────── */}
      <section className="bg-cream py-40 sm:py-52 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto">

          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/30 mb-24">
            Pricing
          </p>

          {/* Price */}
          <div className="mb-24">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/30 mb-6">
              UrProfile Signature
            </p>
            <p className="font-display font-light text-dark leading-none text-[clamp(5rem,14vw,12rem)] tracking-tight">
              $1,000
            </p>
            <p className="font-display font-light italic text-dark/40 text-[clamp(1.5rem,3vw,2.5rem)] mt-4">
              Everything included.
            </p>
            <p className="font-body text-sm text-dark/40 mt-5 max-w-md leading-relaxed">
              Within 50 miles of Lusby, MD. Travel beyond 50 miles available —&nbsp;
              <Link href="/book" className="underline underline-offset-4 hover:text-ember transition-colors duration-200">
                contact us for a quote.
              </Link>
            </p>
          </div>

          {/* Line items */}
          <div className="border-t border-dark/10">
            {INCLUDED.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-5 border-b border-dark/10"
              >
                <p className="font-body text-sm text-dark/60">{item}</p>
                <span className="w-1 h-1 bg-ember block shrink-0" />
              </div>
            ))}
          </div>

          {/* Add-on note */}
          <p className="mt-10 font-body text-sm text-dark/35">
            Need more NFC cards? Add additional cards for $8 each.
          </p>

          {/* CTA */}
          <div className="mt-16">
            <Link
              href="/book"
              className="font-body text-xs tracking-[0.2em] uppercase text-dark/90 hover:text-ember transition-colors duration-300"
            >
              Book your profile &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-dark border-t border-white/[0.05] py-10 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-display text-lg text-cream/30 tracking-wide">
            UrProfile
          </p>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/20">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}
