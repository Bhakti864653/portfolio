import type { Metadata } from "next";
import { Progression } from "@/components/journey/Progression";
import { NextPage } from "@/components/NextPage";
import { PageMasthead } from "@/components/PageMasthead";
import { Reveal } from "@/components/Reveal";
import { inline } from "@/lib/format";
import { STAGES, THREADS } from "@/lib/journey";
import { SITE } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "Four projects and what each one taught me: the problem behind it, what it introduced, what failed, and the lesson I keep.",
  alternates: { canonical: "/journey" },
};

const label = (id: string) => STAGES.find((s) => s.id === id)!.label;

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
          Each project started with a problem someone really has, and each one
          asked me to learn something I had never done before.
        </p>
        <a
          href={SITE.journeyRepo}
          className="link-draw mt-4 inline-block text-sm font-semibold text-ink"
        >
          The learning-journey repo ↗
        </a>
      </PageMasthead>

      <section aria-label="Four projects" className="shell pb-20 pt-6 sm:pb-28">
        <Progression />
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
              Lessons across the four projects
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
                    <ul
                      aria-label="Projects"
                      className="mt-2 flex flex-wrap gap-1.5"
                    >
                      {thread.stages.map((id) => (
                        <li key={id} title={label(id)}>
                          <span
                            aria-hidden="true"
                            className="block h-3 w-3 rounded-full"
                            style={{ background: `var(--${id}-1)` }}
                          />
                          <span className="sr-only">{label(id)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[1.02rem] leading-relaxed text-ink">
                      {thread.plain}
                    </p>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">
                      {inline(thread.note)}
                    </p>
                  </div>
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
