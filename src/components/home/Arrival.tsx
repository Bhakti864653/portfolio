import Link from "next/link";
import type { CSSProperties } from "react";
import { SITE, VERB_ORDER, projectByVerb } from "@/lib/projects";
import { JudgmentFigure } from "../verbs/JudgmentFigure";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Act I. Who Bhakti is and what she builds, readable on the first frame: every word is
 * server-rendered and never waits on an animation. Only the figure beside it fades in.
 */
export function Arrival() {
  return (
    <section
      aria-labelledby="home-title"
      className="grain grid-field relative border-b border-line"
    >
      <div className="shell pb-12 pt-6 sm:pb-16">
        <div className="annot flex justify-between gap-4 border-b border-line pb-3">
          <span>00 · Index</span>
          <span className="hidden sm:inline">Panama · 9° N, 79.5° W</span>
          <span>Four systems</span>
        </div>

        <div className="grid-12 gap-y-12 pt-12 sm:pt-16 lg:items-center">
          <div className="lg:col-span-7">
            <p className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] italic leading-none">
              Bhakti Ahir
            </p>
            <h1
              id="home-title"
              className="mt-5 font-display text-[clamp(3rem,7.6vw,6.6rem)] leading-[0.92] tracking-[-0.02em]"
            >
              I build ways forward.
            </h1>
            <p className="body-copy mt-7 max-w-[34rem] text-ink">
              When decisions feel overwhelming, learning feels unclear, the
              right guidance feels difficult to find, or local knowledge has
              nowhere to go—I build systems that help people move forward.
            </p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl sm:text-3xl">
              {VERB_ORDER.map((verb, i) => (
                <span key={verb} className="flex items-baseline gap-3">
                  <span
                    className={`accent-${projectByVerb(verb).slug} capitalize text-a1`}
                  >
                    {verb}
                  </span>
                  {i < VERB_ORDER.length - 1 && (
                    <span aria-hidden="true" className="text-faint">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-[34rem] font-display text-xl italic text-muted">
              {SITE.philosophy}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="press group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
              >
                Enter the work
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <a
                href="#directions"
                className="annot link-draw px-2 py-3 text-ink"
              >
                Or choose a direction ↓
              </a>
            </div>
          </div>

          <div className="enter-fade lg:col-span-5" style={delay(200)}>
            <JudgmentFigure />
          </div>
        </div>
      </div>
    </section>
  );
}
