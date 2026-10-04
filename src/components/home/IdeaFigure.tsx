"use client";

import Link from "next/link";
import { useId, type CSSProperties, type FocusEvent, type Ref } from "react";
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

type Path = {
  d: string;
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
    d: "M-6 -228C60 -205 108 -120 92 -62C80 -25 40 -8 8 -3",
    node: [-6, -228],
    stops: ["#d6502f", "#c8452f", "#4f63e0"],
    label: { x: -6, y: -262, align: "center" },
  },
  // Learn comes up into the center from below, through the gap in the "Human judgment" label.
  learn: {
    d: "M176 5C160 60 120 90 76 88C34 86 6 64 5 10",
    node: [176, 5],
    stops: ["#3d6ff2", "#2f5fe0", "#2b55d0"],
    label: { x: 190, y: 1, align: "start" },
  },
  connect: {
    d: "M0 222C-45 190 -95 140 -95 75C-95 25 -50 -2 -9 0",
    node: [0, 222],
    stops: ["#7d4fd8", "#5b5fe6", "#1f8fb0"],
    label: { x: 0, y: 262, align: "center" },
  },
  act: {
    d: "M-168 33C-140 70 -100 110 -70 153",
    node: [-168, 33],
    stops: ["#1f9a8a", "#22a196", "#3f86c8"],
    label: { x: -184, y: 29, align: "end" },
  },
};

const pct = (n: number, from: number, span: number) =>
  `${(((n - from) / span) * 100).toFixed(3)}%`;

const ALIGN = {
  center: "-translate-x-1/2 -translate-y-1/2",
  start: "-translate-y-1/2",
  end: "-translate-x-full -translate-y-1/2",
};

/**
 * The idea, drawn: four paths, one per ability, each in its project's color, all meeting at one
 * center, Human Judgment. The labels are real links; pointing at one (or at its word in the text
 * beside the figure) brings its path forward and names the project at the center.
 *
 * `paths` controls the strokes only: "pending" hides them until the screen is in view, "alive"
 * draws them in. The labels, nodes, and center are always visible.
 */
export function IdeaFigure({
  paths,
  svgRef,
  delay = 0,
}: {
  paths?: "pending" | "alive";
  svgRef?: Ref<SVGSVGElement>;
  /** How long the paths wait before drawing in, in ms (e.g. for the long line to arrive first). */
  delay?: number;
}) {
  const { active, setActive } = useAbility();
  const filter = useId();
  const project = active ? projectByVerb(active) : null;

  function blur(e: FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null))
      setActive(null);
  }

  return (
    <figure
      aria-labelledby="idea-figure-caption"
      className="idea-figure relative @container"
      data-paths={paths}
      onBlur={blur}
      onMouseLeave={() => setActive(null)}
    >
      <figcaption id="idea-figure-caption" className="sr-only">
        Four paths, one for each ability (decide, learn, connect, and act), all
        meeting at one center: human judgment. Each ability links to the project
        built for it.
      </figcaption>

      <svg
        ref={svgRef}
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

        <g filter={`url(#${filter})`}>
          {VERB_ORDER.map((verb, i) => {
            const on = active === verb;
            return (
              <path
                key={verb}
                d={PATHS[verb].d}
                pathLength={1}
                stroke={`url(#${filter}-${verb})`}
                strokeWidth={on ? 3.6 : 2.4}
                strokeLinecap="round"
                className="draw-path"
                opacity={active && !on ? 0.3 : 1}
                style={
                  {
                    "--delay": `${delay + i * 140}ms`,
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
            r={5}
            fill="var(--paper)"
            stroke={PATHS[verb].stops[0]}
            strokeWidth={1.8}
          />
        ))}
        <circle
          r={9.5}
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth={2.2}
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
                onMouseEnter={() => setActive(verb)}
                onFocus={() => setActive(verb)}
                className={`accent-${p.slug} block px-1 py-1 font-display text-[max(1.15rem,5.4cqw)] capitalize leading-none transition-colors ${active === verb ? "text-a1" : "text-ink"}`}
              >
                {verb}
                <span className="sr-only">: {p.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
