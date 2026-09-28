import type { Metadata } from "next";
import { NextPage } from "@/components/NextPage";
import { PageMasthead } from "@/components/PageMasthead";
import { Reveal } from "@/components/Reveal";
import { ThreadLayer } from "@/components/thread/ThreadLayer";
import { inline } from "@/lib/format";
import { STAGES, THREADS } from "@/lib/journey";
import { SITE, projectBySlug } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "How four projects built on each other, from Portico to CommonGround: the problem behind each one, what failed, and what carried into the next.",
  alternates: { canonical: "/journey" },
};

const label = (id: string) => STAGES.find((s) => s.id === id)!.label;

/** Stages alternate sides on wide screens, so the thread has to travel to reach each one. */
const SIDE = [
  "lg:col-span-6 lg:col-start-1",
  "lg:col-span-6 lg:col-start-7",
  "lg:col-span-6 lg:col-start-2",
  "lg:col-span-6 lg:col-start-6",
];

export default function JourneyPage() {
  return (
    <>
      <PageMasthead
        number="02"
        label="Journey"
        title={
          <>
            I didn’t begin with years of programming experience.{" "}
            <span className="text-muted">
              I began with a problem I wanted to solve.
            </span>
          </>
        }
      >
        <p>
          I started from zero, with my first line of Python. Each project began
          where the last one left off, and each one had more moving parts.
        </p>
        <a
          href={SITE.journeyRepo}
          className="link-draw mt-4 inline-block text-sm font-semibold text-ink"
        >
          The learning-journey repo ↗
        </a>
      </PageMasthead>

      {/* The thread runs from stage to stage, drawing itself as you read down */}
      <section
        aria-label="Four projects in order, Portico to CommonGround"
        className="relative pb-20 pt-8 sm:pb-28"
      >
        <ThreadLayer variant="sequence" />
        <ol className="shell grid-12 relative gap-y-24 sm:gap-y-32">
          {STAGES.map((s, i) => {
            const p = projectBySlug(s.id)!;
            const next = STAGES[i + 1];
            return (
              <li key={s.id} className={`accent-${s.id} ${SIDE[i]}`}>
                <Reveal>
                  <article
                    aria-labelledby={`stage-${s.id}`}
                    className="relative pl-9"
                  >
                    <span
                      data-thread={`n-${s.id}`}
                      aria-hidden="true"
                      className="absolute left-0 top-2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-a1 bg-paper"
                    />
                    <p className="annot text-a1">
                      {p.chapter} / 0{STAGES.length} ·{" "}
                      <span className="capitalize">{p.verb}</span>
                    </p>
                    <h2
                      id={`stage-${s.id}`}
                      className="mt-2 font-display text-[clamp(2.6rem,5vw,4rem)] leading-none"
                    >
                      {s.label}
                    </h2>
                    <p className="mt-4 font-display text-[1.45rem] italic leading-snug text-muted">
                      {s.started}
                    </p>

                    <dl className="mt-9 space-y-7">
                      <div>
                        <dt className="annot text-ink">What it introduced</dt>
                        <dd className="mt-2 text-[1.02rem] leading-relaxed">
                          {s.introduced.join(" · ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="annot text-ink">What failed</dt>
                        <dd className="body-copy mt-1.5 text-muted">
                          {p.caseStudy.challenge.heading}.
                        </dd>
                      </div>
                      <div>
                        <dt className="annot text-ink">What I learned</dt>
                        <dd className="mt-1.5 font-display text-[1.5rem] leading-snug">
                          {p.caseStudy.learned[0]}
                        </dd>
                      </div>
                      <div>
                        <dt className="annot text-a1">
                          {next ? `Carried into ${next.label} →` : "Still open"}
                        </dt>
                        <dd className="body-copy mt-1.5 text-muted">
                          {s.carried}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      <section
        aria-labelledby="lessons-title"
        className="tone-ivory border-t border-line bg-paper py-20 sm:py-28"
      >
        <Reveal className="shell">
          <div className="grid-12 gap-y-6">
            <h2
              id="lessons-title"
              className="font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-tight lg:col-span-4"
            >
              Lessons that kept coming back
            </h2>
            <ul className="lg:col-span-8">
              {THREADS.map((thread) => (
                <li
                  key={thread.title}
                  className="grid gap-2 border-t border-line py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-8"
                >
                  <div>
                    <p className="text-lg font-semibold leading-snug">
                      {thread.title}
                    </p>
                    <p className="annot mt-1 normal-case tracking-normal">
                      {thread.stages.map(label).join(" → ")}
                    </p>
                  </div>
                  <p className="text-[0.98rem] leading-relaxed text-muted">
                    {inline(thread.note)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <NextPage href="/about" number="03" label="About" />
    </>
  );
}
