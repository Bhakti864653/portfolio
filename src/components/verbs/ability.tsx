"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Verb } from "@/lib/projects";

type AbilityState = {
  active: Verb | null;
  setActive: (verb: Verb | null) => void;
};

const AbilityContext = createContext<AbilityState | null>(null);

/**
 * Shares the chosen ability between the idea screen's words and its figure, so pointing at
 * "Learn" in the text brings Learn's path forward in the figure, and the other way round.
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
