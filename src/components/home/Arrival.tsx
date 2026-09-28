import type { CSSProperties } from "react";
import { SITE, VERB_ORDER, projectBySlug, projectByVerb } from "@/lib/projects";
import { Fragment } from "../thread/Fragment";
import { ThreadLayer } from "../thread/ThreadLayer";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * The introduction, built in planes: soft color fields and grain at the back; screenshot
 * fragments (two behind the thread, two in front of it); the thread itself, drawn out of the
 * end of her name and under the headline; the type; and the invitation to follow it.
 * Every word is server-rendered and readable before any animation code loads.
 */
export function Arrival() {
  const [portico, synaptiq, concord, commonground] = [
    "portico",
    "synaptiq",
    "concord",
    "commonground",
  ].map((s) => projectBySlug(s)!);

  return (
    <section
      aria-labelledby="home-title"
      className="atmosphere grain relative overflow-hidden"
    >
      {/* Visual layer, behind the thread (desktop only: on phones the statement owns the screen) */}
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
        <Fragment
          project={portico}
          focus={[0.55, 0.42]}
          zoom={1.5}
          sizes="30vw"
          className="hero-fragment drift absolute right-[4%] top-[9%] aspect-[4/3] w-[25vw] max-w-[360px] opacity-80"
          style={{ "--drift": "18px" } as CSSProperties}
          priority
        />
        <Fragment
          project={concord}
          focus={[0.25, 0.4]}
          zoom={1.9}
          sizes="24vw"
          className="hero-fragment drift absolute bottom-[14%] right-[27%] aspect-square w-[17vw] max-w-[250px] opacity-70"
          style={{ "--drift": "34px" } as CSSProperties}
        />
      </div>

      <ThreadLayer variant="hero" className="z-10" />

      {/* Visual layer, in front of the thread */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      >
        <Fragment
          project={synaptiq}
          focus={[0.4, 0.45]}
          zoom={1.7}
          sizes="22vw"
          className="hero-fragment drift absolute right-[3%] top-[48%] aspect-[5/4] w-[19vw] max-w-[280px]"
          style={{ "--drift": "48px" } as CSSProperties}
        />
        <Fragment
          project={commonground}
          focus={[0.45, 0.35]}
          zoom={1.6}
          sizes="20vw"
          className="hero-fragment drift absolute right-[30%] top-[6%] aspect-[3/2] w-[14vw] max-w-[210px] opacity-90"
          style={{ "--drift": "26px" } as CSSProperties}
        />
      </div>

      <div className="shell relative z-30 flex min-h-[calc(100svh-4rem)] flex-col pb-10 pt-6">
        {/* Identity and bearings */}
        <div className="annot flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
          <p className="enter-fade" style={delay(0)}>
            Student developer · Panama · 12th grade
          </p>
          <p className="hidden md:block">9° N, 79.5° W · Four systems</p>
        </div>

        <div className="flex flex-1 flex-col justify-center py-8 lg:max-w-[62%]">
          {/* The name, and at its end the point where the thread begins */}
          <p
            className="enter-rise relative self-start font-display text-[clamp(2.2rem,4.4vw,3.6rem)] italic leading-none"
            style={delay(0)}
          >
            Bhakti Ahir
            <span
              data-thread="exit"
              aria-hidden="true"
              className="absolute -right-3 bottom-[0.18em] h-px w-px"
            />
          </p>

          <h1
            id="home-title"
            className="enter-reveal mt-6 font-display text-[clamp(3.4rem,8.4vw,7.4rem)] leading-[0.9] tracking-[-0.02em]"
            style={delay(250)}
          >
            <span data-thread="headline" className="inline-block">
              I build ways forward.
            </span>
          </h1>

          <p
            className="body-copy enter-rise mt-9 max-w-[36rem] text-ink"
            style={delay(500)}
          >
            When decisions feel overwhelming, learning feels unclear, the right
            guidance feels difficult to find, or local knowledge has nowhere to
            go—I build systems that help people move forward.
          </p>

          <p
            className="enter-rise mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl sm:text-3xl"
            style={delay(700)}
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
            className="enter-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={delay(900)}
          >
            <a
              href="#questions"
              className="press group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
            >
              Follow the thread
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
            <p className="font-display text-xl italic text-muted">
              {SITE.philosophy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
