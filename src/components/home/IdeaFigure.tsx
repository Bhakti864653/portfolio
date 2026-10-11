"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { useMediaQuery, useMotion } from "@/lib/prefs";
import { projectByVerb, VERB_ORDER, type Verb } from "@/lib/projects";
import { useAbility } from "../verbs/ability";
import { LineFilter } from "./LineFilter";

/** The figure's own units: Human Judgment sits at 0,0 and the paths reach out about 230 units. */
export const VIEW = { x: -260, y: -300, w: 520, h: 600 };

/**
 * Where the long line from the left arrives: it crests up and to the left of the center, then
 * drops into it from above (the Entrance draws that line; it ends under the center ring).
 */
export const LEAD = { crest: [-81, -85], end: [-3, -11] } as const;

/** A path as numbers: its start, then cubic segments of [c1x, c1y, c2x, c2y, x, y]. */
type Curve = { start: [number, number]; segs: number[][] };

type Path = {
  curve: Curve;
  node: [number, number];
  /** Gradient stops from the outer node in to the center. */
  stops: string[];
  /** The label beside the node, as a position in the figure box and an alignment. */
  label: { x: number; y: number; align: "center" | "start" | "end" };
};

// Connect bends up into the center from the lower left; Act runs down to join it, as it does in
// the drawing this is based on.
const PATHS: Record<Verb, Path> = {
  decide: {
    curve: {
      start: [-6, -228],
      segs: [
        [60, -205, 108, -120, 92, -62],
        [80, -25, 40, -8, 8, -3],
      ],
    },
    node: [-6, -228],
    stops: ["#d6502f", "#c8452f", "#4f63e0"],
    label: { x: -6, y: -262, align: "center" },
  },
  // Learn comes up into the center from below, through the gap in the "Human judgment" label.
  learn: {
    curve: {
      start: [176, 5],
      segs: [
        [160, 60, 120, 90, 76, 88],
        [34, 86, 6, 64, 5, 10],
      ],
    },
    node: [176, 5],
    stops: ["#3d6ff2", "#2f5fe0", "#2b55d0"],
    label: { x: 190, y: 1, align: "start" },
  },
  connect: {
    curve: {
      start: [0, 222],
      segs: [
        [-45, 190, -95, 140, -95, 75],
        [-95, 25, -50, -2, -9, 0],
      ],
    },
    node: [0, 222],
    stops: ["#7d4fd8", "#5b5fe6", "#1f8fb0"],
    label: { x: 0, y: 262, align: "center" },
  },
  act: {
    curve: { start: [-168, 33], segs: [[-140, 70, -100, 110, -70, 153]] },
    node: [-168, 33],
    stops: ["#1f9a8a", "#22a196", "#3f86c8"],
    label: { x: -184, y: 29, align: "end" },
  },
};

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * The path's `d`, with each control point pulled toward (px, py) by up to `reach` units the
 * closer it is: the path seems to bend toward the cursor. The ends never move, so every path
 * still meets the center.
 */
function toD({ start, segs }: Curve, px = 0, py = 0, reach = 0): string {
  const bend = (x: number, y: number): [number, number] => {
    if (!reach) return [x, y];
    const dx = px - x;
    const dy = py - y;
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.max(0, 1 - d / 170) * reach;
    return [x + (dx / d) * k, y + (dy / d) * k];
  };
  return (
    `M${start[0]} ${start[1]}` +
    segs
      .map(([a, b, c, d, x, y]) => {
        const [ax, ay] = bend(a, b);
        const [cx, cy] = bend(c, d);
        return `C${r1(ax)} ${r1(ay)} ${r1(cx)} ${r1(cy)} ${x} ${y}`;
      })
      .join("")
  );
}

/** How close (0 to 1) the point is to any of the path's points. */
function nearness({ start, segs }: Curve, px: number, py: number): number {
  const pts = [
    start,
    ...segs.flatMap((s) => [
      [s[0], s[1]],
      [s[2], s[3]],
      [s[4], s[5]],
    ]),
  ];
  const d = Math.min(...pts.map(([x, y]) => Math.hypot(px - x, py - y)));
  return Math.max(0, 1 - d / 130);
}

const pct = (n: number, from: number, span: number) =>
  `${(((n - from) / span) * 100).toFixed(3)}%`;

