import Link from "next/link";
import type { ReactNode } from "react";
import { inline } from "@/lib/format";
import { PROJECTS, type Project } from "@/lib/projects";
import { Plate } from "./Plate";

type Entry = { id: string; label: string; content: ReactNode };

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
        className="body-copy grid grid-cols-[1.5rem_1fr] border-b border-line py-4 first:pt-0 last:border-0 last:pb-0"
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

export function CaseStudy({ project: p }: { project: Project }) {
  const cs = p.caseStudy;
  const index = PROJECTS.indexOf(p);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const entries: Entry[] = [
    {
      id: "problem",
      label: "The real problem",
      content: <Paragraphs items={cs.problem} />,
    },
    {
      id: "why",
      label: "Why I chose it",
      content: <Paragraphs items={cs.why} />,
    },
    {
      id: "users",
      label: "Who it’s for",
      content: <Paragraphs items={cs.users} />,
    },
    {
      id: "features",
      label: "Core features",
      content: <Bullets items={cs.features} />,
    },
    {
      id: "system",
      label: "The important system",
      content: (
        <>
          <p className="mb-5 text-xl font-semibold leading-snug">
            {cs.system.heading}
          </p>
          <Paragraphs items={cs.system.body} />
        </>
      ),
    },
    {
      id: "design",
      label: "Design decisions",
      content: <Bullets items={cs.design} />,
    },
    {
      id: "safety",
      label: "Privacy, safety & fairness",
      content: <Bullets items={cs.safety} />,
    },
    {
      id: "challenge",
      label: "The hardest challenge",
      content: (
        <div className="border-l-2 border-a1 pl-5">
          <p className="mb-5 text-xl font-semibold leading-snug">
            {cs.challenge.heading}
          </p>
          <Paragraphs items={cs.challenge.body} />
        </div>
      ),
    },
    {
      id: "changes",
      label: "What changed along the way",
      content: <Bullets items={cs.changes} />,
    },
    {
      id: "limitations",
      label: "Current limitations",
      content: <Bullets items={cs.limitations} />,
    },
    {
      id: "learned",
      label: "What I learned",
      content: <Bullets items={cs.learned} />,
    },
    {
      id: "stack",
      label: "Technology",
      content: (
        <ul className="flex max-w-prose flex-wrap gap-2">
          {p.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink"
            >
              {s}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const toc = (
    <ol className="space-y-0.5">
      {entries.map((e, i) => (
        <li key={e.id}>
          <a
            href={`#${e.id}`}
            className="flex min-h-10 items-center gap-3 text-[0.95rem] text-muted hover:text-ink"
          >
            <span className="annot w-6 text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            {e.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <article className={`accent-${p.slug}`} aria-labelledby="case-title">
      {/* Masthead: text only, on a faint grid */}
      <header className="grid-field-subtle border-b border-line">
        <div className="shell pb-14 pt-6 sm:pb-20">
          <div className="annot flex flex-wrap justify-between gap-2 border-b border-line pb-3">
            <Link href={`/#${p.slug}`} className="text-ink hover:underline">
              ← All work
            </Link>
            <span>
              <span className="text-a1">Chapter {p.chapter}</span> · {p.verb}
            </span>
          </div>

          <div className="grid-12 mt-12 gap-y-8 sm:mt-16">
            <div className="lg:col-span-7">
              <h1
                id="case-title"
                className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.95]"
              >
                {p.name}
              </h1>
              <p className="mt-4 text-xl leading-snug text-ink">{p.tagline}</p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="body-copy text-muted">{p.intro}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={p.live}
                  className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
                >
                  Open the live app ↗
                </a>
                <a
                  href={p.repo}
                  className="inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft"
                >
                  Repository ↗
                </a>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {p.liveNote}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* The screenshot, large and on its own */}
      <div className="shell py-12 sm:py-16">
        <div className="mx-auto max-w-[1120px]">
          <Plate project={p} figure={`${p.chapter}.1`} priority />
        </div>
      </div>

      {/* Reading: contents on the left, one comfortable column on the right */}
      <div className="border-t border-line">
        <div className="shell grid-12 py-12 sm:py-16">
          <nav aria-label="On this page" className="lg:col-span-3">
            <details className="rounded-[6px] border border-line lg:hidden">
              <summary className="group flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold">
                On this page
                <span
                  aria-hidden="true"
                  className="text-lg leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="border-t border-line px-4 py-2">{toc}</div>
            </details>
            <div className="sticky top-24 hidden lg:block">
              <p className="annot mb-3 text-ink">On this page</p>
              {toc}
            </div>
          </nav>

          <div className="mt-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
            {entries.map((e, i) => (
              <section
                key={e.id}
                id={e.id}
                aria-labelledby={`${e.id}-h`}
                className="scroll-mt-24 border-t border-line py-12 first:border-t-0 first:pt-0"
              >
                <h2
                  id={`${e.id}-h`}
                  className="mb-6 flex items-baseline gap-4 font-display text-[2rem] leading-tight"
                >
                  <span className="annot text-a1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {e.label}
                </h2>
                {e.content}
              </section>
            ))}
          </div>
        </div>
      </div>

      <Link
        href={`/work/${next.slug}`}
        className={`accent-${next.slug} group block border-t-2 border-a1`}
      >
        <div className="shell flex flex-col gap-3 py-16 sm:py-20">
          <span className="annot">Next chapter · {next.chapter}</span>
          <span className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">
            <span className="capitalize text-a1">{next.verb}</span> →{" "}
            {next.name}
          </span>
        </div>
      </Link>
    </article>
  );
}
