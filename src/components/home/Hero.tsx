import type { CSSProperties } from "react";
import { svgPath } from "@/lib/geometry";
import { SITE, VERB_ORDER, projectByVerb } from "@/lib/projects";
import { Monogram } from "../Monogram";
import { VerbSystem } from "../verbs/VerbSystem";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Four short paths leaving one point: the idea of the site, at the size of a word. */
function PathsGlyph() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-9 w-9 shrink-0"
      aria-hidden="true"
      fill="none"
    >
      {VERB_ORDER.map((verb, i) => (
        <path
          key={verb}
          d={svgPath(verb, 24, 24, 21)}
          className={`accent-${projectByVerb(verb).slug} enter-draw`}
          stroke="var(--a1)"
          strokeWidth={1.6}
          strokeLinecap="round"
          style={
            { "--len": 40, "--delay": `${1500 + i * 120}ms` } as CSSProperties
          }
        />
      ))}
      <circle
        cx="24"
        cy="24"
        r="2.6"
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * Chapter 00. First screen: who Bhakti is, in under three seconds (the mark draws, the name
 * reveals, the philosophy follows, four paths leave the center). Nothing waits on the animation.
 * Below it: the index, where the four-path system introduces the work.
 */
export function Hero() {
  return (
    <section
      id="index"
      aria-labelledby="hero-title"
      className="grain grid-field relative"
    >
      {/* The opening screen */}
      <div className="shell flex min-h-[calc(100svh-4rem)] flex-col pb-8 pt-6">
        <div className="annot flex justify-between gap-4 border-b border-line pb-3">
          <span>00 · Index</span>
          <span className="hidden sm:inline">Panamá · 9° N, 79.5° W</span>
          <span>Portfolio · 2026</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-14">
          <Monogram
            draw
            title={null}
            className="h-16 w-auto self-start text-ink sm:h-20"
          />

          <h1
            id="hero-title"
            className="enter-reveal mt-8 font-display text-[clamp(3.6rem,13.5vw,12.5rem)] uppercase leading-[0.84] tracking-[-0.02em]"
            style={delay(450)}
          >
            Bhakti Ahir
          </h1>

          <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-12 lg:gap-10">
            <p
              className="body-copy enter-rise max-w-[26rem] text-ink lg:col-span-4"
              style={delay(900)}
            >
              Student developer building human-centered tools for learning,
              opportunity, and community.
            </p>
            <p
              className="enter-rise font-display text-[clamp(1.9rem,4vw,3.1rem)] italic leading-[1.08] lg:col-span-7 lg:col-start-6"
              style={delay(1150)}
            >
              “{SITE.philosophy}”
            </p>
          </div>

          <div
            className="enter-rise mt-12 flex items-center gap-4 border-t border-line pt-5"
            style={delay(1450)}
          >
            <PathsGlyph />
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl sm:text-3xl">
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
          </div>
        </div>

        <a
          href="#paths"
          className="enter-fade annot group flex items-center gap-3 self-start text-ink"
          style={delay(2200)}
        >
          <span className="scroll-cue inline-block">↓</span>
          <span className="link-draw">Begin · four chapters</span>
        </a>
      </div>

      {/* The index: the four-path system, now that the visitor knows whose work this is */}
      <div id="paths" className="scroll-mt-16 border-t border-line">
        <div className="shell grid-12 gap-y-14 py-20 sm:py-28 lg:items-center">
          <div className="lg:col-span-5">
            <p className="annot text-ink">The idea</p>
            <p className="body-copy mt-5 max-w-[30rem]">{SITE.statement}</p>
            <p className="body-copy mt-5 max-w-[30rem] text-muted">
              Four abilities, four projects, one fixed point in the middle: the
              person using the tool.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="press inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
              >
                Explore the work ↓
              </a>
              <a
                href={SITE.github}
                className="press inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft"
              >
                GitHub ↗
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="press inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft"
              >
                Email
              </a>
            </div>

            <p className="annot mt-10 border-t border-line pt-4">
              12th grade · The Oxford School, Panama · Computer Science
            </p>
          </div>

          <div className="lg:col-span-7">
            <VerbSystem />
          </div>
        </div>
      </div>
    </section>
  );
}
