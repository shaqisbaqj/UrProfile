"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import ContractModal from "@/components/ContractModal";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
}

export default function BookPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>({
    name: "", email: "", phone: "", industry: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [showContract, setShowContract] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const e: Partial<FormValues> = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setShowContract(true);
  }

  async function handleSign({ name, timestamp }: { name: string; timestamp: string }) {
    setShowContract(false);
    setLoading(true);
    console.log("Contract signed:", { name, timestamp });

    try {
      const origin = window.location.origin;
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          successUrl: `${origin}/book/success`,
          cancelUrl: `${origin}/book`,
        }),
      });

      const { url } = await res.json();
      if (url) {
        router.push(url);
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border border-dark/15 focus:border-ember outline-none px-5 py-4 font-body text-sm text-dark placeholder:text-dark/25 transition-colors duration-200";
  const labelClass =
    "block font-body text-[10px] tracking-[0.25em] uppercase text-dark/35 mb-2";

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-cream pt-28 pb-28 px-8 sm:px-12">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-8">
            The First Impression — $500
          </p>
          <h1 className="font-display font-light text-dark text-[clamp(2.8rem,6vw,5rem)] leading-tight mb-16">
            Let&apos;s make
            <br />
            <em className="text-ember not-italic">your profile.</em>
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={labelClass}>Full Name</label>
                <input
                  id="name" name="name" type="text" required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="font-body text-xs text-ember mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email" name="email" type="email" required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
                {errors.email && (
                  <p className="font-body text-xs text-ember mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="industry" className={labelClass}>Industry</label>
                <input
                  id="industry" name="industry" type="text"
                  placeholder="e.g. Real estate, Consulting"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Anything we should know?
              </label>
              <textarea
                id="message" name="message" rows={4}
                placeholder="Tell us about yourself or what you're looking to communicate."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Location note */}
            <div className="border-l-2 border-ember/40 pl-4">
              <p className="font-body text-xs text-dark/35 leading-relaxed">
                We come to you within 50 miles of Lusby, MD.
                Travel beyond 50 miles available — contact us for a quote.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-14 py-5 bg-dark text-cream font-body text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:bg-ember disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting…" : "Review & Sign Agreement →"}
            </button>
          </form>

          {/* What happens next */}
          <div className="mt-24 pt-12 border-t border-dark/8">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-10">
              What happens next
            </p>
            <div className="space-y-8">
              {[
                { n: "01", text: "We review your booking and reach out within 24 hours." },
                { n: "02", text: "A brief call to align on your story and location." },
                { n: "03", text: "Shoot scheduled — usually within 2 weeks." },
                { n: "04", text: "Profile live within 5–7 business days of your shoot." },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-start gap-6">
                  <span className="font-display text-xl font-light text-ember/30 shrink-0 w-8 pt-0.5">
                    {n}
                  </span>
                  <p className="font-body text-sm text-dark/50 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-8 sm:px-12 bg-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-display text-lg text-cream/25 tracking-wide">UrProfile</p>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/15">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Contract modal */}
      <ContractModal
        isOpen={showContract}
        onClose={() => setShowContract(false)}
        onSign={handleSign}
        tier="The First Impression"
        price="$500"
      />
    </>
  );
}