const ALIGN = {
  center: "-translate-x-1/2 -translate-y-1/2",
  start: "-translate-y-1/2",
  end: "-translate-x-full -translate-y-1/2",
};

/**
 * The idea, drawn: four paths, one per ability, each in its project's color, all meeting at one
 * center, Human Judgment. The labels are real links; pointing at one (or tapping it on a phone)
 * brings its path forward, names the project at the center, and floats in its preview.
 *
 * `paths` controls the strokes only: "pending" hides them until the screen is in view, "alive"
 * draws them in, one after another, growing outward from Human Judgment. The labels, nodes, and
 * center are always visible. On a desktop with full motion, the paths also bend a little and
 * glow as the cursor comes near them.
 */
export function IdeaFigure({
  paths,
  svgRef,
  delay = 0,
}: {
  paths?: "pending" | "alive";
  /** Receives the drawing itself, e.g. so the Entrance can measure where to aim its line. */
  svgRef?: (el: SVGSVGElement | null) => void;
  /** How long the paths wait before drawing in, in ms (e.g. for the long line to arrive first). */
  delay?: number;
}) {
  const { active, setActive, release } = useAbility();
  const filter = useId();
  const project = active ? projectByVerb(active) : null;
  const motion = useMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const box = useRef<SVGSVGElement | null>(null);
  const strokes = useRef<Partial<Record<Verb, SVGPathElement | null>>>({});
  const glows = useRef<Partial<Record<Verb, SVGPathElement | null>>>({});
  const pointer = useRef<string>("mouse");
  /** When the last touch or pen press began, so the focus it causes can be told apart. */
  const pressedAt = useRef(0);

  // The cursor's pull: bend and glow by proximity, in the figure's own units.
  useEffect(() => {
    const svg = box.current;
    if (!svg || motion !== "full" || !finePointer) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const draw = (px?: number, py?: number) => {
      for (const verb of VERB_ORDER) {
        const curve = PATHS[verb].curve;
        const d = px === undefined ? toD(curve) : toD(curve, px, py, 16);
        strokes.current[verb]?.setAttribute("d", d);
        const glow = glows.current[verb];
        if (glow) {
          glow.setAttribute("d", d);
          glow.style.setProperty(
            "--near",
            px === undefined ? "0" : nearness(curve, px, py!).toFixed(3),
          );
        }
      }
    };
    const update = () => {
      frame = 0;
      const ctm = svg.getScreenCTM();
      if (!last || !ctm) return;
      const pt = new DOMPoint(last.clientX, last.clientY).matrixTransform(
        ctm.inverse(),
      );
      draw(pt.x, pt.y);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      draw();
    };
    const area = svg.closest("figure") ?? svg;
    area.addEventListener("pointermove", onMove as EventListener);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove as EventListener);
      area.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [motion, finePointer]);

  function blur(e: FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) release();
  }

  /** On a touchscreen the first tap previews the project; a second tap opens it. */
  function choose(e: MouseEvent<HTMLAnchorElement>, verb: Verb) {
    if (pointer.current !== "mouse" && active !== verb) {
      e.preventDefault();
      setActive(verb);
    }
  }

  return (
    <figure
      aria-labelledby="idea-figure-caption"
      className="idea-figure relative @container"
      data-paths={paths}
      data-active={active ?? undefined}
      onBlur={blur}
      onMouseLeave={release}
    >
      <figcaption id="idea-figure-caption" className="sr-only">
        Four paths, one for each ability (decide, learn, connect, and act), all
        meeting at one center: human judgment. Each ability links to the project
        built for it.
      </figcaption>

      <svg
        ref={(el) => {
          box.current = el;
          svgRef?.(el);
        }}
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        className="block h-auto w-full overflow-visible"
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <LineFilter
            id={filter}
            region={[VIEW.x, VIEW.y, VIEW.w, VIEW.h]}
            blur={3.2}
          />
          {VERB_ORDER.map((verb) => {
            const p = PATHS[verb];
            return (
              <linearGradient
                key={verb}
                id={`${filter}-${verb}`}
                gradientUnits="userSpaceOnUse"
                x1={p.node[0]}
                y1={p.node[1]}
                x2={0}
                y2={0}
              >
                {p.stops.map((c, i) => (
                  <stop
                    key={c}
                    offset={i / (p.stops.length - 1)}
                    stopColor={c}
                  />
                ))}
              </linearGradient>
            );
          })}
        </defs>

        {/* A soft halo under each path: it brightens near the cursor and on the chosen path */}
        <g className="path-glows">
          {VERB_ORDER.map((verb) => (
            <path
              key={verb}
              ref={(el) => {
                glows.current[verb] = el;
              }}
              d={toD(PATHS[verb].curve)}
              stroke={`url(#${filter}-${verb})`}
              strokeWidth={14}
              strokeLinecap="round"
              className="path-glow"
              data-on={active === verb || undefined}
            />
          ))}
        </g>

        <g filter={`url(#${filter})`}>
          {VERB_ORDER.map((verb, i) => {
            const on = active === verb;
            return (
              <path
                key={verb}
                ref={(el) => {
                  strokes.current[verb] = el;
                }}
                d={toD(PATHS[verb].curve)}
                pathLength={1}
                stroke={`url(#${filter}-${verb})`}
                strokeWidth={on ? 3.8 : 2.4}
                strokeLinecap="round"
                className="draw-out"
                opacity={active && !on ? 0.25 : 1}
                style={
                  {
                    "--delay": `${delay + i * 320}ms`,
                    transition: "opacity 400ms, stroke-width 400ms",
                  } as CSSProperties
                }
              />
            );
          })}
        </g>

        {/* The ends of each path, and the center they all meet at */}
        {VERB_ORDER.map((verb) => (
          <circle
            key={verb}
            cx={PATHS[verb].node[0]}
            cy={PATHS[verb].node[1]}
            r={active === verb ? 7 : 5}
            fill="var(--paper)"
            stroke={PATHS[verb].stops[0]}
            strokeWidth={1.8}
            className="path-node"
          />
        ))}
        <circle
          r={9.5}
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth={2.2}
          className="judgment-core"
        />
      </svg>

      {/* Set in two parts either side of x = 5, where the Learn path rises between the words */}
      <p
        aria-hidden="true"
        className="annot pointer-events-none absolute -translate-x-full whitespace-nowrap text-[max(0.6rem,2.3cqw)] tracking-[0.18em] text-ink"
        style={{ left: pct(-6, VIEW.x, VIEW.w), top: pct(36, VIEW.y, VIEW.h) }}
      >
        Human
      </p>
      <p
        aria-hidden="true"
        className="annot pointer-events-none absolute whitespace-nowrap text-[max(0.6rem,2.3cqw)] tracking-[0.18em] text-ink"
        style={{ left: pct(16, VIEW.x, VIEW.w), top: pct(36, VIEW.y, VIEW.h) }}
      >
        Judgment
        <span
          className={`block transition-opacity duration-300 ${project ? `accent-${project.slug} text-a1 opacity-100` : "opacity-0"}`}
        >
          {project ? `→ ${project.name}` : " "}
        </span>
      </p>

      <ul aria-label="Paths to each project">
        {VERB_ORDER.map((verb) => {
          const p = projectByVerb(verb);
          const { label } = PATHS[verb];
          return (
            <li
              key={verb}
              className={`absolute ${ALIGN[label.align]}`}
              style={{
                left: pct(label.x, VIEW.x, VIEW.w),
                top: pct(label.y, VIEW.y, VIEW.h),
              }}
            >
              <Link
                href={`/work/${p.slug}`}
                data-cursor="View"
                onPointerDown={(e) => {
                  pointer.current = e.pointerType;
                  if (e.pointerType !== "mouse")
                    pressedAt.current = e.timeStamp;
                }}
                onClick={(e) => choose(e, verb)}
                // A tap also fires mouseenter just before its click; only real mice hover.
                onMouseEnter={() => {
                  if (pointer.current === "mouse") setActive(verb);
                }}
                // A tap focuses the link just before its click; only keyboard focus previews here,
                // so the tap itself can decide between previewing and opening.
                onFocus={(e) => {
                  if (e.timeStamp - pressedAt.current > 600) setActive(verb);
                }}
                className={`accent-${p.slug} path-label block px-1 py-1 font-display text-[max(1.15rem,5.4cqw)] capitalize leading-none transition-colors ${active === verb ? "text-a1" : "text-ink"}`}
              >
                {verb}
                <span className="sr-only">
                  : {p.name}. {p.badge}.
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
