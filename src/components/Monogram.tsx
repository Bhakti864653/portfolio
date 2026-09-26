import type { Verb } from "@/lib/projects";

/**
 * The BA monogram: four strokes that all meet at one point (32, 32).
 * - decide: B's spine and upper bowl, closing into the point
 * - learn: B's lower bowl, rising into the point
 * - connect: the crossbar, reaching from the point across to A's leg
 * - act: A itself, standing on the ground
 */
export const MONOGRAM_PATHS: Record<Verb, string> = {
  decide: "M12 32V10h9.5c6.5 0 10 3.6 10 9 0 5.6-3.6 9.6.5 13",
  learn: "M12 32v22h10.5c6.9 0 10.5-4 10.5-9.6 0-6.4-4.6-9.6-1-12.4",
  connect: "M32 32h19",
  act: "M34.5 54 45.5 10 56.5 54",
};

export const MONOGRAM_ORDER: Verb[] = ["decide", "learn", "connect", "act"];

export function Monogram({
  className,
  title = "Bhakti Ahir",
  active,
  strokeWidth = 3.4,
}: {
  className?: string;
  title?: string | null;
  /** Highlights one stroke in the current accent color. */
  active?: Verb | null;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 68 64"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {MONOGRAM_ORDER.map((verb) => (
        <path
          key={verb}
          d={MONOGRAM_PATHS[verb]}
          stroke={active === verb ? "var(--a1)" : "currentColor"}
          strokeWidth={strokeWidth}
          opacity={active && active !== verb ? 0.35 : 1}
          style={{ transition: "opacity 300ms, stroke 300ms" }}
        />
      ))}
      <circle
        cx="32"
        cy="32"
        r={strokeWidth * 0.95}
        fill="var(--paper)"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.6}
      />
    </svg>
  );
}
