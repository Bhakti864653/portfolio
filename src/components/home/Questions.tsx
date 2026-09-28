import Link from "next/link";
import { PROJECTS, type Project } from "@/lib/projects";
import { Fragment } from "../thread/Fragment";
import { ThreadLayer } from "../thread/ThreadLayer";

/** Where each question sits on the desktop composition: staggered, never a row of boxes. */
const PLACEMENT: Record<Project["slug"], string> = {
  portico: "lg:col-span-5 lg:col-start-1",
  synaptiq: "lg:col-span-5 lg:col-start-8 lg:mt-48",
  concord: "lg:col-span-5 lg:col-start-2 lg:-mt-16",
  commonground: "lg:col-span-5 lg:col-start-8 lg:mt-32",
};

/** The part of each interface worth a glimpse. */
const FOCUS: Record<Project["slug"], [number, number]> = {
  portico: [0.6, 0.4],
  synaptiq: [0.35, 0.48],
  concord: [0.3, 0.42],
  commonground: [0.5, 0.55],
};

/**
 * The four questions. The introduction's four strands arrive at the top of this section and
 * each travels to its question. Hover, focus, or tap brings that project's screenshot into
 * focus and quiets the other paths (CSS, see .questions). Everything essential (the question,
 * the project, the action) is visible without hovering.
 */
export function Questions() {
  return (
    <section
      id="questions"
      aria-labelledby="questions-title"
      className="questions relative scroll-mt-16 pb-24 pt-20 sm:pb-36 sm:pt-28"
    >
      <ThreadLayer variant="questions" />

      <div className="shell relative">
        <div className="grid-12 gap-y-6 lg:items-end">
          <div className="pl-8 lg:col-span-6 lg:pl-0">
            <p className="annot text-ink">Four problems</p>
            <h2
              id="questions-title"
              className="mt-3 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.98]"
            >
              Where people get stuck.
            </h2>
          </div>
          <p className="body-copy max-w-[26rem] pl-8 text-muted lg:col-span-4 lg:col-start-9 lg:pl-0">
            One student. Four problems. Four systems built to create a way
            forward.
          </p>
        </div>

        <ol className="grid-12 mt-16 gap-y-20 sm:mt-24 lg:gap-y-0">
          {PROJECTS.map((p) => (
            <li key={p.slug} className={PLACEMENT[p.slug]}>
              <Link
                href={`/work/${p.slug}`}
                data-thread={`q-${p.slug}`}
                className={`q q-${p.slug} accent-${p.slug} group relative block pl-8 lg:pb-24`}
              >
                <span
                  data-thread={`n-${p.slug}`}
                  aria-hidden="true"
                  className="absolute left-[-6px] top-1.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-a1 bg-paper transition-colors group-hover:bg-a1 group-focus-visible:bg-a1"
                />
                {/* On phones, the chapter's label stays in view while you read it */}
                <span className="annot sticky top-20 z-10 -mt-1 inline-block bg-paper/85 py-1 pr-2 text-a1 lg:static lg:bg-transparent">
                  {p.chapter} / 0{PROJECTS.length} ·{" "}
                  <span className="capitalize">{p.verb}</span>
                </span>
                <h3 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.05]">
                  {p.question}
                </h3>

                <Fragment
                  project={p}
                  focus={FOCUS[p.slug]}
                  zoom={1.45}
                  mask="fragment-v"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="q-image relative mt-8 aspect-[16/10] w-full"
                />

                <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-[1.7rem] leading-none text-a1">
                    {p.name}
                  </span>
                  <span className="text-[0.98rem] text-muted">{p.tagline}</span>
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  Read the case study
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
