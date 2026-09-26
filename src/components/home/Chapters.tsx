import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { Plate } from "../Plate";
import { Reveal } from "../Reveal";

export function Chapters() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="annot flex justify-between border-t border-ink pt-3">
          <span>Part I · The work</span>
          <span>Chapters 01–04</span>
        </div>
        <h2
          id="work-title"
          className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.95]"
        >
          Four abilities.{" "}
          <span className="italic text-muted">Four chapters.</span>
        </h2>
        <p className="mt-5 max-w-xl text-muted">
          Each project gives people more room to do one thing well, and each one
          leaves the final call with the person. Every one is live. The problems
          below are the real ones from each project’s development log.
        </p>
      </div>

      {PROJECTS.map((p, i) => {
        const flip = i % 2 === 1;
        return (
          <article
            key={p.slug}
            id={p.slug}
            aria-labelledby={`${p.slug}-title`}
            className={`accent-${p.slug} scroll-mt-16 border-b border-line py-20 sm:py-28`}
          >
            <Reveal className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
              <div
                className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}
              >
                <p className="annot">Chapter {p.chapter}</p>
                <p
                  aria-hidden="true"
                  className="mt-4 font-display text-[clamp(4.2rem,12vw,8.4rem)] italic capitalize leading-[0.85] text-a1"
                >
                  {p.verb}.
                </p>
                <h3
                  id={`${p.slug}-title`}
                  className="mt-6 font-display text-4xl leading-tight"
                >
                  <span className="sr-only">{p.verb}: </span>
                  {p.name}
                  <span className="text-muted"> — {p.tagline}</span>
                </h3>
                <p className="mt-4 max-w-prose leading-relaxed text-muted">
                  {p.intro}
                </p>

                <div className="mt-8 border-l-2 border-a1 pl-5">
                  <p className="annot text-a1">The hardest problem</p>
                  <p className="mt-2 max-w-prose leading-relaxed">
                    {p.hardestProblem}
                  </p>
                </div>

                <p className="annot mt-8 leading-relaxed normal-case tracking-normal">
                  {p.stack.join("  /  ")}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/work/${p.slug}`}
                    className="annot inline-flex h-11 items-center rounded-full bg-a1 px-6 text-paper hover:opacity-90"
                  >
                    Read the case study →
                  </Link>
                  <a
                    href={p.live}
                    className="annot inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-ink hover:bg-soft"
                  >
                    Live app ↗
                  </a>
                  <a
                    href={p.repo}
                    className="annot inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-ink hover:bg-soft"
                  >
                    Code ↗
                  </a>
                </div>
                <p className="mt-4 max-w-prose text-sm text-muted">
                  {p.liveNote}
                </p>
              </div>

              <div
                className={`lg:col-span-7 lg:pt-16 ${flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : ""}`}
              >
                <Plate project={p} figure={p.chapter} />
                <p className="annot mt-3">
                  <span className="normal-case">
                    {p.repo.replace("https://github.com/", "")}
                  </span>
                </p>
              </div>
            </Reveal>
          </article>
        );
      })}
    </section>
  );
}
