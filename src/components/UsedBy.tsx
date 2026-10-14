/** Who has really used a project (projects.ts `usedBy`). Callers render it only when it's set. */
export function UsedBy({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`flex items-baseline gap-2 text-[0.95rem] leading-snug text-ink ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-a1"
      />
      {text}
    </span>
  );
}
