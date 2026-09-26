import { SITE } from "@/lib/projects";
import { VerbSystem } from "../verbs/VerbSystem";

/**
 * Reading order: name → philosophy → work → interactive system.
 * Left: five columns of text. Right: seven columns holding the verb system in one frame.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid-field border-b border-line"
    >
      <div className="shell pb-20 pt-6 sm:pb-24">
        {/* The only metadata row in the hero. */}
        <div className="annot flex justify-between gap-4 border-b border-line pb-3">
          <span>Panamá · 9° N, 79.5° W</span>
          <span>Portfolio · 2026</span>
        </div>

        <div className="grid-12 mt-12 gap-y-14 lg:mt-16 lg:items-center">
          <div className="lg:col-span-5">
            <p className="annot text-ink">00 · Index</p>
            <h1
              id="hero-title"
              className="mt-5 font-display text-[clamp(3.25rem,9vw,6.25rem)] uppercase leading-[0.88] tracking-[-0.015em]"
            >
              Bhakti Ahir
            </h1>
            <p className="body-copy mt-5 max-w-[30rem] text-ink">
              Student developer building human-centered tools for learning,
              opportunity, and community.
            </p>

            <blockquote className="mt-10 border-l-2 border-ink pl-5">
              <p className="font-display text-[clamp(1.75rem,3.2vw,2.4rem)] italic leading-[1.12]">
                “{SITE.philosophy}”
              </p>
            </blockquote>
            <p className="body-copy mt-6 max-w-[30rem] text-muted">
              {SITE.statement}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
              >
                Explore the work ↓
              </a>
              <a
                href={SITE.github}
                className="inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft"
              >
                GitHub ↗
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft"
              >
                Email
              </a>
            </div>

            <p className="annot mt-10 border-t border-line pt-4">
              12th grade · The Oxford School, Panama · Computer Science
            </p>
          </div>

          <div className="lg:col-span-7">
            <VerbSystem />
          </div>
        </div>
      </div>
    </section>
  );
}
