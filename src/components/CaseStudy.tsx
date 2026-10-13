import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { inline } from "@/lib/format";
import { PROJECTS, type Project, type Shot } from "@/lib/projects";
import { Gallery } from "./case/Gallery";
import { MediaSlot } from "./MediaSlot";
import { Reveal } from "./Reveal";

const Paragraphs = ({ items }: { items: string[] }) => (
  <div className="space-y-4">
    {items.map((t) => (
      <p key={t} className="body-copy max-w-[68ch]">
        {inline(t)}
      </p>
    ))}
  </div>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="max-w-[68ch]">
    {items.map((t) => (
      <li
        key={t}
        className="body-copy grid grid-cols-[1.5rem_1fr] border-b border-line py-3.5 first:pt-0 last:border-0 last:pb-0"
      >
        <span
          aria-hidden="true"
          className="mt-[0.6em] h-1.5 w-1.5 rounded-full bg-a1"
        />
        <span>{inline(t)}</span>
      </li>
    ))}
  </ul>
);

/** Extra detail, folded away by default so each section stays short. */
function ReadMore({ children }: { children: ReactNode }) {
  return (
    <details className="read-more mt-8 border-t border-line">
      <summary className="group flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 pt-4 text-sm font-semibold">
        <span className="link-draw">Read more</span>
        <span
          aria-hidden="true"
          className="text-xl leading-none transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="read-more-body space-y-8 pb-2 pt-6">{children}</div>
    </details>
  );
}

const More = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <h3 className="annot mb-3 text-ink">{title}</h3>
    {children}
  </div>
);

type Entry = { id: string; label: string; body: ReactNode; more?: ReactNode };

/**
 * A project's case study: a full-width hero (the name morphs in from the card that opened it),
 * a summary card, the 16:9 media slot, a gallery of real screenshots, then five short sections,
 * each with its full detail folded into "Read more". It ends with a large link to the next one.
 */
