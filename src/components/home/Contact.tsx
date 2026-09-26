import { existsSync } from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/projects";
import { ChapterOpening } from "../ChapterOpening";
import { CopyEmail } from "../CopyEmail";

// The résumé button only appears once a real file is dropped at public/resume.pdf.
const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

const pill =
  "inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-semibold text-ink hover:bg-paper";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-16 border-t border-line bg-soft py-24 sm:py-32"
    >
      <div className="shell">
        <ChapterOpening
          part="IV"
          label="Contact"
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
              className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-semibold text-paper hover:opacity-90"
            >
              Email Bhakti
            </a>
            <CopyEmail email={SITE.email} className={pill} />
            <a href={SITE.github} className={pill}>
              GitHub ↗
            </a>
            <a href={SITE.linkedin} className={pill}>
              LinkedIn ↗
            </a>
            {hasResume && (
              <a href="/resume.pdf" className={pill}>
                Résumé (PDF)
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
