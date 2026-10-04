// Generates the entrance's paper: one wide sheet of soft folds and cloudy light (light and dark),
// and a fine, seamlessly tiling tooth that sits on top of it. Run with: node scripts/paper.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = new URL("../public/paper/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// A small seeded PRNG, so the paper is the same on every run.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth value noise on a lattice, summed over octaves. It repeats every `cells` lattice steps,
// i.e. once per unit of u and v.
function valueNoise(seed, cells) {
  const r = rng(seed);
  const grid = Array.from({ length: cells * cells }, () => r() * 2 - 1);
  const at = (i, j) => grid[(j % cells) * cells + (i % cells)];
  const fade = (t) => t * t * (3 - 2 * t);
  return (u, v) => {
    const x = u * cells;
    const y = v * cells;
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = fade(x - i);
    const fy = fade(y - j);
    const a = at(i, j) + (at(i + 1, j) - at(i, j)) * fx;
    const b = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * fx;
    return a + (b - a) * fy;
  };
}
function fbm(seed, base, octaves) {
  const layers = Array.from({ length: octaves }, (_, k) =>
    valueNoise(seed + k * 101, base * 2 ** k),
  );
  return (u, v) => {
    let sum = 0;
    let amp = 1;
    let norm = 0;
    for (const n of layers) {
      sum += n(u, v) * amp;
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  };
}

/* ---------------------------------------------------------------------------------------------
   The sheet: 2 screens wide. Soft diagonal folds (each a light side and a shadow side), cloudy
   light over them, and a slight falloff toward the lower corners.
   --------------------------------------------------------------------------------------------- */
const W = 2400;
const H = 750;
const clouds = fbm(7, 3, 3);
const warp = fbm(19, 2, 3);
const r = rng(42);
// Folds run down and to the right, about 35° below horizontal, as light from the upper left
// catches a sheet that was once gently creased. `at` spans the folds across the whole sheet.
const NORMAL = (125 * Math.PI) / 180;
const span = [W * Math.cos(NORMAL), H * Math.sin(NORMAL)];
const folds = Array.from({ length: 8 }, (_, k) => ({
  angle: NORMAL + ((r() - 0.5) * 12 * Math.PI) / 180,
  at: span[0] + ((k + 0.5) / 8) * (span[1] - span[0]) + (r() - 0.5) * 120,
  width: 90 + r() * 200,
  amp: (0.6 + r() * 0.8) * (r() < 0.5 ? 1 : -1),
}));

const field = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const u = x / H;
    const v = y / H;
    // Scaled so neither noise repeats across the sheet (u reaches W / H = 3.2).
    let L = clouds(u * 0.3, v * 0.3) * 0.7;
    const bend = warp(u * 0.3, v * 0.3) * 90;
    for (const f of folds) {
      const d =
        (x * Math.cos(f.angle) + y * Math.sin(f.angle) - f.at + bend) / f.width;
      // A fold: light rising into a crease, shadow falling away from it.
      L += f.amp * -d * Math.exp(-d * d) * 1.6;
    }
    const cx = Math.min(x, W - x) / H;
    L -= Math.max(0, 0.55 - cx) * (v * 0.9);
    field[y * W + x] = L;
  }
}
// Spread the tones by percentile, so a few extreme pixels don't flatten everything else.
const sorted = Float32Array.from(field).sort();
const lo = sorted[Math.floor(sorted.length * 0.01)];
const hi = sorted[Math.floor(sorted.length * 0.99)];

function sheet(name, shadow, base, light) {
  const px = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    const t = Math.max(-1, Math.min(1, ((field[i] - lo) / (hi - lo)) * 2 - 1)); // -1 shadow, 1 light
    const [from, to, k] = t < 0 ? [base, shadow, -t] : [base, light, t];
    const e = k ** 1.15;
    for (let c = 0; c < 3; c++)
      px[i * 3 + c] = Math.round(from[c] + (to[c] - from[c]) * e);
  }
  return sharp(px, { raw: { width: W, height: H, channels: 3 } })
    .blur(1.2)
    .webp({ quality: 82, smartSubsample: true })
    .toFile(new URL(name, OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
}

await sheet(
  "sheet-light.webp",
  [228, 218, 202],
  [245, 239, 228],
  [252, 250, 245],
);
await sheet("sheet-dark.webp", [11, 14, 13], [20, 24, 23], [31, 36, 34]);

/* ---------------------------------------------------------------------------------------------
   The tooth: 512px (shown at 256 css px, so it stays crisp on high-density screens). Per-pixel
   grain, softened, over a faint mottle (the uneven density of real paper). It wraps, so the tile
   is seamless.
   --------------------------------------------------------------------------------------------- */
const T = 512;
const g = rng(3);
const grain = new Float32Array(T * T).map(() => (g() + g() + g() - 1.5) / 1.5);
const soft = new Float32Array(T * T);
const at = (x, y) => grain[((y + T) % T) * T + ((x + T) % T)];
// Lattice noise is periodic when its cell count divides the tile, so the mottle wraps too.
const mottle = fbm(11, 16, 2);
for (let y = 0; y < T; y++)
  for (let x = 0; x < T; x++) {
    const blur =
      (at(x - 1, y) + at(x + 1, y) + at(x, y - 1) + at(x, y + 1)) / 4;
    soft[y * T + x] = at(x, y) * 0.4 + blur * 0.6 + mottle(x / T, y / T) * 0.12;
  }
const tooth = Buffer.alloc(T * T * 4);
for (let i = 0; i < T * T; i++) {
  const v = soft[i];
  const dark = v < 0;
  const alpha = Math.min(
    255,
    Math.round((Math.abs(v) * (dark ? 34 : 40)) / 3) * 3,
  );
  tooth.set(dark ? [62, 50, 38, alpha] : [255, 255, 255, alpha], i * 4);
}
await sharp(tooth, { raw: { width: T, height: T, channels: 4 } })
  .png({ palette: true, colours: 64, compressionLevel: 9 })
  .toFile(new URL("tooth.png", OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

console.log("paper written to public/paper/");
