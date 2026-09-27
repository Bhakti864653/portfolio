import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * How every homepage chapter begins: an oversized, low-contrast chapter number behind a rule
 * with the chapter's number and title, then a heading (seven columns) and a short introduction.
 */
export function ChapterOpening({
  number,
  title,
  id,
  heading,
  children,
}: {
  number: string;
  title: string;
  /** id of the heading, for the section's aria-labelledby. */
  id: string;
  heading: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <header className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.42em] right-0 select-none font-display text-[clamp(8rem,24vw,20rem)] leading-none text-ink opacity-[0.07]"
        >
          {number}
        </span>
        <div className="grid-12 relative gap-y-6 border-t border-ink pt-4">
          <p className="annot flex gap-4 lg:col-span-12">
            <span className="text-ink">Chapter {number}</span>
            <span>{title}</span>
          </p>
          <h2
            id={id}
            className="font-display text-[clamp(2.5rem,5.6vw,4.6rem)] leading-[1.02] lg:col-span-7"
          >
            {heading}
          </h2>
          {children && (
            <div className="body-copy max-w-[36rem] text-muted lg:col-span-4 lg:col-start-9 lg:self-end">
              {children}
            </div>
          )}
        </div>
      </header>
    </Reveal>
  );
}

/** How every chapter ends: a rule that names what comes next. */
export function ChapterClose({
  number,
  next,
}: {
  number: string;
  next?: { href: string; label: string };
}) {
  return (
    <div className="annot mt-24 flex flex-wrap justify-between gap-3 border-t border-line pt-4 sm:mt-28">
      <span>End of chapter {number}</span>
      {next && (
        <a href={next.href} className="link-draw text-ink">
          Next · {next.label} ↓
        </a>
      )}
    </div>
  );
}
