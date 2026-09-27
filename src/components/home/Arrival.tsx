import Link from "next/link";
import type { CSSProperties } from "react";
import { SITE, VERB_ORDER, projectByVerb } from "@/lib/projects";
import { Monogram } from "../Monogram";
import { JudgmentFigure } from "../verbs/JudgmentFigure";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Act I. Who Bhakti is, readable on the first frame: every word is server-rendered and the
 * entrance animation only eases it in. The figure beside it is the site's one visual system.
 */
export function Arrival() {
  return (
    <section
      aria-labelledby="home-title"
      className="grain grid-field relative border-b border-line"
    >
      <div className="shell flex min-h-[calc(100svh-4rem)] flex-col pb-8 pt-6">
        <div className="annot flex justify-between gap-4 border-b border-line pb-3">
          <span>00 · Index</span>
          <span className="hidden sm:inline">Panamá · 9° N, 79.5° W</span>
          <span>Four systems</span>
        </div>

        <div className="grid-12 flex-1 content-center gap-y-12 py-12 lg:items-center">
          <div className="lg:col-span-7">
            <Monogram
              draw
              title={null}
              className="h-14 w-auto text-ink sm:h-16"
            />
            <h1
              id="home-title"
              className="enter-reveal mt-7 font-display text-[clamp(3.4rem,11vw,9.5rem)] uppercase leading-[0.86] tracking-[-0.02em]"
              style={delay(400)}
            >
              Bhakti Ahir
            </h1>
            <p
              className="body-copy enter-rise mt-7 max-w-[30rem] text-ink"
              style={delay(750)}
            >
              {SITE.tagline}
            </p>
            <p
              className="enter-rise mt-6 max-w-[34rem] font-display text-[clamp(1.8rem,3.4vw,2.7rem)] italic leading-[1.08]"
              style={delay(950)}
            >
              “{SITE.philosophy}”
            </p>
            <p
              className="enter-rise mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl sm:text-3xl"
              style={delay(1150)}
            >
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
            <div
              className="enter-rise mt-10 flex flex-wrap items-center gap-3"
              style={delay(1300)}
            >
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

          <div className="enter-fade lg:col-span-5" style={delay(600)}>
            <JudgmentFigure />
          </div>
        </div>
      </div>
    </section>
  );
}
