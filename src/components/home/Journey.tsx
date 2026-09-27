import { inline } from "@/lib/format";
import { STAGES, THREADS } from "@/lib/journey";
import { SITE } from "@/lib/projects";
import { ChapterClose, ChapterOpening } from "../ChapterOpening";
import { Reveal } from "../Reveal";

const label = (id: string) => STAGES.find((s) => s.id === id)!.label;

export function Journey() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="tone-cool scroll-mt-16 bg-paper py-24 sm:py-32"
    >
      <div className="shell">
        <ChapterOpening
          number="02"
          title="Journey"
          id="journey-title"
          heading={
            <>
              “I didn’t begin with years of programming experience.{" "}
              <span className="text-muted">
                I began with a problem I wanted to solve.”
              </span>
            </>
          }
        >
          <p>
            I started from zero, with my first line of Python. Each project
            began where the last one left off, and each one had more moving
            parts.
          </p>
          <a
            href={SITE.journeyRepo}
            className="link-draw mt-4 inline-block text-sm font-semibold text-ink"
          >
            The learning-journey repo ↗
          </a>
        </ChapterOpening>

        {/* The route: one continuous line through all four projects, each segment in its
            project's color. Horizontal from 1024px, vertical below. */}
        <Reveal className="mt-16 sm:mt-20">
          <ol className="grid lg:grid-cols-4">
            {STAGES.map((stage, i) => (
              <li
                key={stage.id}
                className={`accent-${stage.id} relative border-l-2 border-a1 pb-12 pl-7 lg:flex lg:flex-col lg:border-l-0 lg:border-t-2 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-9`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[7px] top-0 h-3 w-3 rounded-full border-2 border-a1 bg-paper lg:-top-[7px] lg:left-0"
                />
                {i === STAGES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 -left-[7px] text-a1 lg:-top-[0.72rem] lg:bottom-auto lg:left-auto lg:right-0"
                  >
                    <span className="lg:hidden">↓</span>
                    <span className="hidden lg:inline">→</span>
                  </span>
                )}
                <p className="annot text-a1">
                  0{i + 1}
                  <span className="text-muted"> / 0{STAGES.length}</span>
                </p>
                <h3 className="mt-2 font-display text-[2.2rem] leading-none">
                  {stage.label}
                </h3>

                <p className="annot mt-7 text-ink">Introduced</p>
                <ul className="mt-2 space-y-1.5 text-[0.98rem] leading-snug">
                  {stage.introduced.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-a1">
                        +
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="annot mt-7 text-ink">
                  System · {stage.system.length} parts
                </p>
                <div aria-hidden="true" className="mt-2 flex gap-1">
                  {Array.from(
                    { length: Math.max(...STAGES.map((s) => s.system.length)) },
                    (_, k) => (
                      <span
                        key={k}
                        className={`h-1.5 w-6 rounded-full ${k < stage.system.length ? "bg-a1" : "bg-line"}`}
                      />
                    ),
                  )}
                </div>
                <ul className="mb-7 mt-3 flex flex-wrap gap-1.5">
                  {stage.system.map((part) => (
                    <li
                      key={part}
                      className="rounded-full border border-line-strong bg-soft px-2.5 py-1 text-[0.8rem] leading-none"
                    >
                      {part}
                    </li>
                  ))}
                </ul>

                <div className="border-l-2 border-a1 bg-soft py-3 pl-4 pr-3 lg:mt-auto">
                  <p className="annot text-ink">
                    {i < STAGES.length - 1
                      ? `Carried forward → ${STAGES[i + 1].label}`
                      : "Still open"}
                  </p>
                  <p className="mt-1.5 text-[0.98rem] leading-relaxed text-muted">
                    {stage.carried}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* One supporting list: the ideas that kept coming back */}
        <Reveal className="mt-20 sm:mt-24">
          <div className="grid-12 gap-y-6">
            <h3 className="font-display text-2xl lg:col-span-4">
              Lessons that kept coming back
            </h3>
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

        <ChapterClose
          number="02"
          next={{ href: "#about", label: "03 About" }}
        />
      </div>
    </section>
  );
}
