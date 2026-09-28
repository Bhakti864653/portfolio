"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PROJECTS } from "@/lib/projects";

/**
 * The thread: one SVG layer behind a section's content that runs a line through the section's
 * real layout. Elements inside the section mark where the line goes with `data-thread="<key>"`;
 * this measures them (again on every resize and once fonts load) and draws curves between them,
 * so the line always meets the type exactly, at any width.
 *
 * Purely decorative (aria-hidden). The section's content never depends on it, and it renders
 * nothing until it has measured, so there is no layout shift and nothing waits for it.
 */

type Box = { x: number; y: number; w: number; h: number };
type Anchors = Record<string, Box>;
type Strand = {
  d: string;
  /** Project slug for a colored strand; omitted for the ink thread. */
  slug?: string;
  /** "draw": once on arrival; "scroll": as the visitor reads (where supported). */
  mode: "draw" | "scroll";
  delay?: number;
};

export type ThreadVariant = "hero" | "questions" | "sequence" | "contact";

const SLUGS = PROJECTS.map((p) => p.slug);
/**
 * Where each strand crosses a section boundary, as a fraction of its width. Chosen from the
 * question layout (Portico and Concord on the left, Synaptiq and CommonGround on the right), so
 * the strands run in the margins and the gutter and never cross each other or another project.
 */
const LANE: Record<string, number> = {
  portico: 0.045,
  concord: 0.1,
  synaptiq: 0.52,
  commonground: 0.965,
};
const MOBILE = 768;

const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;
const n = (v: number) => Math.round(v * 10) / 10;
const pt = (x: number, y: number) => `${n(x)} ${n(y)}`;

/** A smooth vertical S-curve from a to b. */
const sCurve = (ax: number, ay: number, bx: number, by: number) => {
  const dy = (by - ay) * 0.5;
  return `C${pt(ax, ay + dy)} ${pt(bx, by - dy)} ${pt(bx, by)}`;
};

const BUILDERS: Record<
  ThreadVariant,
  (a: Anchors, w: number, h: number) => Strand[]
