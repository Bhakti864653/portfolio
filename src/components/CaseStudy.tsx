import Link from "next/link";
import type { ReactNode } from "react";
import { inline } from "@/lib/format";
import { PROJECTS, type Project } from "@/lib/projects";
import { Plate } from "./Plate";

type Entry = { id: string; label: string; content: ReactNode };

const Paragraphs = ({ items }: { items: string[] }) => (
  <div className="space-y-4">
    {items.map((t) => (
      <p key={t} className="max-w-prose text-[1.06rem] leading-relaxed">
        {inline(t)}
      </p>
    ))}
  </div>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="max-w-prose">
    {items.map((t) => (
      <li
        key={t}
        className="grid grid-cols-[1.25rem_1fr] border-b border-line py-3 leading-relaxed last:border-0"
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
          <p className="mb-4 font-display text-3xl leading-tight text-a1">
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
          <p className="mb-4 font-display text-3xl leading-tight">
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
              className="annot rounded-full border border-line-strong px-3 py-1.5 normal-case tracking-normal text-ink"
            >
              {s}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <article className={`accent-${p.slug}`} aria-labelledby="case-title">
      <header className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-8 sm:pt-10">
        <div className="annot flex flex-wrap justify-between gap-2 border-b border-line pb-3">
          <Link href={`/#${p.slug}`} className="text-ink hover:underline">
            ← All work
          </Link>
          <span>
            Chapter {p.chapter} · {p.verb}
          </span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p
              aria-hidden="true"
              className="font-display text-[clamp(4.4rem,13vw,9rem)] italic capitalize leading-[0.82] text-a1"
            >
              {p.verb}.
            </p>
            <h1
              id="case-title"
              className="mt-6 font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.95]"
            >
              {p.name}
            </h1>
            <p className="mt-3 font-display text-2xl italic text-muted">
              {p.tagline}
            </p>
            <p className="mt-6 max-w-prose leading-relaxed">{p.intro}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={p.live}
                className="annot inline-flex h-11 items-center rounded-full bg-a1 px-6 text-paper hover:opacity-90"
              >
                Open the live app ↗
              </a>
              <a
                href={p.repo}
                className="annot inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-ink hover:bg-soft"
              >
                GitHub repository ↗
              </a>
            </div>
            <p className="mt-4 max-w-prose text-sm text-muted">{p.liveNote}</p>
          </div>
          <div className="lg:col-span-7 lg:pt-10">
            <Plate project={p} figure={`${p.chapter}.1`} priority />
          </div>
        </div>
      </header>

      <div className="border-t border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-8 lg:grid-cols-12">
          <nav
            aria-label="On this page"
            className="hidden lg:col-span-3 lg:block"
          >
            <ol className="sticky top-24 space-y-1.5">
              {entries.map((e, i) => (
                <li key={e.id}>
                  <a
                    href={`#${e.id}`}
                    className="annot flex gap-3 py-0.5 hover:text-ink"
                  >
                    <span className="w-5 text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {e.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="lg:col-span-8 lg:col-start-5">
            {entries.map((e, i) => (
              <section
                key={e.id}
                id={e.id}
                aria-labelledby={`${e.id}-h`}
                className="scroll-mt-24 border-b border-line py-10 first:pt-0"
              >
                <h2 id={`${e.id}-h`} className="annot mb-5 flex gap-3">
                  <span className="text-a1">
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
        className={`accent-${next.slug} group block border-t border-line`}
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-16 sm:px-8 sm:py-24">
          <span className="annot">Next chapter · {next.chapter}</span>
          <span className="font-display text-[clamp(3rem,9vw,7rem)] italic capitalize leading-none text-a1 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">
            {next.verb} → {next.name}
          </span>
        </div>
      </Link>
    </article>
  );
}
