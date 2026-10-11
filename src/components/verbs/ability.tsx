"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Verb } from "@/lib/projects";

type AbilityState = {
  active: Verb | null;
  setActive: (verb: Verb | null) => void;
  /**
   * Clears the choice after a short grace period, so the pointer can travel from a path to its
   * preview card without the card disappearing on the way. Choosing again cancels it.
   */
  release: () => void;
};

const AbilityContext = createContext<AbilityState | null>(null);
const GRACE = 450;

function useAbilityState(): AbilityState {
  const [active, set] = useState<Verb | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const setActive = useCallback((verb: Verb | null) => {
    clearTimeout(timer.current);
    set(verb);
  }, []);
  const release = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => set(null), GRACE);
  }, []);
  return useMemo(
    () => ({ active, setActive, release }),
    [active, setActive, release],
  );
}

/**
 * Shares the chosen ability between the figure's paths and the project preview card, so
 * pointing at "Learn" brings Learn's path forward and shows Synaptiq's preview.
 */
export function AbilityProvider({ children }: { children: ReactNode }) {
  const value = useAbilityState();
  return (
    <AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>
  );
}

/**
 * A region that keeps the chosen ability while the pointer is anywhere inside it, and lets it go
 * (after the usual grace period) only when the pointer leaves the region entirely. The idea
 * screen uses it, so the pointer can travel from a path across to its preview card.
 */
export function AbilityArea({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { release } = useAbility();
  return (
    <div className={className} onMouseLeave={release}>
      {children}
    </div>
  );
}

/** The shared ability when inside a provider; otherwise a private one (used on its own). */
export function useAbility(): AbilityState {
  const shared = useContext(AbilityContext);
  const own = useAbilityState();
  return shared ?? own;
}
