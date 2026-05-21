"use client";

import { useState } from "react";

export default function ApproveButton({ id, secret }: { id: string; secret: string }) {
  const [status, setStatus] = useState<"idle" | "approving" | "done">("idle");

  async function approve() {
    setStatus("approving");
    await fetch(`/api/admin/testimonials/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ember shrink-0">
        Approved
      </span>
    );
  }

  return (
    <button
      onClick={approve}
      disabled={status === "approving"}
      className="font-body text-[9px] tracking-[0.2em] uppercase text-ember/50 hover:text-ember disabled:text-cream/20 transition-colors shrink-0"
    >
      {status === "approving" ? "Approving…" : "Approve →"}
    </button>
  );
}
