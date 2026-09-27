import { existsSync } from "node:fs";
import path from "node:path";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CopyEmail } from "@/components/CopyEmail";
import { Monogram } from "@/components/Monogram";
import { PageMasthead } from "@/components/PageMasthead";
import { svgPath } from "@/lib/geometry";
import { SITE, VERB_ORDER, projectByVerb } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Email, LinkedIn, and GitHub for Bhakti Ahir, a 12th-grade student developer in Panama.",
  alternates: { canonical: "/contact" },
};

// The résumé button only appears once a real file is dropped at public/resume.pdf.
const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

const pill =
  "press inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-semibold text-ink hover:bg-soft";

/** The four project paths, drawn in once, meeting at the BA mark. */
function Convergence() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        fill="none"
      >
        <circle cx="200" cy="200" r="188" stroke="var(--line)" />
        <circle
          cx="200"
          cy="200"
          r="124"
          stroke="var(--line)"
          strokeDasharray="2 6"
        />
        {VERB_ORDER.map((verb, i) => (
          <path
            key={verb}
            d={svgPath(verb, 200, 200, 188)}
            pathLength={1}
            className={`accent-${projectByVerb(verb).slug} enter-draw`}
            stroke="var(--a1)"
            strokeWidth={2}
            strokeLinecap="round"
            style={
              { "--len": 1, "--delay": `${200 + i * 160}ms` } as CSSProperties
            }
          />
        ))}
        <circle cx="200" cy="200" r="64" fill="var(--paper)" />
        <circle cx="200" cy="200" r="64" stroke="var(--line-strong)" />
      </svg>
      <Monogram
        title="Bhakti Ahir"
        strokeWidth={4}
        className="absolute left-1/2 top-1/2 h-auto w-[22%] -translate-x-1/2 -translate-y-1/2 text-ink"
      />
    </div>
  );
}

export default function ContactPage() {
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
      />

      <section
        aria-label="Ways to reach me"
        className="shell grid-12 gap-y-14 pb-24 pt-6 sm:pb-32 lg:items-center"
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

          <dl className="mt-12 border-t border-line">
            {[
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
                value: "12th-grade student, The Oxford School",
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
            ].map((row) => (
              <div
                key={row.term}
                className="flex gap-6 border-b border-line py-3.5"
              >
                <dt className="annot w-24 shrink-0 pt-0.5">{row.term}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Convergence />
          <p className="annot mt-6 text-center">
            Decide · Learn · Connect · Act
          </p>
        </div>
      </section>
    </div>
  );
}
