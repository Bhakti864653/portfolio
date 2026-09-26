import type { ReactNode } from "react";

/**
 * The one way every homepage chapter begins: part number and label on a rule, then a heading
 * (seven columns) and a short introduction (four columns, aligned to the right edge).
 */
export function ChapterOpening({
  part,
  label,
  id,
  heading,
  children,
}: {
  part: string;
  label: string;
  /** id of the heading, for the section's aria-labelledby. */
  id: string;
  heading: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="grid-12 gap-y-6 border-t border-ink pt-4">
      <p className="annot flex gap-4 lg:col-span-12">
        <span className="text-ink">Part {part}</span>
        <span>{label}</span>
      </p>
      <h2
        id={id}
        className="font-display text-[clamp(2.4rem,5.2vw,4.25rem)] leading-[1.02] lg:col-span-7"
      >
        {heading}
      </h2>
      {children && (
        <div className="body-copy max-w-[36rem] text-muted lg:col-span-4 lg:col-start-9 lg:self-end">
          {children}
        </div>
      )}
    </header>
  );
}
