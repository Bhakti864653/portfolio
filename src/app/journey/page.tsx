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
    "How four projects built on each other, from Portico to CommonGround: the problem behind each one, what failed, and what carried into the next.",
  alternates: { canonical: "/journey" },
};

const label = (id: string) => STAGES.find((s) => s.id === id)!.label;

export default function JourneyPage() {
  return (
    <div className="tone-cool bg-paper">
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

      <section
        aria-label="Four projects in order"
        className="shell pb-20 pt-6 sm:pb-28"
      >
        <Progression />
      </section>

      <section
        aria-labelledby="lessons-title"
        className="border-t border-line py-20 sm:py-28"
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
    </div>
  );
}
