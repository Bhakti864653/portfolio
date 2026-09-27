import type { CSSProperties } from "react";
import type { Verb } from "@/lib/projects";

/**
 * The BA monogram. The B's waist doesn't stop at the B: it runs on across the gap and becomes the
 * A's crossbar, so the two letters are joined by one path. Where that path meets the A's left leg
 * sits the junction (47.8, 31), the same "human judgment" point the four project paths run
 * through. The bowls stop short of the A, so no strokes overlap and the silhouette stays clean
 * down to 16px.
 *
 * - decide: B's upper spine and bowl
 * - learn: B's lower spine and bowl
 * - connect: the shared stroke
 * - act: the A
 */
export const MONOGRAM_PATHS: Record<Verb, string> = {
  decide: "M10 31V8h9a11.5 11.5 0 0 1 0 23",
  learn: "M10 31v25h10a12.5 12.5 0 0 0 0-25",
  connect: "M10 31h50.2",
  act: "M41 56 54 8l13 48",
};

export const MONOGRAM_ORDER: Verb[] = ["decide", "learn", "connect", "act"];
export const MONOGRAM_JUNCTION = { x: 47.8, y: 31 };
export const MONOGRAM_VIEWBOX = "0 0 76 64";

/** Approximate path lengths, for the draw-in animation. */
const LENGTHS: Record<Verb, number> = {
  decide: 68,
  learn: 74,
  connect: 51,
  act: 100,
};

export function Monogram({
  className,
  title = "Bhakti Ahir",
  active,
  strokeWidth = 3.6,
  draw = false,
  junction = true,
}: {
  className?: string;
  title?: string | null;
  /** Highlights one stroke in the current accent color. */
  active?: Verb | null;
  strokeWidth?: number;
  /** Draws the strokes in one after another (disabled under reduced motion by CSS). */
  draw?: boolean;
  /** The junction dot; dropped at favicon-like sizes where it would fill in. */
  junction?: boolean;
}) {
  return (
    <svg
      viewBox={MONOGRAM_VIEWBOX}
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
      {junction && (
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
      )}
    </svg>
  );
}
