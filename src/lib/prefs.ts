"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
export type Motion = "full" | "reduce";

/**
 * Runs in <head> before first paint. An explicit choice saved in localStorage wins; otherwise the
 * OS preference decides. Kept as a string so layout.tsx can inline it.
 */
export const PREFS_BOOT_SCRIPT = `(function(){var d=document.documentElement;var t,m;try{t=localStorage.getItem('theme');m=localStorage.getItem('motion')}catch(e){}if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(m!=='full'&&m!=='reduce'){m=matchMedia('(prefers-reduced-motion: reduce)').matches?'reduce':'full'}d.dataset.theme=t;d.dataset.motion=m})()`;

function subscribeToRoot(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-motion"],
  });
  return () => observer.disconnect();
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribeToRoot,
    () =>
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    () => "light",
  );
}

/** On the server (and during hydration) motion counts as reduced, so nothing animates before we know. */
export function useMotion(): Motion {
  return useSyncExternalStore(
    subscribeToRoot,
    () =>
      document.documentElement.dataset.motion === "reduce" ? "reduce" : "full",
    () => "reduce",
  );
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the choice still applies for this visit.
  }
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  save("theme", theme);
}

export function setMotion(motion: Motion) {
  document.documentElement.dataset.motion = motion;
  save("motion", motion);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const list = matchMedia(query);
      list.addEventListener("change", callback);
      return () => list.removeEventListener("change", callback);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}
