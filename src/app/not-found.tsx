import Link from "next/link";
import { Monogram } from "@/components/Monogram";

export default function NotFound() {
  return (
    <section className="shell flex flex-col items-start py-28">
      <Monogram title={null} className="h-16 w-16 text-ink" />
      <p className="annot mt-8">404 · Off the map</p>
      <h1 className="mt-3 font-display text-[clamp(2.8rem,8vw,6rem)] leading-none">
        This path doesn’t lead anywhere.
      </h1>
      <Link
        href="/"
        className="annot mt-10 inline-flex h-11 items-center rounded-full bg-ink px-6 text-paper"
      >
        ← Back to the index
      </Link>
    </section>
  );
}
