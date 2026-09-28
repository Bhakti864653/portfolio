import type { Verb } from "./projects";

/**
 * The four paths of the verb system. Each starts on the outer ring at its own compass bearing and
 * turns a quarter-circle inward until it reaches the center: "Human judgment". The 2D figure and
 * the 3D scene both draw from these same numbers, so they always show the same idea.
 */
export const PATH_BEARINGS: Record<Verb, number> = {
  // Clockwise in reading order: decide, learn, connect, act.
  decide: -90, // north
  learn: 0, // east
  connect: 90, // south
  act: 180, // west
};

const OUTER = 1;
const TURN = 100; // degrees each path sweeps on its way in

/** Points along one path, from the outer ring (t=0) to the center (t=1), in unit coordinates. */
export function pathPoints(verb: Verb, steps = 48): [number, number][] {
  const start = (PATH_BEARINGS[verb] * Math.PI) / 180;
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Radius eases in so the path lingers near the edge and commits near the center.
    const r = OUTER * (1 - t) ** 1.35;
    const angle = start + (TURN * Math.PI * t) / 180;
    points.push([r * Math.cos(angle), r * Math.sin(angle)]);
  }
  return points;
}

/** An SVG path string for a figure whose center is (cx, cy) and outer radius is `radius`. */
export function svgPath(
  verb: Verb,
  cx: number,
  cy: number,
  radius: number,
): string {
  return pathPoints(verb)
    .map(
      ([x, y], i) =>
        `${i === 0 ? "M" : "L"}${(cx + x * radius).toFixed(1)} ${(cy + y * radius).toFixed(1)}`,
    )
    .join(" ");
}
