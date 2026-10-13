import type { ReactNode } from "react";

/**
 * How Work, Journey, About, and Contact begin: the page number and name on a rule, then the page
 * title beside an oversized low-contrast number and a short introduction. A page can pass `media`
 * (About's photo) to show in place of the number: beside the title on desktop, under it on phones.
 */
export function PageMasthead({
  number,
  label,
  title,
  children,
  media,
  className = "",
}: {
  number: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
  media?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`shell relative pb-10 pt-10 sm:pb-16 sm:pt-16 ${className}`}
    >
      <p className="annot flex gap-4 border-t border-ink pt-4">
        <span className="text-ink">{number}</span>
        <span>{label}</span>
      </p>
      <div className="grid-12 mt-10 gap-y-6 sm:mt-14">
        <h1 className="font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.98] lg:col-span-8">
          {title}
        </h1>
        <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-between">
          {media ? (
            <div className="w-[min(15rem,68vw)] lg:ml-auto lg:w-full lg:max-w-[17.5rem]">
              {media}
            </div>
          ) : (
            <span
              aria-hidden="true"
              className="hidden select-none text-right font-display text-[clamp(7rem,12vw,11rem)] leading-[0.8] text-ink opacity-[0.07] lg:block"
            >
              {number}
            </span>
          )}
          {children && (
            <div
              className={`body-copy max-w-[30rem] text-muted lg:mt-6 ${media ? "mt-6" : ""}`}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
