import { SITE } from "@/lib/projects";
import { VerbSystem } from "../verbs/VerbSystem";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-[1440px] px-4 pb-20 pt-8 sm:px-8 sm:pt-10"
    >
      <div className="annot flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
        <span>00 · Index</span>
        <span className="hidden sm:inline">Panamá · 9° N, 79.5° W</span>
        <span>Portfolio · 2026</span>
      </div>

      <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:pt-6">
          <h1
            id="hero-title"
            className="font-display text-[clamp(3.4rem,15vw,8.6rem)] uppercase leading-[0.84] tracking-[-0.02em]"
          >
            Bhakti
            <br />
            Ahir
          </h1>
          <p className="annot mt-6 max-w-sm leading-relaxed">
            Student developer building human-centered tools for learning,
            opportunity, and community.
          </p>

          <blockquote className="mt-10 border-l border-ink pl-5">
            <p className="font-display text-[clamp(1.9rem,4.2vw,2.8rem)] italic leading-[1.05]">
              “{SITE.philosophy}”
            </p>
          </blockquote>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted">
            {SITE.statement}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="annot inline-flex h-11 items-center rounded-full bg-ink px-6 text-paper hover:opacity-90"
            >
              Explore the work ↓
            </a>
            <a
              href={SITE.github}
              className="annot inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-ink hover:bg-soft"
            >
              GitHub ↗
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="annot inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-ink hover:bg-soft"
            >
              Email
            </a>
          </div>
          <p className="annot mt-8">
            12th grade · The Oxford School, Panama · Computer Science
          </p>
        </div>

        <div className="lg:col-span-7">
          <VerbSystem />
        </div>
      </div>
    </section>
  );
}
