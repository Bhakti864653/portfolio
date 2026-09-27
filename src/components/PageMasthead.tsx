import type { ReactNode } from "react";

/**
 * How Work, Journey, About, and Contact begin: the page number and name on a rule, then the page
 * title beside an oversized low-contrast number and a short introduction.
 */
export function PageMasthead({
  number,
  label,
  title,
  children,
  className = "",
}: {
  number: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
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
        <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] lg:col-span-8">
          {title}
        </h1>
        <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-between">
          <span
            aria-hidden="true"
            className="hidden select-none text-right font-display text-[clamp(7rem,12vw,11rem)] leading-[0.8] text-ink opacity-[0.07] lg:block"
          >
            {number}
          </span>
          {children && (
            <div className="body-copy max-w-[30rem] text-muted lg:mt-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
