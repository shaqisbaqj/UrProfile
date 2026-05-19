"use client";

import { useState, useRef } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

interface BookingFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export default function BookingForm({ action }: BookingFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await action(formData);
      if (result.success) {
        setState("success");
        formRef.current?.reset();
      } else {
        setState("error");
        setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-ember/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-ember"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-display text-4xl font-light text-dark mb-4">
          You&apos;re on the list.
        </h3>
        <p className="font-body text-dark/60 text-lg max-w-sm mx-auto">
          We&apos;ll be in touch within 24 hours to get things rolling.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent border border-linen/60 text-dark font-body text-base px-5 py-4 outline-none focus:border-ember transition-colors duration-200 placeholder:text-dark/30";
  const labelClass = "block font-body text-xs tracking-widest uppercase text-dark/50 mb-2";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="industry" className={labelClass}>
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            placeholder="e.g. Tech, Finance, Creative"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Anything else we should know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us a bit about yourself or what you're looking to communicate."
          className={`${inputClass} resize-none`}
        />
      </div>

      {state === "error" && (
        <p className="font-body text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-block w-full sm:w-auto bg-dark text-cream font-body text-sm font-medium tracking-widest uppercase px-14 py-5 transition-all duration-300 hover:bg-ember disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "Sending..." : "Request Your Profile"}
      </button>
    </form>
  );
}
