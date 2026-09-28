import type { Metadata } from "next";
import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { Reveal } from "@/components/Reveal";
import { Fragment } from "@/components/thread/Fragment";
import { ThreadLayer } from "@/components/thread/ThreadLayer";
import { PROJECTS, type Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Four systems built to create a way forward: Portico helps people decide, Synaptiq helps them learn, Concord helps them connect, and CommonGround helps them act.",
  alternates: { canonical: "/work" },
};

const secondary =
  "press inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft";

function Actions({ p }: { p: Project }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        href={`/work/${p.slug}`}
        className="press group/cs inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:bg-a1"
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
  );
}

/** Number, ability, question, and name: the part every composition shares. */
function Heading({ p }: { p: Project }) {
  return (
    <>
      <p className="annot relative flex items-center gap-3">
        {/* Sits in the gutter left of the text, so the thread never runs through the words */}
        <span
          data-thread={`n-${p.slug}`}
          aria-hidden="true"
          className="absolute -left-[22px] top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-a1 bg-paper"
        />
        <span className="text-a1">{p.chapter}</span>
        <span className="capitalize text-ink">{p.verb}</span>
      </p>
      <p className="mt-6 font-display text-[clamp(1.6rem,2.4vw,2.1rem)] italic leading-[1.1] text-muted">
        {p.question}
      </p>
      <h2
        id={`${p.slug}-title`}
        className="mt-3 font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.92] text-a1"
      >
        <span className="sr-only">{p.verb}: </span>
        {p.name}
      </h2>
      <p className="mt-4 text-xl leading-snug text-ink">{p.tagline}</p>
    </>
  );
}

function Details({ p }: { p: Project }) {
  return (
    <>
      <p className="body-copy mt-6 text-muted">{p.summary}</p>
      <div className="mt-8 border-l-2 border-a1 pl-5">
        <p className="annot text-ink">Engineering challenge</p>
        <p className="body-copy mt-2">{p.hardestProblem}</p>
      </div>
      <p className="annot mt-7 normal-case tracking-normal">
        {p.stack.slice(0, 5).join(" · ")}
      </p>
      <Actions p={p} />
    </>
  );
}

/** Portico: a wide crop of the dashboard to the right, a close-up fragment laid over its corner. */
function PorticoComposition({ p }: { p: Project }) {
  return (
    <div className="grid-12 gap-y-12 lg:items-center">
      <div className="relative lg:col-span-4">
        <Heading p={p} />
        <Details p={p} />
      </div>
      <div className="relative lg:col-span-8 lg:pl-6">
        <Fragment
          project={p}
          focus={[0.5, 0.5]}
          zoom={1.06}
          mask="fragment-h"
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={p.screenshot.alt}
          priority
          className="relative aspect-[16/10] w-full"
        />
        <Fragment
          project={p}
          focus={[0.62, 0.28]}
          zoom={2.6}
          sizes="24vw"
          className="drift absolute -bottom-10 left-0 hidden aspect-square w-[32%] rounded-full border border-line bg-soft sm:block"
        />
      </div>
    </div>
  );
}

/** Synaptiq: the interface first and full-bleed on the left, the name set over its edge. */
function SynaptiqComposition({ p }: { p: Project }) {
  return (
    <div className="grid-12 gap-y-12 lg:items-center">
      <div className="relative lg:col-span-7 lg:col-start-1 lg:row-start-1">
        <Fragment
          project={p}
          focus={[0.45, 0.5]}
          zoom={1.12}
          mask="fragment-h"
          sizes="(min-width: 1024px) 55vw, 100vw"
          alt={p.screenshot.alt}
          className="relative aspect-[4/3] w-full"
        />
      </div>
      <div className="relative lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:-ml-24">
        <Heading p={p} />
        <Details p={p} />
      </div>
    </div>
  );
}

/** Concord: a full-width band of the product, the words below it in two columns. */
function ConcordComposition({ p }: { p: Project }) {
  return (
    <div>
      <div className="max-w-[46rem]">
        <Heading p={p} />
      </div>
      <Fragment
        project={p}
        focus={[0.5, 0.42]}
        zoom={1.02}
        mask="fragment-v"
        sizes="100vw"
        alt={p.screenshot.alt}
        className="relative mt-10 aspect-[16/7] w-full"
      />
      <div className="grid-12 mt-4 gap-y-4">
        <div className="lg:col-span-6">
          <p className="body-copy text-muted">{p.summary}</p>
          <p className="annot mt-6 normal-case tracking-normal">
            {p.stack.slice(0, 5).join(" · ")}
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="border-l-2 border-a1 pl-5">
            <p className="annot text-ink">Engineering challenge</p>
            <p className="body-copy mt-2">{p.hardestProblem}</p>
          </div>
          <Actions p={p} />
        </div>
      </div>
    </div>
  );
}

/** CommonGround: a tall crop of the community page, centered on the map of case zones. */
function CommonGroundComposition({ p }: { p: Project }) {
  return (
    <div className="grid-12 gap-y-12 lg:items-center">
      <div className="relative lg:col-span-5">
        <Heading p={p} />
        <Details p={p} />
      </div>
      <div className="relative lg:col-span-6 lg:col-start-7">
        <Fragment
          project={p}
          focus={[0.55, 0.55]}
          zoom={1.5}
          mask="fragment"
          sizes="(min-width: 1024px) 45vw, 100vw"
          alt={p.screenshot.alt}
          className="relative aspect-[4/5] w-full lg:w-[82%]"
        />
      </div>
    </div>
  );
}

const COMPOSITION: Record<
  Project["slug"],
  (props: { p: Project }) => React.ReactNode
> = {
  portico: PorticoComposition,
  synaptiq: SynaptiqComposition,
  concord: ConcordComposition,
  commonground: CommonGroundComposition,
};

export default function WorkIndex() {
  return (
    <>
      <PageMasthead number="01" label="Work" title="Four ways forward">
        Four projects built around four things people do: decide, learn,
        connect, and act. Each began where someone was stuck.
      </PageMasthead>

      {/* One thread runs down through all four, in each project's color */}
      <div className="relative pb-16 sm:pb-24">
        <ThreadLayer variant="sequence" />
        <ol className="shell relative">
          {PROJECTS.map((p) => {
            const Composition = COMPOSITION[p.slug];
            return (
              <li key={p.slug} className={`accent-${p.slug} pl-7 lg:pl-0`}>
                <Reveal>
                  <article
                    aria-labelledby={`${p.slug}-title`}
                    className="py-20 sm:py-28"
                  >
                    <Composition p={p} />
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