export function CaseStudy({ project: p }: { project: Project }) {
  const cs = p.caseStudy;
  const index = PROJECTS.indexOf(p);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const previous = PROJECTS[(index + PROJECTS.length - 1) % PROJECTS.length];
  // The main screenshot is already shown above, so the gallery never repeats it.
  const shots: Shot[] = p.gallery.filter((s) => s.src !== p.screenshot.src);

  const entries: Entry[] = [
    {
      id: "problem",
      label: "The problem",
      body: <p className="case-lead">{p.short.problem}</p>,
      more: (
        <>
          <More title="The real problem">
            <Paragraphs items={cs.problem} />
          </More>
          <More title="Why I chose it">
            <Paragraphs items={cs.why} />
          </More>
          <More title="Who it’s for">
            <Paragraphs items={cs.users} />
          </More>
        </>
      ),
    },
    {
      id: "does",
      label: "What it does",
      body: <Bullets items={p.short.does} />,
      more: (
        <>
          <More title="Every feature">
            <Bullets items={cs.features} />
          </More>
          <More title={`The important system: ${cs.system.heading}`}>
            <Paragraphs items={cs.system.body} />
          </More>
          <More title="Product decisions">
            <Bullets items={cs.design} />
          </More>
          <More title="Privacy, safety & fairness">
            <Bullets items={cs.safety} />
          </More>
        </>
      ),
    },
    {
      id: "hard",
      label: "The hard part",
      body: (
        <div className="border-l-2 border-a1 pl-5">
          <p className="mb-3 text-xl font-semibold leading-snug">
            {cs.challenge.heading}
          </p>
          <p className="body-copy max-w-[68ch]">{inline(p.short.hard)}</p>
        </div>
      ),
      more: (
        <>
          <More title="The full story">
            <Paragraphs items={cs.challenge.body} />
          </More>
          <More title="What changed along the way">
            <Bullets items={cs.changes} />
          </More>
          <More title="Current limitations">
            <Bullets items={cs.limitations} />
          </More>
        </>
      ),
    },
    {
      id: "learned",
      label: "What I learned",
      body: <Bullets items={p.short.learned} />,
      // Only lessons not already listed above; no "Read more" when there are none.
      more: cs.learned.length ? (
        <More title="More lessons">
          <Bullets items={cs.learned} />
        </More>
      ) : undefined,
    },
    {
      id: "tech",
      label: "Tech",
      body: (
        <ul className="flex max-w-prose flex-wrap gap-2">
          {p.stack.map((s) => (
            <li key={s} className="tag">
              {s}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <article className={`accent-${p.slug}`} aria-labelledby="case-title">
      {/* Hero */}
      <header className="case-hero grid-field-subtle border-b border-line">
        <div className="shell pb-12 pt-6 sm:pb-16">
          <div className="annot flex flex-wrap justify-between gap-2 border-b border-line pb-3">
            <Link href="/work" className="link-draw text-ink">
              ← All work
            </Link>
            <span>
              <span className="text-a1">Project {p.chapter}</span>
              {` / 0${PROJECTS.length} · `}
              <span className="text-ink">{p.verb}</span>
            </span>
          </div>

          <p className="mt-12 max-w-[34rem] font-display text-[1.35rem] italic leading-snug text-muted sm:mt-16">
            {p.question}
          </p>
          <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
            <h1 id="case-title" className="case-title w-fit text-a1">
              {p.name}
            </h1>
          </ViewTransition>

          <div className="grid-12 mt-10 gap-y-8">
            <p className="text-[clamp(1.3rem,2.4vw,1.9rem)] leading-snug text-ink lg:col-span-6">
              {p.tagline}
            </p>
            <div className="summary-card rounded-[14px] border border-line-strong bg-soft p-6 sm:p-7 lg:col-span-6 lg:col-start-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="max-w-[30rem] text-lg leading-snug">
                  {p.oneLine}
                </p>
                <span className="badge">{p.badge}</span>
              </div>
              <ul
                className="mt-5 flex flex-wrap gap-2"
                aria-label="Main technologies"
              >
                {p.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={p.live}
                  data-magnetic
                  className="press inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:bg-a1"
                >
                  Live site ↗
                </a>
                <a
                  href={p.repo}
                  data-magnetic
                  className="press inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-paper"
                >
                  GitHub ↗
                </a>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {p.liveNote}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* The media slot: a demo video if there is one, otherwise the screenshot */}
      <div className="shell py-12 sm:py-16">
        <MediaSlot
          project={p}
          sizes="(min-width: 1320px) 1224px, 94vw"
          priority
          morph
          className="rounded-[14px] border border-line-strong"
        />
      </div>

      {/* More real screenshots */}
      <section aria-labelledby="gallery-title" className="shell pb-16 sm:pb-20">
        <h2 id="gallery-title" className="annot mb-5 text-ink">
          Inside the app
        </h2>
        <Gallery shots={shots} name={p.name} />
      </section>

      {/* Five short sections */}
      <div className="border-t border-line">
        <div className="shell py-12 sm:py-16">
          {entries.map((e, i) => (
            <Reveal key={e.id}>
              <section
                id={e.id}
                aria-labelledby={`${e.id}-h`}
                className="grid-12 scroll-mt-24 gap-y-5 border-t border-line py-12 first:border-t-0 first:pt-0"
              >
                <h2
                  id={`${e.id}-h`}
                  className="flex items-baseline gap-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-tight lg:col-span-4"
                >
                  <span className="annot text-a1">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {e.label}
                </h2>
                <div className="lg:col-span-8">
                  {e.body}
                  {e.more && <ReadMore>{e.more}</ReadMore>}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Next project */}
      <nav aria-label="More projects" className="border-t border-line">
        <Link
          href={`/work/${next.slug}`}
          data-cursor="Next"
          className={`next-band accent-${next.slug} group block`}
        >
          <span className="shell flex flex-col gap-4 py-16 sm:py-24">
            <span className="annot next-label">
              Next project · {next.chapter}{" "}
              <span className="capitalize">· {next.verb}</span>
            </span>
            <span className="flex items-end justify-between gap-6">
              <ViewTransition
                name={`title-${next.slug}`}
                share="morph"
                default="none"
              >
                <span className="next-name w-fit">{next.name}</span>
              </ViewTransition>
              <span aria-hidden="true" className="next-arrow">
                →
              </span>
            </span>
            <span className="next-line max-w-[36rem] text-lg leading-snug">
              {next.oneLine}
            </span>
          </span>
        </Link>
        <div className="shell border-t border-line py-5">
          <Link
            href={`/work/${previous.slug}`}
            className={`accent-${previous.slug} link-draw annot text-ink`}
          >
            ← Previous: {previous.name}
          </Link>
        </div>
      </nav>
    </article>
  );
}
