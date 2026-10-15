"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type Ref,
  type RefObject,
} from "react";
import { useMediaQuery, useMotion } from "@/lib/prefs";
import { triggerEgg } from "../motion/EasterEgg";
import { AbilityArea, AbilityProvider } from "../verbs/ability";
import { IdeaFigure, LEAD, VIEW } from "./IdeaFigure";
import { LineFilter } from "./LineFilter";
import { PreviewSlot } from "./PreviewSlot";

/**
 * The entrance: two full screens on one sheet of paper. The first is the arrival (the statement,
 * revealed letter by letter, and a fine colored line that starts under its last word and runs off
 * to the right); the second is the idea (the line comes back in from the left, under the words,
 * and becomes one of four paths meeting at Human Judgment).
 *
 * On a large screen with full motion the two screens sit side by side and the sheet pans across
 * as you scroll (or click "Continue to the idea"): the line draws ahead of the second screen as it
 * arrives, then the four paths come to life. Otherwise (phones, reduced motion, no JavaScript) the
 * screens simply stack, and nothing moves under reduced motion.
 */

/** Of the stage's scroll travel, the share that pans; the rest holds the idea in place a moment. */
const PAN_SHARE = 0.8;
const STAGE_HEIGHT = "235svh";

type Pt = [number, number];
type Seg = [Pt, Pt, Pt];
/** A measured line: its path, the screen it's drawn on, where it meets the left edge, and its length across. */
type Line = {
  d: string;
  w: number;
  h: number;
  y0: number;
  x2: number;
  width: number;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const pt = ([x, y]: Pt) =>
  `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`;
const curve = (start: Pt, ...segs: Seg[]) =>
  `M${pt(start)}` +
  segs.map(([a, b, c]) => `C${pt(a)} ${pt(b)} ${pt(c)}`).join("");

/**
 * The arrival line, from the statement's own measurements: it begins just under the last word,
 * dips a little below its baseline, then runs in a long S off the right edge. While the sheet pans
 * it always leaves at `exit`, the height where the idea's line comes back in, so the two meet as
 * one unbroken line at the seam; when the screens stack (no seam) it simply rises off the edge.
 */
function arrivalLine(
  panel: DOMRect,
  word: DOMRect,
  base: number,
  fs: number,
  exit: number,
): Line {
  const W = panel.width;
  const left = word.left - panel.left;
  const b = base - panel.top;
  const s: Pt = [left + 0.16 * word.width, b + 0.012 * fs];
  const low: Pt = [left + 0.62 * word.width, b + 0.085 * fs];
  const rise = Math.min(0.49 * fs, 0.35 * (W - low[0]));
  const end: Pt = [W + 4, Number.isFinite(exit) ? exit : low[1] - rise];
  const crest: Pt = [low[0] + 0.86 * (W - low[0]), end[1] - 0.03 * fs];
  const run = low[0] - s[0];
  return {
    d: curve(
      s,
      [
        [s[0] + 0.3 * run, s[1] + 0.6 * (low[1] - s[1])],
        [low[0] - 0.4 * run, low[1]],
        low,
      ],
      [
        [low[0] + 0.45 * (crest[0] - low[0]), low[1]],
        [crest[0] - 0.35 * (crest[0] - low[0]), crest[1]],
        crest,
      ],
      [
        [crest[0] + 0.4 * (end[0] - crest[0]), crest[1]],
        [end[0] - 0.3 * (end[0] - crest[0]), end[1]],
        end,
      ],
    ),
    w: W,
    h: panel.height,
    y0: s[1],
    x2: end[0],
    width: Math.max(1.6, fs * 0.0085),
  };
}

/**
 * The line's return: in from the left edge, through the gap between the explanation and the four
 * words (or, when the figure sits below the text, straight across to it), cresting up and to the
 * left of Human Judgment and dropping into it.
 */
function leadLine(
  panel: DOMRect,
  desc: DOMRect,
  words: DOMRect,
  fig: DOMRect,
): Line {
  const s = fig.width / VIEW.w;
  const cx = fig.left - panel.left - VIEW.x * s;
  const cy = fig.top - panel.top - VIEW.y * s;
  const crest: Pt = [cx + LEAD.crest[0] * s, cy + LEAD.crest[1] * s];
  const end: Pt = [cx + LEAD.end[0] * s, cy + LEAD.end[1] * s];
  const into: Seg = [
    [crest[0] + 45 * s, crest[1]],
    [cx - 2 * s, cy - 55 * s],
    end,
  ];
  const textRight = desc.right - panel.left;
  let d: string;
  let y0: number;
  if (fig.left - panel.left > textRight) {
    const top = desc.bottom - panel.top;
    const gap = words.top - desc.bottom;
    y0 = top + 0.32 * gap;
    const textLeft = desc.left - panel.left;
    const low: Pt = [textLeft + 0.4 * (textRight - textLeft), top + 0.78 * gap];
    d = curve(
      [-4, y0],
      [[low[0] * 0.35, y0 + (low[1] - y0) * 0.35], [low[0] * 0.7, low[1]], low],
      [
        [low[0] + 0.4 * (crest[0] - low[0]), low[1]],
        [crest[0] - 75 * s, crest[1]],
        crest,
      ],
      into,
    );
  } else {
    y0 = crest[1] + 40 * s;
    d = curve(
      [-4, y0],
      [[crest[0] * 0.4, y0], [crest[0] - 75 * s, crest[1]], crest],
      into,
    );
  }
  return {
    d,
    w: panel.width,
    h: panel.height,
    y0,
    x2: end[0],
    width: Math.max(1.6, 2.4 * s),
  };
}

/** The teal the arrival line leaves in, and the idea's line comes back in. */
const SEAM = "#129184";
const ARRIVAL_STOPS: [number, string][] = [
  [0, "#e0582f"],
  [0.14, "#cf4a2c"],
  [0.3, "var(--ink)"],
  [0.48, "#8a55ea"],
  [0.64, "#4b6cf3"],
  [0.82, "#2a7fd6"],
  [1, SEAM],
];
/** Back in from the seam in the same teal, turning to the drawing's red within the margin. */
const leadStops = (x2: number): [number, string][] => [
  [0, SEAM],
  [Math.min(0.12, 90 / x2), "#cf4d33"],
  [0.3, "#a35ae0"],
  [0.55, "#4f6ff0"],
  [0.8, "#169a8f"],
  [1, "#2f6fe6"],
];

function LineArt({
  line,
  stops,
  pathRef,
  className,
  paths,
}: {
  line: Line;
  stops: [number, string][];
  pathRef?: Ref<SVGPathElement>;
  className?: string;
  paths?: "pending" | "alive";
}) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${line.w} ${line.h}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
      data-paths={paths}
    >
      <defs>
        <LineFilter
          id={`${id}-f`}
          region={[-20, -20, line.w + 40, line.h + 40]}
          blur={3.2}
        />
        <linearGradient
          id={`${id}-g`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={line.x2}
          y1={0}
          y2={0}
        >
          {stops.map(([o, c]) => (
            <stop key={o} offset={o} style={{ stopColor: c }} />
          ))}
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={line.d}
        pathLength={1}
        strokeDasharray={1}
        stroke={`url(#${id}-g)`}
        strokeWidth={line.width}
        strokeLinecap="round"
        filter={`url(#${id}-f)`}
        className={className}
      />
    </svg>
  );
}

