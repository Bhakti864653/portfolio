import { inline } from "@/lib/format";
import { STAGES, THREADS } from "@/lib/journey";
import { SITE } from "@/lib/projects";
import { ChapterOpening } from "../ChapterOpening";
import { Reveal } from "../Reveal";

const label = (id: string) => STAGES.find((s) => s.id === id)!.label;

export function Journey() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="scroll-mt-16 border-y border-line bg-soft py-24 sm:py-32"
    >
      <div className="shell">
        <ChapterOpening
          part="II"
          label="Development journey"
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
            className="mt-4 inline-block text-sm font-semibold text-ink underline underline-offset-4"
          >
            The learning-journey repo ↗
          </a>
        </ChapterOpening>

        {/* The progression: horizontal from 1024px, vertical below */}
        <Reveal className="mt-16 sm:mt-20">
          <ol className="relative grid gap-12 border-l border-line-strong pl-7 lg:grid-cols-4 lg:gap-0 lg:border-l-0 lg:border-t lg:pl-0">
            {STAGES.map((stage, i) => (
              <li
                key={stage.id}
                className={`accent-${stage.id} relative lg:border-l lg:border-line lg:px-6 lg:pt-8 lg:first:border-l-0 lg:first:pl-0`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(1.75rem+5px)] top-1.5 h-[9px] w-[9px] rounded-full bg-a1 lg:-top-[5px] lg:left-auto"
                />
                <p className="annot text-a1">0{i + 1}</p>
                <h3 className="mt-2 font-display text-3xl leading-none">
                  {stage.label}
                </h3>

                <p className="annot mt-6">Introduced</p>
                <ul className="mt-2 space-y-1.5 text-[0.98rem] leading-snug">
                  {stage.introduced.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <p className="annot mt-6">
                  System · {stage.system.length} parts
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {stage.system.map((part) => (
                    <li
                      key={part}
                      className="rounded-full border border-line-strong px-2.5 py-1 text-[0.8rem] leading-none"
                    >
                      {part}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-line pt-4">
                  <p className="annot">
                    {i < STAGES.length - 1 ? "Carried forward →" : "Still open"}
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">
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
      </div>
    </section>
  );
}
