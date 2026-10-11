"use client";

import { useEffect, useState } from "react";

/** Copies my email address, then confirms with a small pop ("Copied!") or explains the failure. */
export function CopyEmail({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2400);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-magnetic
      data-copied={status === "copied" || undefined}
      className={`copy-email ${className ?? ""}`}
    >
      <span aria-live="polite" key={status} className="copy-label">
        {status === "copied"
          ? "Copied!"
          : status === "failed"
            ? "Couldn’t copy. Select it above."
            : "Copy email"}
      </span>
    </button>
  );
}
