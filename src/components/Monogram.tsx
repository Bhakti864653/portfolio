import type { CSSProperties } from "react";
import type { Verb } from "@/lib/projects";

/**
 * The BA monogram. One horizontal stroke is shared by both letters: it is the B's waist and,
 * continuing right, the A's crossbar. Where it crosses the A's left leg sits the junction
 * (43, 32), the same "human judgment" point the four paths run through.
 *
 * - decide: B's upper spine and bowl
 * - learn: B's lower spine and bowl
 * - connect: the shared stroke
 * - act: the A
 */
export const MONOGRAM_PATHS: Record<Verb, string> = {
  decide: "M12 32V8h8a12 12 0 0 1 0 24",
  learn: "M12 32v24h9a12 12 0 0 0 0-24",
  connect: "M12 32h45",
  act: "M36 56 50 8l14 48",
};

export const MONOGRAM_ORDER: Verb[] = ["decide", "learn", "connect", "act"];
export const MONOGRAM_JUNCTION = { x: 43, y: 32 };

/** Approximate path lengths, for the draw-in animation. */
const LENGTHS: Record<Verb, number> = {
  decide: 72,
  learn: 88,
  connect: 45,
  act: 102,
};

export function Monogram({
  className,
  title = "Bhakti Ahir",
  active,
  strokeWidth = 3.6,
  draw = false,
}: {
  className?: string;
  title?: string | null;
  /** Highlights one stroke in the current accent color. */
  active?: Verb | null;
  strokeWidth?: number;
  /** Draws the strokes in one after another (disabled under reduced motion by CSS). */
  draw?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 76 64"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {MONOGRAM_ORDER.map((verb, i) => (
        <path
          key={verb}
          d={MONOGRAM_PATHS[verb]}
          stroke={active === verb ? "var(--a1)" : "currentColor"}
          strokeWidth={strokeWidth}
          opacity={active && active !== verb ? 0.35 : 1}
          className={draw ? "enter-draw" : undefined}
          style={
            {
              transition: "opacity 300ms, stroke 300ms",
              ...(draw && {
                "--len": LENGTHS[verb],
                "--delay": `${i * 180}ms`,
              }),
            } as CSSProperties
          }
        />
      ))}
      <circle
        cx={MONOGRAM_JUNCTION.x}
        cy={MONOGRAM_JUNCTION.y}
        r={strokeWidth * 0.9}
        fill="var(--paper)"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.6}
        className={draw ? "enter-fade" : undefined}
        style={draw ? ({ "--delay": "760ms" } as CSSProperties) : undefined}
      />
    </svg>
  );
}
