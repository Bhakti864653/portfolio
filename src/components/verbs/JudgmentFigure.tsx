"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type FocusEvent, type PointerEvent } from "react";
import { projectByVerb, VERB_ORDER, type Verb } from "@/lib/projects";
import { useMotion } from "@/lib/prefs";
import { useAbility } from "./ability";
import { VerbFigure2D } from "./VerbFigure2D";

/** Where each label sits from 768px up: at the outer end of its path (see PATH_BEARINGS). */
const LABEL_POSITION: Record<Verb, string> = {
  decide: "md:left-1/2 md:top-0 md:-translate-x-1/2",
  learn: "md:right-0 md:top-1/2 md:-translate-y-1/2",
  connect: "md:bottom-0 md:left-1/2 md:-translate-x-1/2",
  // Anchored by its right edge beside the disc, so a long project name grows outward, never over it.
  act: "md:right-[calc(100%-7rem)] md:top-1/2 md:-translate-y-1/2",
};
const LABEL_ALIGN: Record<Verb, string> = {
  decide: "md:items-center md:text-center",
  learn: "md:items-end md:text-right",
  connect: "md:items-center md:text-center",
  act: "md:items-end md:text-right",
};

/**
 * The homepage's one visual system: four paths, one per ability and each in its project's color,
 * all running into a fixed center called Human Judgment. Pointing at a path, its label, or the
 * ability in the text makes that path bold, quiets the others, and sends a point from the project
 * in to the center. Every label is a real link (the paths are a pointer shortcut only), and the
 * SVG renders on the server: nothing waits on JavaScript.
 */
export function JudgmentFigure() {
  const { active, setActive } = useAbility();
  const motion = useMotion();
  const router = useRouter();
  const field = useRef<HTMLDivElement>(null);
  const project = active ? projectByVerb(active) : null;

  // A gentle lean toward the pointer: a few pixels at most, eased by CSS.
  function lean(e: PointerEvent<HTMLDivElement>) {
    const el = field.current;
    if (!el || motion !== "full" || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty(
      "--px",
      `${((e.clientX - r.left) / r.width - 0.5) * 2}`,
    );
    el.style.setProperty(
      "--py",
      `${((e.clientY - r.top) / r.height - 0.5) * 2}`,
    );
  }
  function settle() {
    field.current?.style.setProperty("--px", "0");
    field.current?.style.setProperty("--py", "0");
    setActive(null);
  }
  function blur(e: FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null))
      setActive(null);
  }

  return (
    <figure
      aria-labelledby="judgment-caption"
      className={project ? `accent-${project.slug}` : undefined}
      onBlur={blur}
    >
      <figcaption id="judgment-caption" className="sr-only">
        Four paths, one for each ability (decide, learn, connect, and act), all
        meeting at one center: human judgment. Each ability links to the project
        built for it.
      </figcaption>

      <div
        ref={field}
        onPointerMove={lean}
        onPointerLeave={settle}
        className="relative md:mx-auto md:max-w-[40rem] md:px-28 md:py-14 lg:max-w-[42rem]"
      >
        <div
          className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[26rem] lg:max-w-[30rem]"
          style={{
            transform:
              "translate3d(calc(var(--px, 0) * 7px), calc(var(--py, 0) * 7px), 0)",
            transition: "transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        >
          <VerbFigure2D
            active={active}
            animate={motion === "full"}
            onHover={setActive}
            onPick={(verb) => router.push(`/work/${projectByVerb(verb).slug}`)}
          />
          <p
            aria-hidden="true"
            className="annot pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 whitespace-nowrap rounded-sm bg-soft/90 px-1.5 text-center text-ink"
          >
            Human judgment
            <span
              className={`block text-a1 transition-opacity duration-300 ${project ? "opacity-100" : "opacity-0"}`}
            >
              {project ? `→ ${project.name}` : " "}
            </span>
          </p>
        </div>

        {/* On its path's outer end from 768px up; on phones the words above the figure do this job */}
        <ul
          aria-label="Paths to each project"
          className="hidden md:pointer-events-none md:absolute md:inset-0 md:block"
        >
          {VERB_ORDER.map((verb) => {
            const p = projectByVerb(verb);
            const on = active === verb;
            return (
              <li
                key={verb}
                className={`md:pointer-events-auto md:absolute ${LABEL_POSITION[verb]}`}
              >
                <Link
                  href={`/work/${p.slug}`}
                  onMouseEnter={() => setActive(verb)}
                  onFocus={() => setActive(verb)}
                  className={`accent-${p.slug} press group flex min-h-12 flex-col px-2 py-1 transition-opacity duration-300 ${active && !on ? "opacity-45" : ""} ${LABEL_ALIGN[verb]}`}
                >
                  <span
                    className={`font-display text-[1.9rem] capitalize leading-none transition-colors ${on ? "text-a1" : "text-ink"}`}
                  >
                    {verb}
                  </span>
                  <span className="annot mt-1.5 whitespace-nowrap tracking-[0.03em] text-a1">
                    {p.chapter} · {p.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
