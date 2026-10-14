import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { PROJECTS } from "@/lib/projects";
import { UsedBy } from "../UsedBy";
import { MediaSlot } from "../MediaSlot";

/** Where each project's line leaves the strip (in the 1000-wide connector). */
const COLUMN_X = [125, 375, 625, 875];

/**
 * The four projects as large cards. On a desktop they stack on top of each other as you scroll
 * (each one sticks a little lower than the last); on phones they are a plain vertical list.
 *
 * Kept from the original "Four ways in" section: hovering or focusing a card tints the whole room
 * in that project's color and lights its line back to Human Judgment (CSS only, see .portals),
 * the screenshot zooms slowly, and the arrow nudges forward. New: a gentle 3D tilt, the cursor's
 * "View" label, and the project name morphing into the case study's title when opened.
 */
export function Showcase() {
  return (
    <section
      id="directions"
      aria-labelledby="directions-title"
      className="portals below-fold scroll-mt-16 border-b border-line py-20 sm:py-28"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="annot text-ink">Choose a direction</p>
            <h2
              id="directions-title"
              className="mt-3 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.92]"
            >
              Four ways in.
            </h2>
          </div>
          <div className="max-w-[22rem]">
            <p className="text-lg leading-snug text-muted">
              Four working apps, each built for one thing people do.
            </p>
            <p className="currently mt-4 flex items-start gap-2 text-[0.95rem] leading-snug text-ink">
              <span aria-hidden="true" className="currently-dot mt-[0.45em]" />
              <span>
                <span className="font-semibold">Currently:</span> preparing
                CommonGround to work with my city’s mayor’s office.
              </span>
            </p>
          </div>
        </div>

        {/* The four lines back to one center (desktop only) */}
        <div aria-hidden="true" className="relative mt-16 hidden lg:block">
          <svg
            viewBox="0 0 1000 90"
            preserveAspectRatio="none"
            className="h-[90px] w-full overflow-visible"
            fill="none"
          >
            {PROJECTS.map((p, i) => (
              <path
                key={p.slug}
                d={`M${COLUMN_X[i]} 90 C${COLUMN_X[i]} 40 500 50 500 8`}
                vectorEffect="non-scaling-stroke"
                className={`accent-${p.slug} portal-line portal-line-${p.slug}`}
              />
            ))}
          </svg>
          <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper" />
          <span className="annot absolute left-1/2 top-0 ml-5 -translate-y-1/2 whitespace-nowrap text-ink">
            Human judgment
          </span>
        </div>

        <ol className="stack mt-12 lg:mt-6">
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              className="stack-item"
              style={{ "--n": i } as CSSProperties}
            >
              <Link
                href={`/work/${p.slug}`}
                data-cursor="View"
                data-tilt
                className={`portal portal-${p.slug} accent-${p.slug} tilt group grid overflow-hidden rounded-[14px] border border-line-strong bg-soft lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]`}
              >
                <MediaSlot
                  project={p}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="border-b border-line lg:border-b-0 lg:border-r"
                  imageClassName="portal-image"
                />
                <span className="flex flex-col p-6 sm:p-8 lg:p-10">
                  <span className="annot flex items-baseline justify-between">
                    <span className="text-ink">
                      {p.chapter}
                      <span className="text-muted"> / 0{PROJECTS.length}</span>
                    </span>
                    <span className="capitalize text-a1">{p.verb}</span>
                  </span>
                  <ViewTransition
                    name={`title-${p.slug}`}
                    share="morph"
                    default="none"
                  >
                    <span className="mt-6 block w-fit font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.92] text-a1">
                      {p.name}
                    </span>
                  </ViewTransition>
                  <span className="mt-4 text-lg leading-snug text-ink">
                    {p.oneLine}
                  </span>
                  {p.usedBy && <UsedBy text={p.usedBy} className="mt-3" />}
                  <span className="mt-6 flex flex-wrap gap-2">
                    <span className="badge">{p.badge}</span>
                    {p.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </span>
                  <span className="mt-8 flex items-center gap-2 text-sm font-semibold text-ink lg:mt-auto">
                    View project
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
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
