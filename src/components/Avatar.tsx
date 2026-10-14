import Image from "next/image";

/** The About photo as a small circle, for the lines that introduce me on Home and Contact. */
export function Avatar({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/about/bhakti.webp"
      alt="Bhakti Ahir"
      width={48}
      height={48}
      className={`avatar size-12 shrink-0 ${className}`}
    />
  );
}
