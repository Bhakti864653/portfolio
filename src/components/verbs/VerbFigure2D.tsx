import { PATH_BEARINGS, svgPath } from "@/lib/geometry";
import { projectByVerb, VERB_ORDER, type Verb } from "@/lib/projects";

const SIZE = 600;
const C = SIZE / 2;
const R = 250;

/** Purely visual (aria-hidden): every piece of information here is also in the verb buttons and panel. */
export function VerbFigure2D({
  active,
  animate,
}: {
  active: Verb | null;
  animate: boolean;
}) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full"
      aria-hidden="true"
      fill="none"
    >
      {/* Atlas rings and bearings */}
      {[R, R * 0.66, R * 0.33].map((r) => (
        <circle
          key={r}
          cx={C}
          cy={C}
          r={r}
          stroke="var(--line)"
          strokeDasharray={r === R ? "0" : "2 6"}
        />
      ))}
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const long = i % 9 === 0;
        const r1 = R + 6;
        const r2 = R + (long ? 18 : 11);
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
      <line
        x1={C - R - 30}
        y1={C}
        x2={C + R + 30}
        y2={C}
        stroke="var(--line)"
      />
      <line
        x1={C}
        y1={C - R - 30}
        x2={C}
        y2={C + R + 30}
        stroke="var(--line)"
      />

      {VERB_ORDER.map((verb) => {
        const on = active === verb;
        const dim = active !== null && !on;
        const d = svgPath(verb, C, C, R);
        return (
          <g
            key={verb}
            className={`accent-${slugFor(verb)}`}
            style={{ transition: "opacity 400ms" }}
            opacity={dim ? 0.5 : 1}
          >
            <path
              d={d}
              stroke={on ? "var(--a1)" : "var(--ink)"}
              strokeWidth={on ? 2.6 : 1.4}
              style={{ transition: "stroke 400ms, stroke-width 400ms" }}
            />
            {on && (
              // Traced once from the outer end into the center each time a path is chosen.
              <path
                key={`trace-${verb}`}
                d={d}
                pathLength={1}
                stroke="var(--a1)"
                strokeWidth={3.4}
                strokeLinecap="round"
                strokeDasharray="1"
                className={animate ? "trace" : undefined}
              />
            )}
            <circle
              cx={round(C + R * cos(verb))}
              cy={round(C + R * sin(verb))}
              r={on ? 7 : 4.5}
              fill={on ? "var(--a1)" : "var(--paper)"}
              stroke={on ? "var(--a1)" : "var(--ink)"}
              strokeWidth={1.4}
            />
          </g>
        );
      })}

      {/* Human judgment: the fixed point every path must pass through */}
      <circle
        cx={C}
        cy={C}
        r={20}
        stroke="var(--ink)"
        strokeWidth={1}
        strokeDasharray="1 4"
      />
      <circle
        cx={C}
        cy={C}
        r={8}
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth={2}
      />
    </svg>
  );
}

const cos = (v: Verb) => Math.cos((PATH_BEARINGS[v] * Math.PI) / 180);
const sin = (v: Verb) => Math.sin((PATH_BEARINGS[v] * Math.PI) / 180);
const slugFor = (v: Verb) => projectByVerb(v).slug;
// Server and browser trig can differ in the last digits; rounding keeps hydration identical.
const round = (n: number) => Math.round(n * 100) / 100;
