import type { Metadata } from "next";
import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { Plate } from "@/components/Plate";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Four systems built to create a way forward: Portico helps people decide, Synaptiq helps them learn, Concord helps them connect, and CommonGround helps them act.",
  alternates: { canonical: "/work" },
};

const secondary =
  "press inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft";

export default function WorkIndex() {
  return (
    <>
      <PageMasthead number="01" label="Work" title="Four ways forward">
        Four projects built around four things people do: decide, learn,
        connect, and act. Each began where someone was stuck.
      </PageMasthead>

      {/* One project per row. A single line runs down the left edge through all four, each
          stretch in its project's color, so the page reads as one sequence. */}
      <ol className="shell pb-16 sm:pb-24">
        {PROJECTS.map((p, i) => (
          <li
            key={p.slug}
            className={`accent-${p.slug} relative border-l-2 border-a1 pl-6 sm:pl-10 lg:pl-14`}
          >
            <span
              aria-hidden="true"
              className="absolute -left-[9px] top-14 h-4 w-4 rounded-full border-2 border-a1 bg-paper sm:top-20"
            />
            <article
              aria-labelledby={`${p.slug}-title`}
              className="grid-12 gap-y-10 py-14 sm:py-20 lg:items-center"
            >
              <div
                className={`lg:col-span-7 lg:row-start-1 ${i % 2 ? "lg:col-start-6" : "lg:col-start-1"}`}
              >
                <Plate project={p} figure={p.chapter} priority={i === 0} />
              </div>

              <div
                className={`lg:col-span-5 lg:row-start-1 ${i % 2 ? "lg:col-start-1 lg:pr-6" : "lg:col-start-8 lg:pl-6"}`}
              >
                <p className="annot flex items-baseline gap-3">
                  <span className="text-a1">{p.chapter}</span>
                  <span className="capitalize text-ink">{p.verb}</span>
                </p>
                <h2
                  id={`${p.slug}-title`}
                  className="mt-4 font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-a1"
                >
                  <span className="sr-only">{p.verb}: </span>
                  {p.name}
                </h2>
                <p className="mt-3 text-lg leading-snug text-ink">
                  {p.tagline}
                </p>
                <p className="body-copy mt-4 text-muted">{p.summary}</p>

                <div className="mt-6 border-l-2 border-a1 pl-4">
                  <p className="annot text-ink">Engineering challenge</p>
                  <p className="mt-1.5 text-[0.98rem] leading-relaxed">
                    {p.hardestProblem}
                  </p>
                </div>

                <dl className="mt-6 border-t border-line text-[0.95rem]">
                  <div className="flex gap-4 border-b border-line py-2.5">
                    <dt className="annot w-24 shrink-0">Role</dt>
                    <dd>Solo project</dd>
                  </div>
                  <div className="flex gap-4 border-b border-line py-2.5">
                    <dt className="annot w-24 shrink-0">Core tech</dt>
                    <dd>{p.stack.slice(0, 5).join(" · ")}</dd>
                  </div>
                </dl>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/work/${p.slug}`}
                    className="press group/cs inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:bg-a1"
                  >
                    Read the case study
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover/cs:translate-x-1"
                    >
                      →
                    </span>
                    <span className="sr-only">: {p.name}</span>
                  </Link>
                  <a href={p.live} className={secondary}>
                    Live app ↗<span className="sr-only">: {p.name}</span>
                  </a>
                  <a href={p.repo} className={secondary}>
                    Code ↗<span className="sr-only">: {p.name}</span>
                  </a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </>
  );
}
