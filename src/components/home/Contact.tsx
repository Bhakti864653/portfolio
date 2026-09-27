import { existsSync } from "node:fs";
import path from "node:path";
import { SITE, VERB_ORDER, projectByVerb } from "@/lib/projects";
import { ChapterOpening } from "../ChapterOpening";
import { Monogram } from "../Monogram";
import { CopyEmail } from "../CopyEmail";

// The résumé button only appears once a real file is dropped at public/resume.pdf.
const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

const pill =
  "press inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-semibold text-ink hover:bg-soft";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="tone-warm grain relative scroll-mt-16 bg-paper pb-16 pt-28 sm:pt-40"
    >
      <div className="shell">
        <ChapterOpening
          number="04"
          title="Contact"
          id="contact-title"
          heading={
            <>
              I’m still at the beginning.{" "}
              <span className="italic text-muted">
                That is exactly why I’m building.
              </span>
            </>
          }
        >
          <p>Email is the best way to reach me.</p>
        </ChapterOpening>

        <div className="mt-14">
          <p className="break-all font-mono text-lg sm:text-xl">{SITE.email}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${SITE.email}`}
              className="press inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-semibold text-paper hover:opacity-90"
            >
              Email Bhakti
            </a>
            <a href={SITE.linkedin} className={pill}>
              LinkedIn ↗
            </a>
            <a href={SITE.github} className={pill}>
              GitHub ↗
            </a>
            <CopyEmail email={SITE.email} className={pill} />
            {hasResume && (
              <a href="/resume.pdf" className={pill}>
                Résumé (PDF)
              </a>
            )}
          </div>
        </div>

        {/* The end of the story: the mark and the four verbs, in the order they appeared */}
        <div className="mt-28 flex flex-col items-start gap-6 border-t border-line pt-10 sm:mt-36 sm:flex-row sm:items-center sm:gap-10">
          <Monogram className="h-20 w-auto text-ink sm:h-24" />
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">
            {VERB_ORDER.map((verb, i) => (
              <span key={verb} className="flex items-baseline gap-3">
                <span
                  className={`accent-${projectByVerb(verb).slug} capitalize text-a1`}
                >
                  {verb}
                </span>
                {i < VERB_ORDER.length - 1 && (
                  <span aria-hidden="true" className="text-faint">
                    ·
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
