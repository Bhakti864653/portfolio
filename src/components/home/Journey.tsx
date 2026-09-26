import { inline } from "@/lib/format";
import { STAGES, THREADS, type Stage } from "@/lib/journey";
import { SITE } from "@/lib/projects";
import { Reveal } from "../Reveal";

const accentClass = (id: Stage["id"]) => (id === "start" ? "" : `accent-${id}`);

/** The five columns every row below lines up with. */
const TRACK = "grid grid-cols-5";

export function Journey() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="scroll-mt-16 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="annot flex justify-between border-t border-ink pt-3">
          <span>Part II · The journey</span>
          <span>From zero to four projects</span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <h2
            id="journey-title"
            className="font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[0.98] lg:col-span-7"
          >
            “I didn’t begin with years of programming experience.{" "}
            <span className="italic text-muted">
              I began with a problem I wanted to solve.
            </span>
            ”
          </h2>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
            <p className="leading-relaxed text-muted">
              I started from zero, with my first line of Python. Each project
              since then started where the last one left off. The same lessons
              kept coming back, each time applied to something harder.
            </p>
            <a
              href={SITE.journeyRepo}
              className="annot mt-5 inline-block text-ink underline underline-offset-4"
            >
              The learning-journey repo ↗
            </a>
          </div>
        </div>

        <Reveal className="mt-16">
          {/* Stages: a line that grows as each project begins */}
          <ol
            className="relative grid gap-8 lg:grid-cols-5 lg:gap-4"
            aria-label="Stages"
          >
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-2 bottom-2 w-px bg-line-strong lg:left-0 lg:right-0 lg:top-[7px] lg:bottom-auto lg:h-px lg:w-auto"
            />
            {STAGES.map((stage, i) => (
              <li
                key={stage.id}
                className={`${accentClass(stage.id)} relative pl-8 lg:pl-0 lg:pt-8`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0.5 h-[15px] w-[15px] rounded-full border-2 lg:top-0 ${
                    stage.id === "start"
                      ? "border-ink bg-paper"
                      : "border-a1 bg-a1"
                  }`}
                  style={{ transform: `scale(${0.7 + i * 0.12})` }}
                />
                <p className="font-display text-3xl leading-none">
                  {stage.label}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {stage.firsts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {/* Threads: lessons that carried forward, drawn across the same five columns */}
          <div className="mt-20">
            <p className="annot border-b border-line pb-3">
              What carried forward
            </p>
            <div
              aria-hidden="true"
              className={`${TRACK} annot mt-3 lg:ml-[40%]`}
            >
              {STAGES.map((s) => (
                <span
                  key={s.id}
                  className="truncate text-center text-[0.6rem] sm:text-[0.68rem]"
                >
                  {s.id === "start" ? "Start" : s.label}
                </span>
              ))}
            </div>
            <ul>
              {THREADS.map((thread) => {
                const indices = thread.stages.map((id) =>
                  STAGES.findIndex((s) => s.id === id),
                );
                const first = Math.min(...indices);
                const last = Math.max(...indices);
                return (
                  <li
                    key={thread.title}
                    className="grid gap-3 border-b border-line py-6 lg:grid-cols-[40%_1fr] lg:items-center lg:gap-0"
                  >
                    <div className="lg:pr-10">
                      <p className="font-display text-2xl leading-tight">
                        {thread.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {inline(thread.note)}
                      </p>
                      <p className="sr-only">
                        Appears in:{" "}
                        {thread.stages
                          .map((id) => STAGES.find((s) => s.id === id)!.label)
                          .join(", ")}
                        .
                      </p>
                    </div>
                    <div
                      aria-hidden="true"
                      className={`${TRACK} relative items-center`}
                    >
                      <span
                        className="absolute top-1/2 h-px bg-ink"
                        style={{
                          left: `${(first + 0.5) * 20}%`,
                          width: `${(last - first) * 20}%`,
                        }}
                      />
                      {STAGES.map((stage, i) => {
                        const on = thread.stages.includes(stage.id);
                        return (
                          <span
                            key={stage.id}
                            className={`${accentClass(stage.id)} relative flex justify-center`}
                          >
                            <span
                              className={`h-3.5 w-3.5 rounded-full border-2 ${
                                on
                                  ? "border-a1 bg-a1"
                                  : i > first && i < last
                                    ? "border-line-strong bg-paper"
                                    : "border-transparent"
                              }`}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
