import {
  MONOGRAM_A,
  MONOGRAM_B,
  MONOGRAM_SWASH,
  MONOGRAM_VIEWBOX,
} from "@/lib/monogram";

/**
 * The BA mark. Filled outlines (never a thin line), so it holds from favicon size to the hero.
 * The curve is cut free from the A by a gap in the background color. With `sweep`, the curve
 * sweeps in once on arrival; the letters themselves are always visible.
 */
export function Monogram({
  className,
  title = "Bhakti Ahir",
  sweep = false,
  gap = "var(--paper)",
}: {
  className?: string;
  /** Accessible name; pass null when a visible name sits beside the mark. */
  title?: string | null;
  sweep?: boolean;
  /** The color behind the mark, used for the gap where the curve crosses the A. */
  gap?: string;
}) {
  return (
    <svg
      viewBox={MONOGRAM_VIEWBOX}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
    >
      <path d={MONOGRAM_B} />
      <path d={MONOGRAM_A} />
      <path
        d={MONOGRAM_SWASH}
        stroke={gap}
        strokeWidth={26}
        strokeLinejoin="round"
        paintOrder="stroke"
        className={sweep ? "mark-sweep" : undefined}
      />
    </svg>
  );
}
