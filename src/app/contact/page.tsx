import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { CopyEmail } from "@/components/CopyEmail";
import { PageMasthead } from "@/components/PageMasthead";
import { SITE } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Email, LinkedIn, and GitHub for Bhakti Ahir, a 12th-grade student developer in Panama.",
  alternates: { canonical: "/contact" },
};

// The résumé row only appears once a real file is dropped at public/resume.pdf.
const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

const pill =
  "press inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-semibold text-ink hover:bg-soft";

export default function ContactPage() {
  const rows = [
    {
      term: "LinkedIn",
      value: (
        <a href={SITE.linkedin} className="link-draw text-ink">
          bhakti-ahir ↗
        </a>
      ),
    },
    {
      term: "GitHub",
      value: (
        <a href={SITE.github} className="link-draw text-ink">
          Bhakti864653 ↗
        </a>
      ),
    },
    { term: "Location", value: "Panama" },
    {
      term: "Status",
      value: "Student developer, 12th grade, The Oxford School",
    },
    ...(hasResume
      ? [
          {
            term: "Résumé",
            value: (
              <a href="/resume.pdf" className="link-draw text-ink">
                PDF ↓
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="tone-warm grain relative bg-paper">
      <PageMasthead
        number="04"
        label="Contact"
        title={
          <>
            Let’s build technology that leaves people{" "}
            <span className="italic text-muted">
              more capable than it found them.
            </span>
          </>
        }
      >
        <p className="font-display text-xl italic text-ink">
          {SITE.philosophy}
        </p>
      </PageMasthead>

      <section
        aria-label="Ways to reach me"
        className="shell grid-12 gap-y-12 pb-24 pt-6 sm:pb-32 lg:items-start"
      >
        <div className="lg:col-span-6">
          <p className="annot">Email is the best way to reach me</p>
          <p className="mt-3 break-all font-mono text-lg sm:text-2xl">
            {SITE.email}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${SITE.email}`}
              className="press inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-semibold text-paper hover:opacity-90"
            >
              Email Bhakti
            </a>
            <CopyEmail email={SITE.email} className={pill} />
          </div>
        </div>
        <dl className="border-t border-line lg:col-span-5 lg:col-start-8">
          {rows.map((row) => (
            <div
              key={row.term}
              className="flex gap-6 border-b border-line py-3.5"
            >
              <dt className="annot w-24 shrink-0 pt-0.5">{row.term}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
