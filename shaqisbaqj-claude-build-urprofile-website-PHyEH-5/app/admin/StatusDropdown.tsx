"use client";

import { useState } from "react";

const STATUSES = [
  { value: "order-received",  label: "Order Received" },
  { value: "shoot-scheduled", label: "Shoot Scheduled" },
  { value: "shoot-complete",  label: "Shoot Complete" },
  { value: "in-editing",      label: "In Editing" },
  { value: "review-ready",    label: "Review Ready" },
  { value: "live",            label: "Live" },
  { value: "nfc-shipped",     label: "NFC Shipped" },
];

export default function StatusDropdown({
  profileId,
  current,
  secret,
}: {
  profileId: string;
  current: string;
  secret: string;
}) {
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setValue(newStatus);
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, status: newStatus, secret }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={handleChange}
        disabled={saving}
        className="font-body text-[10px] tracking-[0.15em] uppercase bg-dark/[0.04] border border-dark/10 text-dark/70 px-2 py-1 outline-none focus:border-ember disabled:opacity-40"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {saving && (
        <span className="font-body text-[9px] tracking-[0.2em] uppercase text-cream/30">
          Saving…
        </span>
      )}
      {saved && (
        <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ember">
          Saved
        </span>
      )}
    </div>
  );
}
