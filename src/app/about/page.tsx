import type { Metadata } from "next";
import { NextPage } from "@/components/NextPage";
import { PageMasthead } from "@/components/PageMasthead";
import { Reveal } from "@/components/Reveal";
import { STAGES } from "@/lib/journey";
import { projectBySlug } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bhakti Ahir, a 12th-grade student at The Oxford School in Panama, on why she builds and what she believes about AI and human judgment.",
  alternates: { canonical: "/about" },
};

/** Wraps a lesson in quotation marks unless it already opens with one. */
const quote = (t: string) => (t.startsWith("“") ? t : `“${t}”`);

/** A margin note: a lesson in my own words, quoted from a project's case study. */
function Note({ slug, index }: { slug: string; index: number }) {
  const p = projectBySlug(slug)!;
  return (
    <aside
      className={`accent-${p.slug} border-l-2 border-a1 pl-4 lg:col-span-2 lg:col-start-11`}
    >
      <p className="annot text-a1">Note · from {p.name}</p>
      <p className="mt-2 font-display text-[1.2rem] italic leading-snug">
        {quote(p.caseStudy.learned[index])}
      </p>
    </aside>
  );
}

const PRINCIPLES = [
  {
    title: "Technology should support human judgment.",
    body: "Every project here leaves the final call with a person: the student choosing what to study, the resident confirming a report, the moderator approving a change.",
  },
  {
    title: "Explainable before clever.",
    body: "A rule-based suggestion list instead of a paid model, a match score you can read line by line, a reasoning trace for every AI agent. If I can’t explain a decision, the person using it can’t trust it.",
  },
  {
    title: "Computer Science turns ideas into things people can use.",
    body: "It’s the difference between having a good idea about a problem and handing someone a working tool for it.",
  },
];

const BEYOND = [
  { label: "Science Club", detail: "Member" },
  { label: "Debate Club", detail: "Member" },
  {
    label: "Fundación Operación Sonrisa Panamá",
    detail: "School initiative supporting the foundation",
  },
  {
    label: "National Mathematics Olympiad",
    detail: "Represented my school twice",
  },
  { label: "Community service", detail: "More than 80 hours" },
];

export default function AboutPage() {
  return (
    <div className="tone-ivory grain relative bg-paper text-ink">
      <PageMasthead number="03" label="About" title="Bhakti Ahir">
        <p className="annot normal-case tracking-normal text-ink">
          12th grade · The Oxford School, Panama · Computer Science
        </p>
      </PageMasthead>

      {/* Why: the quietest part of the site, one column and a lot of room */}
      <section aria-labelledby="why-title" className="shell py-14 sm:py-20">
        <div className="grid-12 gap-y-6">
          <h2 id="why-title" className="annot text-ink lg:col-span-3">
            Why I build
          </h2>
          <div className="space-y-5 lg:col-span-7">
            <p className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.15]">
              I learn by building real systems for real problems.
            </p>
            <p className="body-copy max-w-[40rem] text-muted">
              I’m a 12th-grade student at The Oxford School in Panama, planning
              to study Computer Science. Each of my projects began with a
              problem people really have: applying to university, studying,
              finding a mentor, and the problems a neighborhood shares. Long
              term, I want to build a company that creates technology around
              real human needs.
            </p>
          </div>
          <Note slug="portico" index={0} />
        </div>
      </section>

      <section aria-labelledby="learn-title" className="shell pb-16 sm:pb-20">
        <div className="grid-12 gap-y-6">
          <h2 id="learn-title" className="annot text-ink lg:col-span-3">
            How I learn
          </h2>
          <div className="lg:col-span-7">
            <p className="body-copy max-w-[40rem] text-muted">
              Every project made me learn something I had never done before,
              because the problem needed it, not because a course came next.
            </p>
            <ul className="mt-6">
              {STAGES.map((s) => (
                <li
                  key={s.id}
                  className={`accent-${s.id} flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line py-3`}
                >
                  <span className="w-32 shrink-0 font-display text-xl text-a1">
                    {s.label}
                  </span>
                  <span className="text-[0.98rem]">
                    {s.introduced.join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Note slug="synaptiq" index={1} />
        </div>
      </section>

      <section
        aria-labelledby="ai-title"
        className="border-y border-line py-16 sm:py-24"
      >
        <div className="shell grid-12 gap-y-6">
          <h2 id="ai-title" className="annot text-ink lg:col-span-3">
            On AI and judgment
          </h2>
          <div className="lg:col-span-8">
            <p className="font-display text-[clamp(2rem,4.2vw,3.4rem)] italic leading-[1.08]">
              “AI should extend what people can do, not make them passive.”
            </p>
            <p className="body-copy mt-6 max-w-[40rem] text-muted">
              The Synaptiq tutor answers only from your own notes. The
              CommonGround Guide drafts a report but never submits it. Both are
              built to keep you thinking and to leave the decision with you.
            </p>
          </div>
        </div>
      </section>

      <Reveal className="shell py-16 sm:py-24">
        <h2 className="annot text-ink">Principles</h2>
        <ol className="mt-8">
          {PRINCIPLES.map((b, i) => (
            <li
              key={b.title}
              className="grid-12 gap-y-4 border-t border-line py-10 sm:py-12"
            >
              <p className="font-display text-5xl leading-none text-faint lg:col-span-2">
                0{i + 1}
              </p>
              <p className="font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.06] lg:col-span-6">
                {b.title}
              </p>
              <p className="body-copy max-w-[30rem] text-muted lg:col-span-4 lg:pt-2">
                {b.body}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      <section
        aria-labelledby="how-title"
        className="border-t border-line py-16 sm:py-20"
      >
        <div className="shell grid-12 gap-y-6">
          <h2 id="how-title" className="annot text-ink lg:col-span-3">
            How these were built
          </h2>
          <p className="body-copy max-w-[40rem] lg:col-span-7">
            I build with AI coding tools, and they wrote a large share of the
            code in these projects. The direction is mine: choosing each
            problem, deciding what to build and what to leave out, testing every
            feature against real use, and learning how each system works well
            enough to explain it.
          </p>
        </div>
      </section>

      <Reveal className="shell pb-20 sm:pb-28">
        <div className="grid-12 gap-y-4 border-t border-line pt-8">
          <h2 className="annot text-ink lg:col-span-3">Beyond the screen</h2>
          <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {BEYOND.map((item) => (
              <div key={item.label} className="border-b border-line py-3">
                <dt className="font-semibold">{item.label}</dt>
                <dd className="mt-0.5 text-[0.95rem] text-muted">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <NextPage href="/contact" number="04" label="Contact" />
    </div>
  );
}
