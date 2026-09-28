"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useState,
  type FocusEvent,
  type ReactNode,
} from "react";
import { SITE, VERB_ORDER, projectByVerb, type Verb } from "@/lib/projects";

type AbilityState = {
  active: Verb | null;
  setActive: (verb: Verb | null) => void;
};

const AbilityContext = createContext<AbilityState | null>(null);

/**
 * Shares the chosen ability between the opening's words and its figure, so pointing at "Learn"
 * in the text traces Learn's path in the figure, and the other way round.
 */
export function AbilityProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Verb | null>(null);
  return (
    <AbilityContext.Provider value={{ active, setActive }}>
      {children}
    </AbilityContext.Provider>
  );
}

/** The shared ability when inside a provider; otherwise a private one (used on its own). */
export function useAbility(): AbilityState {
  const shared = useContext(AbilityContext);
  const [active, setActive] = useState<Verb | null>(null);
  return shared ?? { active, setActive };
}

/**
 * The four abilities as links to their projects. Pointing at one names the project it became,
 * in the line where the philosophy sits, and lights its path in the figure. The philosophy
 * returns as soon as the pointer or focus moves on.
 */
export function AbilityRow() {
  const { active, setActive } = useAbility();
  const project = active ? projectByVerb(active) : null;

  function blur(e: FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null))
      setActive(null);
  }

  return (
    <div onMouseLeave={() => setActive(null)} onBlur={blur}>
      <ul
        aria-label="Four abilities"
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-tight"
      >
        {VERB_ORDER.map((verb, i) => {
          const p = projectByVerb(verb);
          return (
            <li key={verb} className="flex items-baseline gap-3">
              <Link
                href={`/work/${p.slug}`}
                onMouseEnter={() => setActive(verb)}
                onFocus={() => setActive(verb)}
                className={`accent-${p.slug} link-draw capitalize text-a1`}
              >
                {verb}
                <span className="sr-only">: {p.name}</span>
              </Link>
              {i < VERB_ORDER.length - 1 && (
                <span aria-hidden="true" className="text-faint">
                  ·
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 min-h-[3.6rem] max-w-[34rem] font-display text-xl italic leading-snug text-muted sm:min-h-[2rem]">
        {project ? (
          <span className={`accent-${project.slug}`}>
            <span className="not-italic text-a1">{project.name}:</span>{" "}
            {project.tagline}
          </span>
        ) : (
          SITE.philosophy
        )}
      </p>
    </div>
  );
}
