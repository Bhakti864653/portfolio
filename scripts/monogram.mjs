/**
 * Generates the BA monogram's calligraphic shapes (src/lib/monogram-paths.json).
 *
 * Each stroke is a centerline (cubic Bézier segments) plus a width profile. The script samples the
 * centerline, offsets it by half the width on both sides, and writes a filled outline: thick on
 * downstrokes and thin on upstrokes, like a pen. The centerlines are written too, because the
 * draw-in animation traces them before the filled shapes appear.
 *
 * Run: node scripts/monogram.mjs
 */
import { writeFileSync } from "node:fs";

/** [x, y] points; each segment is [p0, c1, c2, p3]; consecutive segments share endpoints. */
const STROKES = {
  // B: the spine, a slightly slanted downstroke
  spine: {
    segments: [
      [
        [30, 13],
        [29, 36],
        [27, 60],
        [25, 83],
      ],
    ],
    widths: [
      [0, 2],
      [0.35, 7.2],
      [0.8, 6.4],
      [1, 2.2],
    ],
  },
  // B: upper bowl, thin across the top, full on the right, thin back into the waist
  upper: {
    segments: [
      [
        [30, 13],
        [46, 7],
        [62, 11],
        [60, 25],
      ],
      [
        [60, 25],
        [58, 37],
        [44, 43],
        [28, 45],
      ],
    ],
    widths: [
      [0, 1.1],
      [0.3, 2],
      [0.55, 6],
      [0.8, 3],
      [1, 1.1],
    ],
  },
  // B: lower bowl, larger, its right side swelling into the heaviest stroke of the B
  lower: {
    segments: [
      [
        [28, 45],
        [52, 43],
        [68, 53],
        [65, 67],
      ],
      [
        [65, 67],
        [62, 81],
        [44, 88],
        [25, 83],
      ],
    ],
    widths: [
      [0, 1.1],
      [0.3, 2.6],
      [0.52, 7.4],
      [0.78, 3.4],
      [1, 1.4],
    ],
  },
  // A: left leg, a thin upstroke that rises out of the B's lower bowl
  rise: {
    segments: [
      [
        [52, 84],
        [62, 62],
        [75, 36],
        [86, 11],
      ],
    ],
    widths: [
      [0, 1],
      [0.5, 2],
      [1, 1.2],
    ],
  },
  // A: right leg, the heavy downstroke, ending in the flourish that leaves as the thread
  fall: {
    segments: [
      [
        [86, 11],
        [92, 36],
        [98, 62],
        [102, 80],
      ],
      [
        [102, 80],
        [104, 88],
        [112, 90],
        [124, 86],
      ],
    ],
    widths: [
      [0, 1.2],
      [0.12, 4],
      [0.45, 8],
      [0.72, 5],
      [0.86, 2],
      [1, 0.9],
    ],
  },
  // The shared gesture: it leaves the B's lower bowl where the A's leg crosses it (the knot), and
  // runs on as the A's crossbar, lifting slightly as it reaches the right leg.
  bridge: {
    segments: [
      [
        [60, 58],
        [72, 60],
        [86, 58],
        [100, 51],
      ],
    ],
    widths: [
      [0, 1.2],
      [0.55, 3],
      [1, 1],
    ],
  },
};

const bez = ([p0, p1, p2, p3], t) => {
  const u = 1 - t;
  const pt = (i) =>
    u * u * u * p0[i] +
    3 * u * u * t * p1[i] +
    3 * u * t * t * p2[i] +
    t * t * t * p3[i];
  const d = (i) =>
    3 * u * u * (p1[i] - p0[i]) +
    6 * u * t * (p2[i] - p1[i]) +
    3 * t * t * (p3[i] - p2[i]);
  return { x: pt(0), y: pt(1), dx: d(0), dy: d(1) };
};

const smooth = (t) => t * t * (3 - 2 * t);
function widthAt(widths, t) {
  for (let i = 1; i < widths.length; i++) {
    const [t0, w0] = widths[i - 1];
    const [t1, w1] = widths[i];
    if (t <= t1) return w0 + (w1 - w0) * smooth((t - t0) / (t1 - t0));
  }
  return widths.at(-1)[1];
}

const r = (n) => Math.round(n * 100) / 100;

function outline({ segments, widths }, steps = 36) {
  const pts = [];
  segments.forEach((seg, s) => {
    for (let i = s === 0 ? 0 : 1; i <= steps; i++) {
      const local = i / steps;
      const p = bez(seg, local);
      const t = (s + local) / segments.length;
      const len = Math.hypot(p.dx, p.dy) || 1;
      const half = widthAt(widths, t) / 2;
      pts.push({
        l: [p.x - (p.dy / len) * half, p.y + (p.dx / len) * half],
        r: [p.x + (p.dy / len) * half, p.y - (p.dx / len) * half],
      });
    }
  });
  const left = pts.map((p) => p.l);
  const right = pts.map((p) => p.r).reverse();
  const all = [...left, ...right];
  return (
    `M${r(all[0][0])} ${r(all[0][1])}` +
    all
      .slice(1)
      .map(([x, y]) => `L${r(x)} ${r(y)}`)
      .join("") +
    "Z"
  );
}

const centerline = ({ segments }) =>
  `M${segments[0][0].join(" ")}` +
  segments
    .map(([, a, b, c]) => `C${a.join(" ")} ${b.join(" ")} ${c.join(" ")}`)
    .join("");

/** The small-size version: same drawing, every stroke heavier so it survives 16–24px. */
const heavy = (s) => ({
  ...s,
  widths: s.widths.map(([t, w]) => [t, Math.max(w * 1.35, 5)]),
});

const out = {
  viewBox: "0 0 128 96",
  /** Where the flourish leaves the mark: the start of the page's thread. */
  exit: STROKES.fall.segments.at(-1)[3],
  order: Object.keys(STROKES),
  shapes: Object.fromEntries(
    Object.entries(STROKES).map(([k, s]) => [k, outline(s)]),
  ),
  small: Object.fromEntries(
    Object.entries(STROKES).map(([k, s]) => [k, outline(heavy(s))]),
  ),
  lines: Object.fromEntries(
    Object.entries(STROKES).map(([k, s]) => [k, centerline(s)]),
  ),
};
writeFileSync(
  new URL("../src/lib/monogram-paths.json", import.meta.url),
  JSON.stringify(out, null, 2) + "\n",
);
console.log("wrote src/lib/monogram-paths.json");

// The favicon: the heavy version, ivory on an ink tile.
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><rect width="72" height="72" rx="15" fill="#111515"/><g transform="translate(-4.75 8.3) scale(0.566)" fill="#f6f2ea">${out.order.map((k) => `<path d="${out.small[k]}"/>`).join("")}</g></svg>
`;
writeFileSync(new URL("../src/app/icon.svg", import.meta.url), fav);
console.log("wrote src/app/icon.svg");