/** A thin drawn arrow, as in the reference: a hairline and an open head. */
function LineArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 10"
      className="h-2.5 w-[4.5rem] overflow-visible transition-transform duration-300 group-hover:translate-x-1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M0 5H78M72.5 1.5 78 5 72.5 8.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const CONTINUE =
  "annot group inline-flex min-h-11 items-center gap-5 self-start text-[0.72rem] tracking-[0.2em] text-muted transition-colors hover:text-ink";

/** The statement, word by word ("expand" set in italic). */
const STATEMENT = [
  "Technology",
  "should",
  "expand",
  "what",
  "people",
  "can",
  "do.",
];

/**
 * The hero statement as separate letters, so each can rise in turn (and lean toward the cursor).
 * Screen readers get the sentence once, as plain text; the letters are hidden from them.
 * `lastRef` and `baselineRef` mark the last word, where the arrival line starts.
 */
function StatementLetters({
  lastRef,
  baselineRef,
}: {
  lastRef: Ref<HTMLSpanElement>;
  baselineRef: Ref<HTMLSpanElement>;
}) {
  const starts = STATEMENT.map((_, w) =>
    STATEMENT.slice(0, w).reduce((n, word) => n + word.length, 0),
  );
  return (
    <>
      <span className="sr-only">{STATEMENT.join(" ")}</span>
      <span aria-hidden="true">
        {STATEMENT.map((word, w) => {
          const last = w === STATEMENT.length - 1;
          return (
            <span key={word}>
              <span
                ref={last ? lastRef : undefined}
                className={`hero-word ${word === "expand" ? "italic" : ""}`}
                style={{ "--wi": w } as CSSProperties}
              >
                {last && (
                  <span
                    ref={baselineRef}
                    className="inline-block h-0 w-0 align-baseline"
                  />
                )}
                {[...word].map((ch, c) => (
                  <span
                    key={c}
                    className="hero-letter"
                    style={{ "--i": starts[w] + c } as CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
              </span>{" "}
            </span>
          );
        })}
      </span>
    </>
  );
}

/**
 * On a desktop with full motion, the statement's letters lean a few pixels toward the cursor,
 * strongest for the letters nearest it, and settle back when it leaves.
 */
function useLettersFollowCursor(
  section: RefObject<HTMLElement | null>,
  on: boolean,
) {
  useEffect(() => {
    const el = section.current;
    if (!el || !on) return;
    const letters = Array.from(
      el.querySelectorAll<HTMLElement>(".hero-letter"),
    );
    let centers: [number, number][] = [];
    let frame = 0;
    let px = 0;
    let py = 0;
    const measure = () => {
      for (const l of letters) l.style.removeProperty("translate");
      centers = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
    };
    const update = () => {
      frame = 0;
      letters.forEach((l, i) => {
        const [cx, cy] = centers[i];
        const dx = px - cx;
        const dy = py - cy;
        const d = Math.hypot(dx, dy) || 1;
        const pull = Math.max(0, 1 - d / 320) * 9;
        l.style.translate = `${((dx / d) * pull).toFixed(2)}px ${((dy / d) * pull).toFixed(2)}px`;
      });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!centers.length) measure();
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const settle = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const l of letters) l.style.removeProperty("translate");
      centers = [];
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", settle);
    window.addEventListener("scroll", settle, { passive: true });
    window.addEventListener("resize", settle);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", settle);
      window.removeEventListener("scroll", settle);
      window.removeEventListener("resize", settle);
      settle();
    };
  }, [section, on]);
}

/** Tapping my name five times in a row (handy on a phone, with no keyboard) shows an egg. */
function useNameTaps() {
  const taps = useRef<number[]>([]);
  return () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 1600), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      triggerEgg(now % 2 ? "panama" : "india");
    }
  };
}

