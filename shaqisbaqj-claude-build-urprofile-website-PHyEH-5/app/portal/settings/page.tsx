"use client";

import { useState, useEffect } from "react";
import PortalNav from "@/components/PortalNav";
import { getSupabaseClient } from "@/lib/supabase";

export default function SettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    }
    loadUser();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Authentication is not configured.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: form.newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setLoading(false);
  }

  const inputClass =
    "w-full bg-transparent border border-dark/15 focus:border-ember outline-none px-5 py-4 font-body text-sm text-dark placeholder:text-dark/25 transition-colors duration-200";
  const labelClass =
    "font-body text-[10px] tracking-[0.25em] uppercase text-dark/35 mb-2 block";

  return (
    <>
      <PortalNav />
      <main className="bg-cream min-h-screen pt-28 pb-28 px-8 sm:px-12">
        <div className="max-w-xl mx-auto">
          {/* Page header */}
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-6">
            Settings
          </p>
          <h1 className="font-display font-light text-dark text-[clamp(2.5rem,5vw,3.5rem)] leading-none mb-16">
            Account settings.
          </h1>

          {/* Change password section */}
          <div className="mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-8">
              Change password
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current password */}
              <div>
                <label htmlFor="currentPassword" className={labelClass}>
                  Current password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              {/* New password */}
              <div>
                <label htmlFor="newPassword" className={labelClass}>
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              {/* Confirm new password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              {/* Success message */}
              {success && (
                <div className="bg-ember/20 px-5 py-4">
                  <p className="font-body text-sm text-dark/70">
                    Password updated successfully.
                  </p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <p className="font-body text-sm text-ember">{error}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-dark text-cream px-10 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-ember disabled:opacity-40 transition-colors duration-300"
              >
                {loading ? "Updating…" : "Update Password →"}
              </button>
            </form>
          </div>

          {/* Account info section */}
          <div className="border-t border-dark/10 pt-12">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-6">
              Account
            </p>

            {userEmail ? (
              <p className="font-body text-sm text-dark/50">{userEmail}</p>
            ) : (
              <p className="font-body text-sm text-dark/25">Loading…</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
