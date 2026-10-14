import Link from "next/link";
import { SITE } from "@/lib/projects";
import { Avatar } from "../Avatar";
import { CopyEmail } from "../CopyEmail";

const secondary =
  "press inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft";

/** The last screen: who I am, in one line, and the ways onward. */
export function Closing({ hasResume }: { hasResume: boolean }) {
  return (
    <section
      aria-labelledby="closing-title"
      className="tone-ivory below-fold bg-paper py-24 sm:py-36"
    >
      <div className="shell grid-12 gap-y-10">
        <div className="flex items-center gap-3 lg:col-span-2 lg:flex-col lg:items-start">
          <Avatar />
          <p className="annot text-ink">About me</p>
        </div>
        <div className="lg:col-span-10">
          <h2
            id="closing-title"
            className="font-display text-[clamp(2.4rem,5.6vw,5rem)] leading-[1.02]"
          >
            {SITE.about}
          </h2>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/work"
              data-magnetic
              className="press inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
            >
              Explore all work →
            </Link>
            <Link href="/journey" data-magnetic className={secondary}>
              Read my journey
            </Link>
            <Link href="/about" data-magnetic className={secondary}>
              More about me
            </Link>
            <CopyEmail email={SITE.email} className={secondary} />
            {hasResume && (
              <a href="/resume.pdf" data-magnetic className={secondary}>
                Résumé ↓
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
