import Image from "next/image";
import type { Metadata } from "next";
import { Certifications } from "@/components/Certifications";
import { MeetBhakti } from "@/components/MeetBhakti";
import { NextPage } from "@/components/NextPage";
import { Reveal } from "@/components/Reveal";
import { STAGES } from "@/lib/journey";
import { projectBySlug, SITE } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bhakti Ahir, a 12th-grade student at The Oxford School in Panama, on why she builds and what she believes about AI and human judgment.",
  alternates: { canonical: "/about" },
};

/** Wraps a lesson in quotation marks unless it already opens with one. */
const quote = (t: string) => (t.startsWith("“") ? t : `“${t}”`);

/** A margin note: a lesson in my own words, quoted from a project's “What I learned”. */
function Note({ slug, index }: { slug: string; index: number }) {
  const p = projectBySlug(slug)!;
  return (
    <aside
      className={`accent-${p.slug} border-l-2 border-a1 pl-4 lg:col-span-2 lg:col-start-11`}
    >
      <p className="annot text-a1">Note · from {p.name}</p>
      <p className="mt-2 font-display text-[1.2rem] italic leading-snug">
        {quote(p.short.learned[index])}
      </p>
    </aside>
  );
}

/** The quick facts beside my name at the top. */
const FACTS = [
  "Santiago, Panama",
  "Planning to study Computer Science",
  "4 deployed apps",
];

/** Outside the code, in my own words. A line's lead (before the colon) is set bold to scan. */
const BEYOND = [
  {
    id: "honors",
    title: "Honors & awards",
    items: [
      "2nd place, STEM Olympics: Oxford School network competition among 7 campuses",
      "Best Community Impact award (school-wide), won with my team at a school assembly competition",
      "Best STEM Report award and multiple STEM Week competition wins",
      "Cuadro de Honor (honor roll) every year for academic excellence",
      "School Spelling Bee champion multiple times",
      "Selected twice to represent my school at Panama’s National Mathematics Olympiad",
    ],
  },
  {
    id: "activities",
    title: "Activities",
    items: [
      "Fundación Operación Sonrisa Panamá: helped organize school fundraising sales and collected donations to fund surgeries for children with cleft lip and palate",
      "Science Club: ran hands-on experiments with classmates",
      "Community service: 80+ hours",
    ],
  },
];

function BeyondItem({ text }: { text: string }) {
  const at = text.indexOf(": ");
  if (at === -1) return <li className="border-b border-line py-3">{text}</li>;
  return (
    <li className="border-b border-line py-3">
      <span className="font-semibold">{text.slice(0, at)}:</span>{" "}
      <span className="text-muted">{text.slice(at + 2)}</span>
    </li>
  );
}

export default function AboutPage() {
  return (
    <div className="tone-ivory grain relative bg-paper text-ink">
      <header className="shell pb-12 pt-10 sm:pb-16 sm:pt-16">
        <p className="annot flex gap-4 border-t border-ink pt-4">
          <span className="text-ink">03</span>
          <span>About</span>
        </p>
        {/* Photo and words as one block, centered together; stacked and centered on phones. */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-8 sm:mt-14 md:flex-row md:gap-12">
          <Image
            src="/about/bhakti.webp"
            alt="Bhakti Ahir"
            width={280}
            height={350}
            preload
            className="portrait h-auto w-[min(15rem,68vw)] shrink-0 md:w-[17.5rem]"
          />
          <div className="text-center md:text-left">
            <h1 className="font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.98]">
              Bhakti Ahir
            </h1>
            <p className="mt-5 max-w-[30rem] font-display text-xl italic leading-snug text-ink">
              {SITE.about}
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
              {FACTS.map((fact) => (
                <li
                  key={fact}
                  className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <MeetBhakti variant="about" />

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
              I’m in 12th grade at The Oxford School. Each project started with
              a real problem: applying to university, studying, finding a
              mentor, and what a neighborhood shares. Long term, I want to build
              a company around real human needs.
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
              Each project taught me something new, because the problem needed
              it.
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

      <Certifications />

      <Reveal className="shell space-y-12 pb-20 sm:pb-28">
        {BEYOND.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`${group.id}-title`}
            className="grid-12 gap-y-4 border-t border-line pt-8"
          >
            <h2
              id={`${group.id}-title`}
              className="annot text-ink lg:col-span-3"
            >
              {group.title}
            </h2>
            <ul className="grid gap-x-10 text-[0.98rem] leading-snug sm:grid-cols-2 lg:col-span-8">
              {group.items.map((item) => (
                <BeyondItem key={item} text={item} />
              ))}
            </ul>
          </section>
        ))}
      </Reveal>

      <NextPage href="/contact" number="04" label="Contact" />
    </div>
  );
}
