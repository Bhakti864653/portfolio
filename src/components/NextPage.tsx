import Link from "next/link";

/** The end of a page: a large link to the next one in the index. */
export function NextPage({
  href,
  number,
  label,
}: {
  href: string;
  number: string;
  label: string;
}) {
  return (
    <Link href={href} className="group block border-t border-line">
      <div className="shell flex flex-wrap items-baseline justify-between gap-4 py-12 sm:py-16">
        <span className="annot">Next · {number}</span>
        <span className="font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-none group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">
          {label} →
        </span>
      </div>
    </Link>
  );
}
