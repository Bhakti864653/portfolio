"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades its content in the first time it scrolls into view. Content is fully visible without
 * JavaScript and under reduced motion; only content still below the fold is ever hidden.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.dataset.motion === "reduce") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
