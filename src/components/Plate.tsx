import Image from "next/image";
import type { Project } from "@/lib/projects";

/** A screenshot mounted like a plate in an atlas: framed, offset over its accent, and captioned. */
export function Plate({
  project,
  figure,
  priority = false,
}: {
  project: Project;
  figure: string;
  priority?: boolean;
}) {
  return (
    <figure className={`accent-${project.slug}`}>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-2 translate-y-2 rounded-[4px] bg-a2 opacity-20 sm:translate-x-5 sm:translate-y-5"
        />
        <div className="relative rounded-[4px] border border-line-strong bg-soft p-1.5 sm:p-2">
          <div
            className="flex items-center gap-1.5 px-1 pb-1.5 sm:pb-2"
            aria-hidden="true"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-a1" />
            <span className="h-1.5 w-1.5 rounded-full border border-line-strong" />
            <span className="h-1.5 w-1.5 rounded-full border border-line-strong" />
            <span className="annot ml-2 truncate normal-case tracking-normal">
              {project.live.replace(/^https:\/\//, "").replace(/\/$/, "")}
            </span>
          </div>
          <Image
            src={project.screenshot.src}
            alt={project.screenshot.alt}
            width={1440}
            height={900}
            sizes="(min-width: 1024px) 56vw, 100vw"
            priority={priority}
            className="block h-auto w-full rounded-[2px] border border-line"
          />
        </div>
      </div>
      <figcaption className="annot mt-5">
        Fig. {figure} · {project.name}, live app
      </figcaption>
    </figure>
  );
}
