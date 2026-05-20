"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Nav from "@/components/Nav";

// ─── Easing ────────────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Word-split reveal (used in hero, on mount) ────────────────────────────
function HeroLine({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden leading-[0.88] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "102%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1, ease: EASE }}
      >
        {text}
      </motion.span>
    </span>
  );
}

// ─── Line reveal on scroll (clip from bottom) ──────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay, duration: 0.9, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Fade up on scroll ────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Staggered word reveal on scroll ─────────────────────────────────────
function WordReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ delay: delay + i * 0.06, duration: 0.9, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "We shoot.",
    body: "A creative director comes to you. Half a day. We capture you in your element.",
  },
  {
    n: "02",
    title: "We edit.",
    body: "60 to 90 seconds. Color graded. Sound designed. A film, not a talking-head video.",
  },
  {
    n: "03",
    title: "You own the room.",
    body: "Your profile goes live. Your NFC cards arrive. Every first impression from here is yours to control.",
  },
];

const WHO = [
  "Service providers closing more estimates",
  "Consultants building trust before the meeting",
  "Ministers presenting to networks and districts",
  "Executives walking into board rooms",
  "Sales professionals who need trust before the conversation starts",
  "Job seekers standing out before the interview",
  "Small business owners competing against larger companies",
];

const PORTRAITS = [
  { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80&fit=crop&crop=face", alt: "Professional" },
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&fit=crop&crop=face", alt: "Professional" },
  { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&fit=crop&crop=face", alt: "Professional" },
  { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&fit=crop&crop=face", alt: "Professional" },
  { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&fit=crop&crop=face", alt: "Professional" },
  { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&fit=crop&crop=face", alt: "Professional" },
];

const DEMO_TESTIMONIALS = [
  {
    id: "demo-1",
    body: "I used to spend the first 20 minutes of every client meeting explaining who I am. Now they already know. Three prospects signed before we ever sat down.",
    name: "Marcus T.",
    role: "Financial Advisor",
  },
  {
    id: "demo-2",
    body: "I sent my profile link before every showing for a month. My close rate changed. People showed up ready to trust me instead of ready to evaluate me.",
    name: "Sarah K.",
    role: "Real Estate Agent",
  },
  {
    id: "demo-3",
    body: "Our board presentations used to start with introductions. Now they start with my profile. It changed the energy in the room before I said a word.",
    name: "David R.",
    role: "Nonprofit Director",
  },
];

const FAQS = [
  {
    q: "How long does the shoot take?",
    a: "Half a day. We come to you, handle everything, and you're done.",
  },
  {
    q: "How long until my profile is live?",
    a: "Within 5–7 business days of your shoot.",
  },
  {
    q: "What are NFC cards?",
    a: "Sleek branded cards that open your profile instantly when tapped on any smartphone. No app needed.",
  },
  {
    q: "Do I need to be on camera?",
    a: "Yes — but we coach you through everything. Most clients are surprised how natural it feels.",
  },
  {
    q: "What if I'm outside the 50 mile radius?",
    a: "We travel. Contact us for a custom quote.",
  },
  {
    q: "Can I update my profile later?",
    a: "Yes. Contact us to discuss a refresh.",
  },
];

const PRICING = [
  {
    name: "Self Guided",
    price: "$299",
    popular: false,
    features: [
      "AI story interview",
      "Personalized shot list",
      "Professional edit by UrProfile",
      "Profile page live on UrProfile",
      "One NFC card shipped",
    ],
    bestFor: "Anyone who can't do a local shoot",
    borderClass: "border-dark/15",
    useCases: [
      { emoji: "🎓", title: "The College Senior", desc: "Sending your profile link with every application instead of hoping your resume stands out." },
      { emoji: "💻", title: "The Freelancer", desc: "Standing out on crowded platforms where everyone looks identical on paper." },
      { emoji: "🔄", title: "The Career Changer", desc: "Reintroducing yourself to a new industry without starting from zero." },
      { emoji: "✨", title: "The Side Hustler", desc: "Turning your passion project into something people take seriously." },
      { emoji: "🌱", title: "The Recent Grad", desc: "Making your first impression before you have years of experience to show." },
    ],
  },
  {
    name: "Starter",
    price: "$599",
    popular: false,
    features: [
      "45 second profile film",
      "Profile page live on UrProfile",
      "Digital share link",
      "QR code included",
    ],
    bestFor: "College students, early career professionals",
    borderClass: "border-dark/20",
    useCases: [
      { emoji: "🏢", title: "The Small Business Owner", desc: "Competing for local contracts against companies twice your size." },
      { emoji: "🏠", title: "The Real Estate Agent", desc: "Building trust with buyers and sellers before the first showing." },
      { emoji: "💪", title: "The Personal Trainer", desc: "Converting consultations faster when clients already believe in you." },
      { emoji: "❤️", title: "The Nonprofit Leader", desc: "Connecting with donors emotionally before they ever see your financials." },
      { emoji: "✝️", title: "The Minister", desc: "Presenting yourself to a new congregation or district with confidence and clarity." },
    ],
  },
  {
    name: "Signature",
    price: "$999",
    popular: true,
    features: [
      "90 second profile film",
      "Profile page live on UrProfile",
      "Two branded NFC cards",
      "Custom profile URL",
      "LinkedIn optimization guide",
    ],
    bestFor: "Service providers, consultants, sales professionals, ministers",
    borderClass: "border-ember",
    useCases: [
      { emoji: "🔧", title: "The Service Provider", desc: "Closing estimates faster because the homeowner already trusts you before you knock." },
      { emoji: "📊", title: "The Consultant", desc: "Walking into a pitch where the client already knows why you're the right choice." },
      { emoji: "💰", title: "The Financial Advisor", desc: "Starting every client relationship three steps ahead of where you'd normally begin." },
      { emoji: "🤝", title: "The Sales Professional", desc: "Opening doors that used to stay closed because nobody knew who you were." },
      { emoji: "⛪", title: "The Pastor", desc: "Letting your calling speak before you ever step behind a pulpit." },
    ],
  },
  {
    name: "Executive",
    price: "$2,499",
    popular: false,
    features: [
      "2–3 minute profile film",
      "Profile page live on UrProfile",
      "Four branded NFC cards",
      "Custom profile URL",
      "Testimonial capture segment",
      "Team profile option",
      "Headshots included",
    ],
    bestFor: "Executives, corporations, institutional clients",
    borderClass: "border-dark/40",
    useCases: [
      { emoji: "👔", title: "The C-Suite Executive", desc: "A personal brand that matches the level you've already reached professionally." },
      { emoji: "🏛️", title: "The Government Contractor", desc: "Proposals that feel like an introduction to a person, not a submission to a committee." },
      { emoji: "🎤", title: "The Keynote Speaker", desc: "Walking onto every stage already known by everyone in the room." },
      { emoji: "🏢", title: "The Corporate Team", desc: "Consistent professional presence across your entire leadership team." },
      { emoji: "🗳️", title: "The Political Candidate", desc: "Making your first impression at scale before you shake a single hand." },
    ],
  },
];

// ─── FAQ Accordion Item ────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-dark/10">
      <button
        className="w-full flex items-start justify-between py-7 text-left gap-8"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display font-light text-dark text-xl sm:text-2xl leading-snug">
          {q}
        </span>
        <motion.span
          className="font-body text-dark/30 text-lg shrink-0 mt-1"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="font-body text-base text-dark/50 leading-relaxed pb-7 max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  // Parallax refs
  const featureRef = useRef(null);
  const { scrollYProgress: featureScroll } = useScroll({
    target: featureRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(featureScroll, [0, 1], ["-6%", "6%"]);

  // Live testimonials (falls back to demo data when DB not configured)
  const [testimonials, setTestimonials] = useState(DEMO_TESTIMONIALS);
  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.testimonials?.length > 0) setTestimonials(data.testimonials);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Nav transparent />

      {/* ─── 1. Hero ───────────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col justify-end bg-dark overflow-hidden">

        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80&fit=crop"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-0 transition-opacity duration-1000"
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '0.35'; }}
          />
          <div className="absolute inset-0 bg-dark/75" />
        </div>

        {/* Subtle vertical rule */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-[max(2rem,calc(50vw-38rem))] w-px bg-white/[0.04] z-10"
        />

        {/* Content anchored bottom-left */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 sm:px-12 pb-20 sm:pb-28">

          {/* Label */}
          <motion.p
            className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Premium Concierge Video Profile
          </motion.p>

          {/* Tagline — line by line clip reveal */}
          <h1 className="font-display font-light text-cream tracking-tight text-[clamp(3.2rem,8.5vw,8rem)]">
            <HeroLine text="Your first impression." delay={0.3} />
            <HeroLine
              text="Finally in"
              delay={0.5}
            />
            <HeroLine text="your control." delay={0.7} className="text-ember" />
          </h1>

          {/* Subheadline */}
          <motion.p
            className="mt-8 font-body text-sm text-cream/40 leading-relaxed max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.9 }}
          >
            One tap. One film. One profile. Help people trust you before the conversation starts.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex items-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Link
              href="/book"
              className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 transition-colors duration-300"
            >
              Book Your Profile &rarr;
            </Link>
            <Link
              href="/profile/demo"
              className="font-body text-xs tracking-[0.22em] uppercase text-cream/25 hover:text-cream/60 transition-colors duration-300"
            >
              See a Demo
            </Link>
          </motion.div>
        </div>

        {/* Descending line */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 right-12 sm:right-16 w-px bg-white/10 z-10"
          initial={{ height: 0 }}
          animate={{ height: 80 }}
          transition={{ delay: 1.4, duration: 1, ease: EASE }}
        />
      </section>

      {/* ─── 2. Why first impressions fail ────────────────────────────── */}
      <section id="why" className="bg-cream overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left: text */}
          <div className="py-40 sm:py-56 px-8 sm:px-12">
            <FadeUp>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-14">
                The problem
              </p>
            </FadeUp>

            <blockquote className="font-display font-light text-dark leading-[1.05] text-[clamp(2rem,4.5vw,4rem)]">
              <WordReveal text="Most of the time they get you wrong." />
            </blockquote>

            <FadeUp delay={0.2} className="mt-12 max-w-lg">
              <p className="font-body text-base text-dark/45 leading-relaxed">
                Not because you aren&apos;t qualified. Because your resume, your bio, your business card — none of them show who you actually are. They summarize you. UrProfile represents you.
              </p>
            </FadeUp>
          </div>

          {/* Right: image (desktop only) */}
          <div className="hidden lg:block relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&fit=crop"
              alt="Professional in a workplace setting"
              className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
              onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '0.5'; }}
            />
            <div className="absolute inset-0 bg-cream/20" />
          </div>
        </div>
      </section>

      {/* ─── 3. Live example profile showcase ─────────────────────────── */}
      <section ref={featureRef} className="bg-dark overflow-hidden">
        <Link href="/profile/demo" className="group block relative">

          {/* Aspect container */}
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0a0907]">

            {/* Parallax image */}
            <motion.div
              className="absolute inset-[-8%] w-[116%] h-[116%]"
              style={{ y: imageY }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://image.mux.com/VZtzUzGRv02OhJ9hDTNbd4NLPklU3WS5RIawRIF200dAFU/thumbnail.jpg?time=4&width=1600"
                alt="Alex Rivera — UrProfile demo"
                className="w-full h-full object-cover opacity-55 transition-opacity duration-700 group-hover:opacity-70"
              />
            </motion.div>

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/30 to-transparent" />

            {/* Letterbox bars */}
            <div aria-hidden className="absolute top-0 inset-x-0 h-[7%] bg-dark" />
            <div aria-hidden className="absolute bottom-0 inset-x-0 h-[7%] bg-dark" />

            {/* Clip reveal overlay — wipes up on hover */}
            <motion.div
              className="absolute inset-0 bg-ember/5 pointer-events-none"
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-[7%] inset-x-0 px-8 sm:px-12 pb-6 sm:pb-10 flex items-end justify-between">
            <div>
              <FadeUp>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-3">
                  Demo profile
                </p>
                <h2 className="font-display font-light text-cream text-3xl sm:text-5xl lg:text-6xl leading-tight">
                  Alex Rivera
                </h2>
                <p className="font-body text-xs tracking-[0.18em] uppercase text-ember mt-2">
                  Founder &amp; CEO, Luminar Energy&ensp;&middot;&ensp;Austin, TX
                </p>
              </FadeUp>
            </div>

            <motion.p
              className="hidden sm:block font-body text-xs tracking-[0.22em] uppercase text-cream/25"
              animate={{ opacity: 1 }}
              whileHover={{ opacity: 1 }}
              initial={{ opacity: 0.4 }}
              transition={{ duration: 0.3 }}
            >
              <span className="group-hover:text-cream/70 transition-colors duration-300">
                View profile &rarr;
              </span>
            </motion.p>
          </div>
        </Link>
      </section>

      {/* ─── 4. How it works ───────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-dark text-cream py-40 sm:py-56 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto">

          <FadeUp>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/20 mb-24">
              How it works
            </p>
          </FadeUp>

          <div className="space-y-24 sm:space-y-32">
            {STEPS.map(({ n, title, body }, i) => (
              <div
                key={n}
                className="grid grid-cols-[3rem_1fr] sm:grid-cols-[5rem_1fr_1.2fr] gap-x-8 sm:gap-x-16 items-start"
              >
                {/* Number */}
                <Reveal delay={i * 0.05}>
                  <span className="font-display font-light text-ember text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
                    {n}
                  </span>
                </Reveal>

                {/* Title */}
                <Reveal delay={i * 0.05 + 0.08} className="col-start-2">
                  <h3 className="font-display font-light text-cream text-[clamp(1.6rem,3vw,2.8rem)] leading-tight pt-1">
                    {title}
                  </h3>
                </Reveal>

                {/* Body */}
                <FadeUp
                  delay={i * 0.05 + 0.16}
                  className="col-start-2 sm:col-start-3 row-start-2 sm:row-start-1 mt-4 sm:mt-0"
                >
                  <p className="font-body text-cream/35 leading-relaxed text-base">
                    {body}
                  </p>
                </FadeUp>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Two Ways section ───────────────────────────────────────── */}
      <section className="bg-cream py-40 sm:py-56 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto mb-16">
          <FadeUp>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-6">
              Get started
            </p>
          </FadeUp>
          <Reveal>
            <h2 className="font-display font-light text-dark text-[clamp(2rem,4.5vw,4rem)] leading-[1.05]">
              Two ways to get your profile.
            </h2>
          </Reveal>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Card 1 — Self Guided */}
          <FadeUp delay={0.05}>
            <div className="relative min-h-[400px] p-12 sm:p-16 bg-dark flex flex-col justify-between overflow-hidden">
              {/* Ember accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-ember" />
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80&fit=crop"
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                  onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
                />
              </div>
              {/* Content */}
              <div className="relative z-10">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/25 mb-8">
                  Remote — $299
                </p>
                <h3 className="font-display font-light text-cream text-[clamp(1.8rem,3.5vw,3rem)] leading-tight mb-6">
                  Film it yourself. We edit it.
                </h3>
                <p className="font-body text-sm text-cream/45 leading-relaxed max-w-sm">
                  Our AI interviews you, builds your shot list, and tells you exactly what to film. Upload your clips. We handle the rest.
                </p>
              </div>
              <div className="relative z-10 mt-10">
                <Link
                  href="/self-guided"
                  className="font-body text-xs tracking-[0.22em] uppercase text-cream/50 hover:text-cream transition-colors duration-300"
                >
                  Get Started &rarr;
                </Link>
              </div>
            </div>
          </FadeUp>

          {/* Card 2 — Concierge */}
          <FadeUp delay={0.1}>
            <div className="relative min-h-[400px] p-12 sm:p-16 bg-ember flex flex-col justify-between overflow-hidden">
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80&fit=crop"
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                  onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
                />
              </div>
              {/* Content */}
              <div className="relative z-10">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/40 mb-8">
                  Concierge — From $599
                </p>
                <h3 className="font-display font-light text-cream text-[clamp(1.8rem,3.5vw,3rem)] leading-tight mb-6">
                  We come to you.
                </h3>
                <p className="font-body text-sm text-cream/70 leading-relaxed max-w-sm">
                  A creative director comes to your location. Half a day. We capture everything — you just show up.
                </p>
              </div>
              <div className="relative z-10 mt-10">
                <Link
                  href="/book"
                  className="font-body text-xs tracking-[0.22em] uppercase text-cream/60 hover:text-cream transition-colors duration-300"
                >
                  Book Your Shoot &rarr;
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 6. Who it's for ───────────────────────────────────────────── */}
      <section className="bg-cream py-40 sm:py-56 px-8 sm:px-12">
        <div className="max-w-5xl mx-auto">

          <FadeUp>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-14">
              Who it&apos;s for
            </p>
          </FadeUp>

          {/* Portrait row */}
          <FadeUp delay={0.05} className="mb-12">
            <div className="flex -space-x-3">
              {PORTRAITS.map((portrait, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={portrait.src}
                  alt={portrait.alt}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cream"
                />
              ))}
            </div>
          </FadeUp>

          <Reveal>
            <h2 className="font-display font-light text-dark text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] mb-20">
              Built for the moment before the meeting.
            </h2>
          </Reveal>

          <div className="border-t border-dark/10">
            {WHO.map((item, i) => (
              <motion.div
                key={item}
                className="flex items-baseline gap-8 py-6 border-b border-dark/10"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.7, ease: EASE }}
              >
                <span className="font-display font-light text-dark/20 text-lg leading-none shrink-0 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-body text-base text-dark/65 leading-relaxed">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Pricing ────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-dark py-40 sm:py-56 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto">

          <FadeUp>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/20 mb-20">
              Pricing
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-8 lg:gap-12">
            {PRICING.map((tier, i) => (
              <FadeUp key={tier.name} delay={i * 0.1}>
                <div className={`pt-8 border-t-2 ${tier.borderClass} mt-12 sm:mt-0`}>
                  {/* Popular label */}
                  {tier.popular ? (
                    <p className="font-body text-[9px] tracking-[0.3em] uppercase text-ember mb-4">
                      Most popular
                    </p>
                  ) : (
                    <div className="h-[1.375rem] mb-4" />
                  )}

                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-cream/30 mb-3">
                    {tier.name}
                  </p>

                  <div className="overflow-hidden mb-8">
                    <motion.p
                      className="font-display font-light text-cream leading-none text-[clamp(2.2rem,4vw,4.5rem)]"
                      initial={{ y: "105%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 1, ease: EASE }}
                    >
                      {tier.price}
                    </motion.p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <span className="w-1 h-1 bg-ember block shrink-0 mt-2" />
                        <p className="font-body text-sm text-cream/45 leading-relaxed">{f}</p>
                      </div>
                    ))}
                  </div>

                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-cream/20 leading-relaxed">
                    Best for: {tier.bestFor}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.1} className="mt-20 pt-12 border-t border-white/[0.06]">
            <p className="font-body text-sm text-cream/25">
              Additional NFC cards $25 each &middot; Travel beyond 50 miles of Lusby, MD — contact for quote
            </p>
          </FadeUp>

          <FadeUp delay={0.15} className="mt-10">
            <Link
              href="/book"
              className="font-body text-xs tracking-[0.22em] uppercase text-cream/50 hover:text-ember transition-colors duration-300"
            >
              Book your profile &rarr;
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── 7b. Use Cases ─────────────────────────────────────────────── */}
      <section className="bg-cream py-24 sm:py-40 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto">

          <FadeUp>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-16">
              Who each tier is for
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 sm:gap-x-8 lg:gap-x-12 gap-y-16">
            {PRICING.map((tier, i) => (
              <FadeUp key={tier.name} delay={i * 0.1}>
                <div className={`pt-8 border-t-2 ${tier.borderClass}`}>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-dark/30 mb-1">
                    {tier.name}
                  </p>
                  <p className="font-display font-light text-dark text-2xl mb-8">
                    {tier.price}
                  </p>

                  <div className="space-y-6">
                    {tier.useCases.map((uc, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: i * 0.06 + j * 0.05, duration: 0.6, ease: EASE }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-base leading-none shrink-0 mt-0.5">{uc.emoji}</span>
                          <div>
                            <p className="font-body text-sm text-dark font-medium leading-snug mb-1">
                              {uc.title}
                            </p>
                            <p className="font-body text-xs text-dark/45 leading-relaxed italic">
                              &ldquo;{uc.desc}&rdquo;
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7c. Testimonials ──────────────────────────────────────────── */}
      <section className="bg-dark py-40 sm:py-56 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto">

          <FadeUp>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/20 mb-20">
              What our clients say
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 sm:gap-12 lg:gap-16 mb-20">
            {testimonials.slice(0, 3).map((t, i) => (
              <FadeUp key={t.id} delay={i * 0.1}>
                <div className="pt-8 border-t border-white/[0.08] md:border-t-0 mt-12 md:mt-0 md:pt-0">
                  <div className="w-6 h-px bg-ember mb-8" />
                  <blockquote className="font-display font-light text-cream italic leading-[1.55] text-[clamp(1.05rem,1.8vw,1.3rem)] mb-8">
                    &ldquo;{t.body}&rdquo;
                  </blockquote>
                  <p className="font-body text-xs tracking-[0.18em] uppercase text-cream/35">
                    {t.name}
                  </p>
                  {t.role && (
                    <p className="font-body text-xs text-cream/20 mt-1">{t.role}</p>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.15}>
            <Link
              href="/testimonials/submit"
              className="font-body text-xs tracking-[0.22em] uppercase text-cream/30 hover:text-ember transition-colors duration-300"
            >
              Worked with us? Share your experience &rarr;
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── 8. FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-cream py-40 sm:py-56 px-8 sm:px-12">
        <div className="max-w-3xl mx-auto">

          <FadeUp>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-16">
              FAQ
            </p>
          </FadeUp>

          <div className="border-t border-dark/10">
            {FAQS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Book now ───────────────────────────────────────────────── */}
      <section className="bg-dark py-40 sm:py-56 px-8 sm:px-12">
        <div className="max-w-5xl mx-auto">

          <Reveal>
            <h2 className="font-display font-light text-cream text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.95] tracking-tight mb-10">
              Ready to own your first impression?
            </h2>
          </Reveal>

          <FadeUp delay={0.15} className="max-w-lg mb-14">
            <p className="font-body text-base text-cream/40 leading-relaxed">
              One session. One film. One profile that works for you every time someone looks you up.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <Link
              href="/book"
              className="font-body text-xs tracking-[0.22em] uppercase text-ember hover:text-ember/70 transition-colors duration-300"
            >
              Book Your Profile &rarr;
            </Link>
            <p className="font-body text-[10px] tracking-[0.18em] uppercase text-cream/20">
              Questions?&ensp;
              <a
                href="mailto:hello@urprofile.co"
                className="hover:text-cream/40 transition-colors duration-300"
              >
                hello@urprofile.co
              </a>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-dark border-t border-white/[0.05] py-10 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-display text-lg text-cream/25 tracking-wide">
            UrProfile
          </p>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/15">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}
