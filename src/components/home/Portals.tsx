import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

/** Where each portal's line leaves the top of its column (in the 1000-wide connector). */
const COLUMN_X = [125, 375, 625, 875];

/**
 * Act II. Four entrances, one per ability. Each holds only enough to choose: number, ability,
 * name, one sentence, and the product itself, always shown in full. Hover or focus tints the room
 * in the project's color and lights its line back to Human Judgment (CSS only, see .portals).
 */
export function Portals() {
  return (
    <section
      id="directions"
      aria-labelledby="directions-title"
      className="portals scroll-mt-16 border-b border-line py-16 sm:py-24"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="annot text-ink">Choose a direction</p>
            <h2
              id="directions-title"
              className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] leading-none"
            >
              Four ways in.
            </h2>
          </div>
          <p className="body-copy max-w-[26rem] text-muted">
            Each project helps people do one thing, and each one leaves the
            final call with the person using it.
          </p>
        </div>

        {/* The four lines back to one center, above the four columns (desktop only) */}
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

        <ol className="mt-12 grid gap-4 lg:mt-0 lg:grid-cols-4 lg:gap-0">
          {PROJECTS.map((p) => (
            <li
              key={p.slug}
              className="flex lg:border-l lg:border-line lg:first:border-l-0"
            >
              <Link
                href={`/work/${p.slug}`}
                aria-label={`${p.chapter}, ${p.verb}: ${p.name}. ${p.tagline} View the project.`}
                className={`portal portal-${p.slug} accent-${p.slug} group flex w-full flex-col border-t-2 border-a1 pb-6 pt-6 lg:px-6`}
              >
                <span className="annot flex items-baseline justify-between">
                  <span className="text-ink">{p.chapter}</span>
                  <span>/ 0{PROJECTS.length}</span>
                </span>
                <span className="mt-5 text-lg capitalize text-a1">
                  {p.verb}
                </span>
                <span className="mt-1 font-display text-[clamp(2rem,2.8vw,2.5rem)] leading-none">
                  {p.name}
                </span>
                <span className="body-copy mt-3 max-w-[22rem] text-muted">
                  {p.tagline}
                </span>

                <span className="relative mt-8 block aspect-[16/10] overflow-hidden rounded-[3px] border border-line lg:mt-auto">
                  <Image
                    src={p.screenshot.src}
                    alt=""
                    width={1440}
                    height={900}
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="portal-image h-full w-full object-cover object-left-top"
                  />
                </span>
                <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-ink">
                  View project
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
