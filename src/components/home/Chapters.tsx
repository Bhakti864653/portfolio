import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { ChapterOpening } from "../ChapterOpening";
import { Plate } from "../Plate";
import { Reveal } from "../Reveal";

const secondary =
  "inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft";

export function Chapters() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-16 py-24 sm:py-32"
    >
      <div className="shell">
        <ChapterOpening
          part="I"
          label="The work"
          id="work-title"
          heading="Four systems, one principle."
        >
          <p>
            Each project helps people do one thing well, and each one leaves the
            final call with the person. Every one is live.
          </p>
        </ChapterOpening>

        <ol className="mt-16 sm:mt-20">
          {PROJECTS.map((p) => (
            <li
              key={p.slug}
              id={p.slug}
              className={`accent-${p.slug} scroll-mt-20 border-t-2 border-a1 py-14 sm:py-20`}
            >
              <Reveal>
                <article
                  aria-labelledby={`${p.slug}-title`}
                  className="grid-12 gap-y-10"
                >
                  <div className="lg:col-span-5">
                    <p className="annot flex items-baseline gap-3">
                      <span className="font-display text-5xl normal-case leading-none tracking-normal text-a1">
                        {p.chapter}
                      </span>
                      <span className="capitalize">{p.verb}</span>
                    </p>
                    <h3
                      id={`${p.slug}-title`}
                      className="mt-6 font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none"
                    >
                      <span className="sr-only">{p.verb}: </span>
                      {p.name}
                    </h3>
                    <p className="mt-3 text-lg leading-snug text-ink">
                      {p.tagline}
                    </p>
                    <p className="body-copy mt-5 max-w-[34rem] text-muted">
                      {p.summary}
                    </p>

                    <div className="mt-8 border-l-2 border-a1 pl-5">
                      <p className="annot">Engineering challenge</p>
                      <p className="body-copy mt-2 max-w-[34rem]">
                        {p.hardestProblem}
                      </p>
                    </div>

                    <p className="annot mt-8 normal-case tracking-normal">
                      {p.stack.join(" · ")}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href={`/work/${p.slug}`}
                        className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
                      >
                        Read the case study →
                      </Link>
                      <a href={p.live} className={secondary}>
                        Live app ↗
                      </a>
                      <a href={p.repo} className={secondary}>
                        Code ↗
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 lg:pt-2">
                    <Plate project={p} figure={p.chapter} />
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
