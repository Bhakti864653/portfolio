import type { CSSProperties } from "react";
import { PATH_BEARINGS, svgPath } from "@/lib/geometry";
import { projectByVerb, VERB_ORDER, type Verb } from "@/lib/projects";

const SIZE = 600;
const C = SIZE / 2;
const R = 240;

/**
 * The four-path figure, drawn as a plate with depth: an offset shadow, a raised disc, and four
 * paths in their projects' colors running into a solid center, Human Judgment. It is aria-hidden:
 * every piece of information here is also in the labelled links around it. The paths are also
 * pointer targets (a wide invisible stroke), so pointing at a path answers like its label does.
 */
export function VerbFigure2D({
  active,
  animate,
  onHover,
  onPick,
}: {
  active: Verb | null;
  animate: boolean;
  onHover?: (verb: Verb) => void;
  onPick?: (verb: Verb) => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full overflow-visible"
      aria-hidden="true"
      fill="none"
    >
      {/* The plate: an offset shadow (the same device as the screenshot plates) and a raised disc */}
      <circle cx={C + 10} cy={C + 12} r={R + 34} fill="var(--line)" />
      <circle
        cx={C}
        cy={C}
        r={R + 34}
        fill="var(--soft)"
        stroke="var(--line-strong)"
      />

      {/* Atlas rings and bearings */}
      {[R * 0.66, R * 0.33].map((r) => (
        <circle
          key={r}
          cx={C}
          cy={C}
          r={r}
          stroke="var(--line)"
          strokeDasharray="2 6"
        />
      ))}
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const long = i % 9 === 0;
        const r1 = R + 34;
        const r2 = R + 34 - (long ? 16 : 8);
        return (
          <line
            key={i}
            x1={round(C + r1 * Math.cos(a))}
            y1={round(C + r1 * Math.sin(a))}
            x2={round(C + r2 * Math.cos(a))}
            y2={round(C + r2 * Math.sin(a))}
            stroke={long ? "var(--line-strong)" : "var(--line)"}
          />
        );
      })}

      {VERB_ORDER.map((verb, i) => {
        const on = active === verb;
        const dim = active !== null && !on;
        const d = svgPath(verb, C, C, R);
        const x = round(C + R * cos(verb));
        const y = round(C + R * sin(verb));
        return (
          <g
            key={verb}
            className={`accent-${slugFor(verb)}`}
            style={{ transition: "opacity 400ms" }}
            opacity={dim ? 0.25 : 1}
          >
            {/* Drawn once on arrival, from the project in to the center (instant under
                reduced motion, via the global data-motion rule) */}
            <path
              d={d}
              pathLength={1}
              stroke="var(--a1)"
              strokeWidth={on ? 5 : 2.6}
              strokeLinecap="round"
              className="enter-draw"
              style={
                {
                  "--len": 1,
                  "--delay": `${650 + i * 140}ms`,
                  transition: "stroke-width 400ms",
                } as CSSProperties
              }
            />
            {on && animate && (
              // A point travels from the project in to Human Judgment each time a path is chosen.
              <circle key={`pulse-${verb}`} r={7} fill="var(--a1)">
                <animateMotion
                  dur="900ms"
                  path={d}
                  fill="freeze"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.5 0 0.2 1"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={on ? 13 : 9}
              fill="var(--a1)"
              stroke="var(--soft)"
              strokeWidth={4}
              style={{ transition: "r 300ms" }}
            />
            {/* Pointer target: the whole path and its node */}
            <path
              d={d}
              stroke="transparent"
              strokeWidth={40}
              pointerEvents="stroke"
              className="cursor-pointer"
              onMouseEnter={() => onHover?.(verb)}
              onClick={() => onPick?.(verb)}
            />
            <circle
              cx={x}
              cy={y}
              r={28}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => onHover?.(verb)}
              onClick={() => onPick?.(verb)}
            />
          </g>
        );
      })}

      {/* Human judgment: the fixed point every path must pass through */}
      <circle
        cx={C}
        cy={C}
        r={44}
        stroke={active ? "var(--a1)" : "var(--ink)"}
        strokeWidth={1.4}
        strokeDasharray="1 5"
        strokeLinecap="round"
        style={{ transition: "stroke 400ms" }}
      />
      <circle cx={C} cy={C} r={26} fill="var(--ink)" />
      <circle cx={C} cy={C} r={7} fill="var(--paper)" />
    </svg>
  );
}

const cos = (v: Verb) => Math.cos((PATH_BEARINGS[v] * Math.PI) / 180);
const sin = (v: Verb) => Math.sin((PATH_BEARINGS[v] * Math.PI) / 180);
const slugFor = (v: Verb) => projectByVerb(v).slug;
// Server and browser trig can differ in the last digits; rounding keeps hydration identical.
const round = (n: number) => Math.round(n * 100) / 100;
