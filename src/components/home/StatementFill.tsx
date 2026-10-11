import type { CSSProperties } from "react";

const TEXT =
  "I learn by building real systems for real problems, then putting them online where anyone can try them.";

/**
 * A large statement whose words fill with color, one after another, as it scrolls through the
 * screen (CSS scroll-driven animation, so no JavaScript runs on scroll). Browsers without that
 * feature, and reduced motion, simply show it fully colored.
 */
export function StatementFill() {
  const words = TEXT.split(" ");
  return (
    <section
      aria-label="What I do"
      className="fill-section below-fold py-24 sm:py-36"
    >
      <div className="shell">
        <p className="annot mb-8 text-ink">How I work</p>
        <p className="fill-text font-display text-[clamp(2.4rem,6.4vw,6rem)] leading-[1.02] tracking-[-0.015em]">
          {words.map((w, i) => (
            <span
              key={i}
              className="fill-word"
              style={{ "--w": i / words.length } as CSSProperties}
            >
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
