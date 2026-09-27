"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useState, type ReactNode } from "react";
import { projectByVerb, VERB_ORDER, type Verb } from "@/lib/projects";
import { useMediaQuery, useMotion, useWebGLSupport } from "@/lib/prefs";
import { VerbFigure2D } from "./VerbFigure2D";

// Loaded only when it will actually be shown: desktop width, full motion, WebGL available.
const VerbScene3D = dynamic(() => import("./VerbScene3D"), {
  ssr: false,
  loading: () => null,
});

class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Where each label sits from 768px up: at the outer end of its path (see PATH_BEARINGS). */
const LABEL_POSITION: Record<Verb, string> = {
  decide: "md:left-1/2 md:top-3 md:-translate-x-1/2",
  learn: "md:right-3 md:top-1/2 md:-translate-y-1/2",
  connect: "md:bottom-3 md:left-1/2 md:-translate-x-1/2",
  act: "md:left-3 md:top-1/2 md:-translate-y-1/2",
};

export function VerbSystem() {
  const [active, setActive] = useState<Verb | null>(null);
  const motion = useMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const webgl = useWebGLSupport();
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  const use3D = wide && motion === "full" && webgl && !sceneFailed;
  const show3D = use3D && sceneReady;
  const project = active ? projectByVerb(active) : null;

  return (
    <figure
      aria-label="Four paths, one fixed point"
      className={`rounded-[6px] border border-line-strong bg-paper/70 ${project ? `accent-${project.slug}` : ""}`}
    >
      <div className="annot flex justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
        <span>Fig. 0 · Four paths, one fixed point</span>
        <span className="text-ink">Select a path</span>
      </div>

      {/* The figure field: the diagram, with all four labels kept inside the frame */}
      <div className="relative px-4 pt-5 sm:px-5 md:px-24 md:py-16">
        <div className="relative mx-auto aspect-square w-full max-w-[30rem] md:max-w-[26rem]">
          <div
            className="absolute inset-0"
            style={{ opacity: show3D ? 0 : 1, transition: "opacity 600ms" }}
          >
            <VerbFigure2D active={active} animate={motion === "full"} />
          </div>
          {use3D && (
            <SceneBoundary onError={() => setSceneFailed(true)}>
              <div
                className="absolute inset-0"
                style={{ opacity: show3D ? 1 : 0, transition: "opacity 600ms" }}
              >
                <VerbScene3D
                  active={active}
                  onReady={() => setSceneReady(true)}
                />
              </div>
            </SceneBoundary>
          )}
          <p className="annot pointer-events-none absolute left-1/2 top-[calc(50%+28px)] -translate-x-1/2 whitespace-nowrap rounded-sm bg-paper/85 px-1.5 text-ink">
            Human judgment
          </p>
        </div>

        {/* The four abilities: a 2×2 grid on phones, on their paths from 768px up */}
        <ul
          className="mt-5 grid grid-cols-2 gap-2 pb-4 md:pointer-events-none md:absolute md:inset-0 md:m-0 md:block md:pb-0"
          aria-label="Four abilities"
        >
          {VERB_ORDER.map((verb) => {
            const p = projectByVerb(verb);
            const on = active === verb;
            return (
              <li
                key={verb}
                className={`md:pointer-events-auto md:absolute ${LABEL_POSITION[verb]}`}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls="verb-panel"
                  onMouseEnter={() => setActive(verb)}
                  onFocus={() => setActive(verb)}
                  onClick={() => setActive(verb)}
                  className={`accent-${p.slug} press flex min-h-12 w-full flex-col items-start rounded-[6px] px-3 py-2 text-left transition-colors md:w-44 md:items-center md:text-center ${
                    on
                      ? "border-2 border-a1 bg-soft shadow-[inset_0_-3px_0_var(--a1)]"
                      : "border border-line-strong bg-paper hover:border-ink"
                  }`}
                >
                  <span className="annot whitespace-nowrap tracking-[0.03em]">
                    {p.chapter} · {p.name}
                  </span>
                  <span
                    className={`font-display text-[1.75rem] capitalize leading-tight ${on ? "text-a1" : "text-ink"}`}
                  >
                    {verb}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* A stable information area: fixed height, so the layout never moves on selection */}
      <div
        id="verb-panel"
        aria-live="polite"
        className="flex min-h-[17rem] flex-col justify-between border-t border-line px-4 py-5 sm:min-h-[14rem] sm:px-5"
      >
        {project ? (
          <>
            <div>
              <p className="annot">
                <span className="text-a1">Project {project.chapter}</span> ·{" "}
                {project.verb}
              </p>
              <p className="mt-1.5 font-display text-[1.9rem] leading-tight">
                {project.name}
              </p>
              <p className="body-copy mt-1 max-w-[36rem] text-muted">
                {project.summary}
              </p>
            </div>
            <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <a href={`#${project.slug}`} className="link-draw text-ink">
                Go to the project ↓
              </a>
              <Link
                href={`/work/${project.slug}`}
                className="link-draw text-ink"
              >
                Read the {project.name} case study →
              </Link>
            </p>
          </>
        ) : (
          <p className="body-copy max-w-[34rem] text-muted">
            Each path is one thing people do, and one project I built to help
            them do it. Every path runs through the same center.
          </p>
        )}
      </div>
    </figure>
  );
}
