"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="shell py-28">
      <p className="annot">Something went wrong</p>
      <h1 className="mt-3 font-display text-[clamp(2.6rem,7vw,5rem)] leading-none">
        This page didn’t load properly.
      </h1>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="annot inline-flex h-11 items-center rounded-full bg-ink px-6 text-paper"
        >
          Try again
        </button>
        <Link
          href="/"
          className="annot inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-ink"
        >
          Go to the homepage
        </Link>
      </div>
    </section>
  );
}
