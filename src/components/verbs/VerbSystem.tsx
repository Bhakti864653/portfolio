"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useState, type ReactNode } from "react";
import { PROJECTS, projectByVerb, VERB_ORDER, type Verb } from "@/lib/projects";
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

/** Where each label sits on wide screens: at the outer end of its path. */
const LABEL_POSITION: Record<Verb, string> = {
  decide: "md:left-1/2 md:top-0 md:-translate-x-1/2",
  connect: "md:right-0 md:top-1/2 md:-translate-y-1/2",
  learn: "md:bottom-0 md:left-1/2 md:-translate-x-1/2",
  act: "md:left-0 md:top-1/2 md:-translate-y-1/2",
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
    <div className={project ? `accent-${project.slug}` : undefined}>
      <div className="relative mx-auto w-full max-w-[640px] md:px-16 md:py-14">
        {/* The figure */}
        <div className="relative aspect-square w-full">
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
          <p className="annot pointer-events-none absolute left-1/2 top-[calc(50%+26px)] -translate-x-1/2 whitespace-nowrap text-ink">
            Human judgment
          </p>
        </div>

        {/* The four verbs: a 2×2 grid on phones, placed on their paths from 768px up */}
        <ul
          className="mt-6 grid grid-cols-2 gap-2 md:pointer-events-none md:absolute md:inset-0 md:m-0 md:block"
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
                  className={`accent-${p.slug} group flex w-full flex-col items-start rounded-[6px] border px-3 py-2 text-left transition-colors md:w-auto md:items-center md:text-center ${
                    on
                      ? "border-a1 bg-soft"
                      : "border-line bg-paper/80 hover:border-line-strong"
                  }`}
                >
                  <span className="annot">
                    {p.chapter} · {p.name}
                  </span>
                  <span
                    className={`font-display text-3xl capitalize leading-tight ${on ? "text-a1" : "text-ink"}`}
                  >
                    {verb}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* What the chosen path leads to */}
      <div
        id="verb-panel"
        aria-live="polite"
        className="mx-auto mt-6 min-h-[13rem] max-w-[640px] border-t border-line pt-5"
      >
        {project ? (
          <div>
            <p className="annot">
              Chapter {project.chapter} ·{" "}
              <span className="capitalize">{project.verb}</span> →{" "}
              {project.name}
            </p>
            <p className="mt-2 font-display text-3xl leading-tight text-a1">
              {project.tagline}
            </p>
            <p className="mt-3 max-w-prose text-[0.98rem] leading-relaxed text-muted">
              {project.intro}
            </p>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={`#${project.slug}`}
                className="annot text-ink underline underline-offset-4"
              >
                Read the chapter ↓
              </a>
              <Link
                href={`/work/${project.slug}`}
                className="annot text-ink underline underline-offset-4"
              >
                Full case study →
              </Link>
            </p>
          </div>
        ) : (
          <div>
            <p className="annot">Fig. 0 · Four paths, one fixed point</p>
            <p className="mt-2 max-w-prose text-[0.98rem] leading-relaxed text-muted">
              Each path is one thing people do, and one project I built to help
              them do it. They all run through the same center. Choose a verb to
              follow its path.
            </p>
            <p className="annot mt-4">{PROJECTS.length} live projects</p>
          </div>
        )}
      </div>
    </div>
  );
}