export function Entrance() {
  const motion = useMotion();
  const wide = useMediaQuery("(min-width: 1024px) and (min-height: 600px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const mode: "pan" | "stack" = motion === "full" && wide ? "pan" : "stack";
  const animate = motion === "full";

  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const arrival = useRef<HTMLElement>(null);
  const idea = useRef<HTMLElement>(null);
  const lastWord = useRef<HTMLSpanElement>(null);
  const baseline = useRef<HTMLSpanElement>(null);
  const desc = useRef<HTMLParagraphElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const figure = useRef<SVGSVGElement>(null);
  const lead = useRef<SVGPathElement>(null);
  const ideaTitle = useRef<HTMLHeadingElement>(null);

  const [lines, setLines] = useState<{ arrival: Line; lead: Line } | null>(
    null,
  );
  const [alive, setAlive] = useState(false);
  const tapName = useNameTaps();
  useLettersFollowCursor(arrival, animate && finePointer);

  // Measure the text and the figure, and draw both lines from them; again whenever either screen
  // changes size (a resize, a font arriving, or the switch between panning and stacking).
  useEffect(() => {
    const measure = () => {
      const a = arrival.current;
      const i = idea.current;
      if (!a || !i || !lastWord.current || !baseline.current) return;
      if (!desc.current || !words.current || !figure.current) return;
      const fs = parseFloat(getComputedStyle(lastWord.current).fontSize);
      const lead = leadLine(
        i.getBoundingClientRect(),
        desc.current.getBoundingClientRect(),
        words.current.getBoundingClientRect(),
        figure.current.getBoundingClientRect(),
      );
      setLines({
        arrival: arrivalLine(
          a.getBoundingClientRect(),
          lastWord.current.getBoundingClientRect(),
          baseline.current.getBoundingClientRect().bottom,
          fs,
          // Only a panning sheet has a seam to meet across.
          mode === "pan" ? lead.y0 : -Infinity,
        ),
        lead,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    // Also watch the idea screen's content and the figure: if anything in that column changes
    // size (fonts arriving, the previews being built), the figure can move, and the line must
    // still land exactly on Human Judgment.
    const content = words.current?.closest(".shell");
    for (const el of [arrival.current, idea.current, content, figure.current])
      if (el) observer.observe(el);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [mode]);

  // Panning: the scroll position drives the sheet, the line's draw, and when the paths come alive.
  useEffect(() => {
    if (mode !== "pan") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = stage.current;
      if (!el || !track.current) return;
      const travel = (el.offsetHeight - window.innerHeight) * PAN_SHARE;
      const p = clamp01(-el.getBoundingClientRect().top / travel);
      const e = smooth(p);
      track.current.style.transform = `translate3d(${-50 * e}%,0,0)`;
      lead.current?.style.setProperty(
        "stroke-dashoffset",
        String(1 - clamp01((e - 0.2) / 0.75)),
      );
      setAlive((was) => (p > 0.9 ? true : p < 0.4 ? false : was));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const trackEl = track.current;
    const leadEl = lead.current;
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      trackEl?.style.removeProperty("transform");
      leadEl?.style.removeProperty("stroke-dashoffset");
    };
  }, [mode, lines]);

  // Stacked, with motion: the line and paths draw once, when the idea comes into view.
  useEffect(() => {
    if (mode !== "stack" || !animate || !idea.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAlive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(idea.current);
    return () => observer.disconnect();
  }, [mode, animate]);

  /** Where the stage has fully panned to the idea (in page coordinates). */
  function ideaScrollTop() {
    const el = stage.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return top + (el.offsetHeight - window.innerHeight) * PAN_SHARE;
  }

  /** An eased scroll that any wheel, touch, or key press cancels. */
  function glide(to: number, done: () => void) {
    if (!animate) {
      window.scrollTo({ top: to, behavior: "instant" });
      done();
      return;
    }
    const from = window.scrollY;
    const distance = to - from;
    const duration = Math.min(1800, 900 + Math.abs(distance) * 0.5);
    // With smooth scrolling on, let it drive the glide, so the two never fight.
    if (window.__lenis) {
      window.__lenis.scrollTo(to, {
        duration: duration / 1000,
        onComplete: done,
      });
      return;
    }
    let start = 0;
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      for (const type of ["wheel", "touchstart", "keydown"])
        window.removeEventListener(type, stop);
    };
    const step = (t: number) => {
      start ||= t;
      const k = clamp01((t - start) / duration);
      window.scrollTo({
        top: from + distance * easeInOut(k),
        behavior: "instant",
      });
      if (k < 1) frame = requestAnimationFrame(step);
      else {
        stop();
        done();
      }
    };
    for (const type of ["wheel", "touchstart", "keydown"])
      window.addEventListener(type, stop, { passive: true });
    frame = requestAnimationFrame(step);
  }

  function toIdea(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const focus = () => ideaTitle.current?.focus({ preventScroll: true });
    if (mode === "pan") glide(ideaScrollTop(), focus);
    else {
      const el = idea.current!;
      glide(el.getBoundingClientRect().top + window.scrollY, focus);
    }
  }

  function toWork(e: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("directions");
    if (!target) return;
    e.preventDefault();
    glide(target.getBoundingClientRect().top + window.scrollY - 64, () => {
      if (!target.hasAttribute("tabindex"))
        target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  // While panning, only one screen is in view: tabbing into the other one brings it into view.
  function onFocus(e: FocusEvent<HTMLDivElement>) {
    if (mode !== "pan" || !stage.current || !idea.current) return;
    const top = stage.current.getBoundingClientRect().top + window.scrollY;
    const end = ideaScrollTop();
    const inIdea = idea.current.contains(e.target as Node);
    if (inIdea && window.scrollY < end - 2)
      window.scrollTo({ top: end, behavior: "instant" });
    if (!inIdea && window.scrollY > top + 2)
      window.scrollTo({ top, behavior: "instant" });
  }

  const pending = !alive && (mode === "pan" || animate);
  const paths = alive ? "alive" : pending ? "pending" : undefined;
  const pan = mode === "pan";

  return (
    <div
      ref={stage}
      id="entrance"
      data-mode={mode}
      onFocus={onFocus}
      className="entrance relative -mt-16"
      style={pan ? { height: STAGE_HEIGHT } : undefined}
    >
      <div className={pan ? "sticky top-0 h-svh overflow-clip" : undefined}>
        <div
          ref={track}
          className={
            pan ? "flex h-full w-[200%] will-change-transform" : undefined
          }
        >
          {/* 01 · Arrival */}
          <section
            ref={arrival}
            aria-labelledby="home-title"
            className={`paper paper-left relative flex min-h-svh flex-col overflow-clip ${pan ? "h-full w-1/2" : ""}`}
          >
            {lines && (
              <LineArt
                line={lines.arrival}
                stops={ARRIVAL_STOPS}
                className={animate ? "line-arrive" : undefined}
              />
            )}
            <div className="shell relative flex flex-1 flex-col pb-[clamp(1.25rem,5svh,3rem)] pt-[calc(4rem+clamp(2rem,9svh,5.5rem))]">
              {/* Centered in the screen's height; on a desktop screen it nearly fills it, as drawn */}
              <div className="my-auto">
                <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  {/* Tapping the name five times shows an easter egg (no keyboard needed). */}
                  <span
                    className="hero-name font-name italic text-ink"
                    onClick={tapName}
                  >
                    Bhakti Ahir
                  </span>
                  <span className="annot text-[clamp(0.62rem,0.86vw,0.78rem)] tracking-[0.32em]">
                    A personal portfolio
                  </span>
                </p>
                <h1
                  id="home-title"
                  className="entrance-statement mt-[0.16em] -ml-[0.03em] text-ink"
                >
                  <StatementLetters lastRef={lastWord} baselineRef={baseline} />
                </h1>
                <p className="entrance-tagline ml-[0.04em] font-display text-ink">
                  High school senior in Santiago, Panama, building what school
                  doesn’t teach: 4 deployed apps, including a civic platform with
                  real residents’ reports.
                </p>
              </div>
              <a href="#idea" onClick={toIdea} className={`${CONTINUE} pt-8`}>
                Continue to the idea
                <LineArrow />
              </a>
            </div>
          </section>

          {/* 02 · Idea */}
          <section
            ref={idea}
            id="idea"
            aria-labelledby="idea-title"
            className={`paper paper-right relative flex min-h-svh flex-col overflow-clip ${pan ? "h-full w-1/2" : ""}`}
          >
            {lines && (
              <LineArt
                line={lines.lead}
                stops={leadStops(lines.lead.x2)}
                pathRef={lead}
                className={pan ? undefined : "draw-path"}
                paths={pan ? undefined : paths}
              />
            )}
            <AbilityProvider>
              <AbilityArea className="shell relative flex flex-1 flex-col pb-[clamp(1.25rem,5svh,3rem)] pt-[calc(4rem+clamp(2rem,7svh,4rem))]">
                <div className="relative z-10 my-auto lg:max-w-[58%] lg:pt-[4svh]">
                  <h2
                    id="idea-title"
                    ref={ideaTitle}
                    tabIndex={-1}
                    className="entrance-idea text-ink lg:whitespace-nowrap"
                  >
                    I build <em>ways</em> forward.
                  </h2>
                  <p
                    ref={desc}
                    className="mt-[clamp(1rem,2.6svh,1.6rem)] max-w-[29em] text-balance text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.45] text-ink"
                  >
                    Four working apps for real problems: college applications,
                    studying, mentorship, and neighborhoods. Every one leaves
                    the final call to you.
                  </p>
                  <div className="mt-10 hidden lg:mt-[clamp(2.5rem,7svh,5rem)] lg:block">
                    <PreviewSlot
                      slotRef={(el) => {
                        words.current = el;
                      }}
                    />
                  </div>
                </div>

                <div className="idea-figure-box relative z-10 mx-auto mt-12 w-full max-w-[26rem] lg:absolute lg:mt-0 lg:max-w-none">
                  <IdeaFigure
                    paths={paths}
                    svgRef={(el) => {
                      figure.current = el;
                    }}
                    delay={pan ? 0 : 650}
                  />
                </div>

                {/* Below 1024px the preview sits under the figure instead of beside it */}
                <div className="relative z-10 mx-auto mt-4 w-full max-w-[26rem] lg:hidden">
                  <PreviewSlot />
                </div>

                <a
                  href="#directions"
                  onClick={toWork}
                  className={`${CONTINUE} relative z-10 mt-10 lg:mt-0`}
                >
                  Continue to the work
                  <LineArrow />
                </a>
              </AbilityArea>
            </AbilityProvider>
          </section>
        </div>
      </div>
    </div>
  );
}
