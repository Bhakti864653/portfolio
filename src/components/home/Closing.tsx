import Link from "next/link";

const secondary =
  "press inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-soft";

/** Act III. One sentence, three ways onward. */
export function Closing() {
  return (
    <section
      aria-labelledby="closing-title"
      className="tone-ivory bg-paper py-20 sm:py-28"
    >
      <div className="shell grid-12 gap-y-10">
        <p className="annot text-ink lg:col-span-2">The principle</p>
        <div className="lg:col-span-9">
          <h2
            id="closing-title"
            className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.04]"
          >
            Four systems. One principle:{" "}
            <span className="text-muted">
              technology should increase a person’s ability to choose and
              act—not replace it.
            </span>
          </h2>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="press inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper hover:opacity-90"
            >
              Explore all work →
            </Link>
            <Link href="/journey" className={secondary}>
              Read my journey
            </Link>
            <Link href="/contact" className={secondary}>
              Contact me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
