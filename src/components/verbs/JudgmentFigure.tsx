"use client";

import Link from "next/link";
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
  act: "md:left-0 md:top-1/2 md:-translate-y-1/2",
};
const LABEL_ALIGN: Record<Verb, string> = {
  decide: "md:items-center md:text-center",
  learn: "md:items-end md:text-right",
  connect: "md:items-center md:text-center",
  act: "md:items-start",
};

/**
 * The homepage's one visual system: four paths, one per ability, all running into a fixed
 * center called Human Judgment. Choosing an ability traces its path in the project's color and
 * names the project. Every label is a real link, so the figure is never the only way in, and the
 * SVG renders on the server: nothing waits on JavaScript.
 */
export function JudgmentFigure() {
  const { active, setActive } = useAbility();
  const motion = useMotion();
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
        className="relative md:mx-auto md:max-w-[36rem] md:px-20 md:py-12 lg:max-w-[40rem]"
      >
        <div
          className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[24rem] md:max-w-[26rem] lg:max-w-[30rem]"
          style={{
            transform:
              "translate3d(calc(var(--px, 0) * 7px), calc(var(--py, 0) * 7px), 0)",
            transition: "transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        >
          <VerbFigure2D active={active} animate={motion === "full"} />
          <p
            aria-hidden="true"
            className="annot pointer-events-none absolute left-1/2 top-[calc(50%+26px)] -translate-x-1/2 whitespace-nowrap rounded-sm bg-paper/85 px-1.5 text-center text-ink"
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
                  className={`accent-${p.slug} press group flex min-h-12 flex-col rounded-[4px] border px-3 py-2 transition-colors md:border-transparent md:px-2 md:py-1 ${on ? "border-a1" : "border-line-strong"} ${LABEL_ALIGN[verb]}`}
                >
                  <span
                    className={`font-display text-[1.7rem] capitalize leading-tight transition-colors ${on ? "text-a1" : "text-ink"}`}
                  >
                    {verb}
                  </span>
                  <span
                    className={`annot whitespace-nowrap tracking-[0.03em] transition-opacity duration-300 ${on ? "text-a1 md:opacity-100" : "md:opacity-0"}`}
                  >
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