> = {
  // From the end of the name, behind the headline, out along its underline, down to the
  // bottom of the introduction, where it splits into four colored strands.
  hero(a, w, h) {
    const exit = a.exit;
    const head = a.headline;
    if (!exit || !head) return [];
    const ex = cx(exit);
    const ey = cy(exit);
    if (w < MOBILE) {
      // Phones: out of the name and down the right margin, clear of the text, then across the
      // empty space at the bottom to the left rail the four chapters share.
      const edge = w - 7;
      const split = h - 64;
      return [
        {
          d:
            `M${pt(ex, ey)}` +
            `C${pt(ex + 60, ey - 4)} ${pt(edge, ey + 6)} ${pt(edge, ey + 60)}` +
            `L${pt(edge, split - 40)}`,
          mode: "draw",
          delay: 900,
        },
        ...SLUGS.map((slug, i) => ({
          d: `M${pt(edge, split - 40)}${sCurve(edge, split - 40, 12 + i * 6, h)}`,
          slug,
          mode: "draw" as const,
          delay: 1900,
        })),
      ];
    }
    // Out of the name, around the headline's right side, back along beneath it, then down the
    // left margin to the bottom, where it splits. It never crosses the headline's letters.
    const underline = head.y + head.h + 18;
    const right = Math.min(head.x + head.w + 36, w - 40);
    const rail = Math.max(head.x - 26, 12);
    const split = { x: rail, y: h - 70 };
    return [
      {
        d:
          `M${pt(ex, ey)}` +
          `C${pt(ex + 80, ey - 6)} ${pt(right, head.y - 20)} ${pt(right, head.y + head.h * 0.45)}` +
          `C${pt(right, underline - 24)} ${pt(right - 16, underline)} ${pt(right - 48, underline)}` +
          `L${pt(head.x + 24, underline)}` +
          `C${pt(rail + 6, underline)} ${pt(rail, underline + 18)} ${pt(rail, underline + 48)}` +
          `L${pt(split.x, split.y)}`,
        mode: "draw",
        delay: 900,
      },
      ...SLUGS.map((slug, i) => ({
        d: `M${pt(split.x, split.y)}${sCurve(split.x, split.y, w * LANE[slug], h)}`,
        slug,
        mode: "draw" as const,
        delay: 2000 + i * 90,
      })),
    ];
  },

  // The four strands arrive from the introduction and each travels to its question, then runs
  // down beside it. On phones the four chapters share one vertical thread instead.
  questions(a, w) {
    if (w < MOBILE) return BUILDERS.sequence(a, w, 0);
    return SLUGS.flatMap((slug) => {
      const node = a[`n-${slug}`];
      const block = a[`q-${slug}`];
      if (!node || !block) return [];
      // Down its lane, then a late turn into the question's node, then down beside it.
      const x0 = w * LANE[slug];
      const nx = cx(node);
      const ny = cy(node);
      const turn = Math.max(ny - 160, 0);
      return [
        {
          d:
            `M${pt(x0, 0)}L${pt(x0, turn)}` +
            `C${pt(x0, ny - 50)} ${pt(nx, ny - 90)} ${pt(nx, ny)}` +
            `L${pt(nx, block.y + block.h)}`,
          slug,
          mode: "scroll" as const,
        },
      ];
    });
  },

  // One thread through the four projects in order, each stretch in its project's color.
  sequence(a, _w, h) {
    const nodes = SLUGS.map((slug) => ({ slug, box: a[`n-${slug}`] })).filter(
      (x): x is { slug: (typeof SLUGS)[number]; box: Box } => Boolean(x.box),
    );
    if (!nodes.length) return [];
    const strands: Strand[] = [];
    const first = nodes[0].box;
    strands.push({
      d: `M${pt(cx(first), 0)}L${pt(cx(first), cy(first))}`,
      slug: nodes[0].slug,
      mode: "scroll",
    });
    // Straight down the margin beside each project, turning toward the next one only in the gap
    // above it, so the line never runs through a project's words.
    nodes.forEach(({ slug, box }, i) => {
      const next = nodes[i + 1]?.box;
      const x = cx(box);
      const y = cy(box);
      let d = `M${pt(x, y)}`;
      if (next) {
        const nx = cx(next);
        const ny = cy(next);
        const turn = Math.max(ny - 150, y);
        d +=
          `L${pt(x, turn)}` +
          `C${pt(x, turn + 70)} ${pt(nx, ny - 80)} ${pt(nx, ny)}`;
      } else {
        d += `L${pt(x, h > 0 ? h : y + 200)}`;
      }
      strands.push({ d, slug, mode: "scroll" });
    });
    return strands;
  },

  // The four strands come back together and become one line under the principle.
  contact(a, w) {
    const p = a.principle;
    if (!p) return [];
    // The strands come down the left margin, side by side, and meet under the principle.
    const join = { x: Math.max(p.x - 24, 8), y: p.y + p.h + 14 };
    const strands: Strand[] = SLUGS.map((slug, i) => {
      const x = Math.max(join.x - (3 - i) * 12, 4 + i * 4);
      return {
        d: `M${pt(x, 0)}L${pt(x, join.y - 90)}${sCurve(x, join.y - 90, join.x, join.y)}`,
        slug,
        mode: "draw" as const,
        delay: 200 + i * 120,
      };
    });
    const end = p.x + Math.min(p.w, w - p.x - 24);
    strands.push({
      d:
        `M${pt(join.x, join.y)}L${pt(end - 30, join.y)}` +
        `C${pt(end - 8, join.y)} ${pt(end, join.y - 6)} ${pt(end + 4, join.y - 16)}`,
      mode: "draw",
      delay: 1100,
    });
    return strands;
  },
};

/** The same builders ThreadLayer uses, exposed for tests. */
export const buildThread = (
  variant: ThreadVariant,
  anchors: Anchors,
  w: number,
  h: number,
) => BUILDERS[variant](anchors, w, h);

export function ThreadLayer({
  variant,
  className = "",
}: {
  variant: ThreadVariant;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [geo, setGeo] = useState<{
    w: number;
    h: number;
    strands: Strand[];
  } | null>(null);

  useEffect(() => {
    const parent = svg.current?.parentElement;
    if (!parent) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = parent.getBoundingClientRect();
      const anchors: Anchors = {};
      parent.querySelectorAll<HTMLElement>("[data-thread]").forEach((el) => {
        const r = el.getBoundingClientRect();
        anchors[el.dataset.thread!] = {
          x: r.left - box.left,
          y: r.top - box.top,
          w: r.width,
          h: r.height,
        };
      });
      setGeo({
        w: box.width,
        h: box.height,
        strands: BUILDERS[variant](anchors, box.width, box.height),
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(schedule);
    observer?.observe(parent);
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    // Content that eases in (Reveal) moves its anchors without resizing anything.
    parent.addEventListener("transitionend", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
      parent.removeEventListener("transitionend", schedule);
    };
  }, [variant]);

  return (
    <svg
      ref={svg}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      viewBox={geo ? `0 0 ${n(geo.w)} ${n(geo.h)}` : undefined}
      preserveAspectRatio="none"
    >
      {geo?.strands.map((s, i) => (
        <path
          key={`${variant}-${i}-${s.slug ?? "ink"}`}
          d={s.d}
          pathLength={1}
          className={`thread ${s.slug ? `accent-${s.slug} strand-${s.slug}` : "thread-ink"} ${s.mode === "draw" ? "thread-draw" : "thread-scroll"}`}
          style={{ "--delay": `${s.delay ?? 0}ms` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
