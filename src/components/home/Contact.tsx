import { existsSync } from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/projects";
import { CopyEmail } from "../CopyEmail";
import { Monogram } from "../Monogram";

// The résumé button only appears once a real file is dropped at public/resume.pdf.
const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

const pill =
  "annot inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-ink hover:bg-soft";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative scroll-mt-16 overflow-hidden py-28 sm:py-40"
    >
      <Monogram
        title={null}
        strokeWidth={0.6}
        className="pointer-events-none absolute -right-[10%] top-1/2 h-[140%] -translate-y-1/2 text-line-strong opacity-60 sm:right-[-4%]"
      />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="annot flex justify-between border-t border-ink pt-3">
          <span>Part IV · Contact</span>
          <span>Fin.</span>
        </div>
        <h2
          id="contact-title"
          className="mt-12 max-w-5xl font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.94]"
        >
          I’m still at the beginning.{" "}
          <span className="italic text-muted">
            That is exactly why I’m building.
          </span>
        </h2>

        <p className="mt-12 break-all font-mono text-lg sm:text-xl">
          {SITE.email}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${SITE.email}`}
            className="annot inline-flex h-12 items-center rounded-full bg-ink px-7 text-paper hover:opacity-90"
          >
            Email Bhakti
          </a>
          <CopyEmail email={SITE.email} className={pill} />
          <a href={SITE.github} className={pill}>
            GitHub ↗
          </a>
          {hasResume && (
            <a href="/resume.pdf" className={pill}>
              Résumé (PDF)
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
