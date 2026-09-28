import Link from "next/link";
import { AbilityProvider, AbilityRow } from "../verbs/ability";
import { JudgmentFigure } from "../verbs/JudgmentFigure";

/**
 * Act I, the opening scene. Every word is server-rendered and readable on the first frame; the
 * one orchestrated moment is the four paths drawing in to meet at Human Judgment. The four
 * abilities in the text and the figure share one state: point at one and both answer.
 */
export function Arrival() {
  return (
    <section
      aria-labelledby="home-title"
      className="grain grid-field relative border-b border-line"
    >
      <div className="shell flex flex-col pb-12 pt-6 sm:pb-16 lg:min-h-[calc(100svh-4rem)]">
        <div className="annot flex justify-between gap-4 border-b border-line pb-3">
          <span>00 · Index</span>
          <span className="hidden sm:inline">Panama · 9° N, 79.5° W</span>
          <span>Four systems</span>
        </div>

        <AbilityProvider>
          <div className="grid-12 flex-1 gap-y-12 pt-12 sm:pt-16 lg:items-center lg:pt-8">
            <div className="lg:col-span-6">
              <p className="font-display text-[clamp(1.7rem,2.8vw,2.5rem)] italic leading-none">
                Bhakti Ahir
              </p>
              <h1
                id="home-title"
                className="mt-5 font-display text-[clamp(3.3rem,8.6vw,7.8rem)] leading-[0.9] tracking-[-0.025em]"
              >
                I build ways forward.
              </h1>
              <p className="body-copy mt-8 max-w-[34rem] text-ink">
                When decisions feel overwhelming, learning feels unclear, the
                right guidance feels difficult to find, or local knowledge has
                nowhere to go—I build systems that help people move forward.
              </p>
              <div className="mt-8">
                <AbilityRow />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
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

            <div className="lg:col-span-6">
              <JudgmentFigure />
            </div>
          </div>
        </AbilityProvider>
      </div>
    </section>
  );
}
