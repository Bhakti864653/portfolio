"use client";

import { useEffect, useState, type CSSProperties } from "react";

export type EggKind = "panama" | "india";

const EGGS: Record<EggKind, { caption: string; colors: string[] }> = {
  panama: {
    caption: "¡Hola! Born in Panama 🇵🇦",
    colors: ["#d21034", "#072357", "#ffffff"],
  },
  india: {
    caption: "Namaste! Grew up partly in India 🇮🇳",
    colors: ["#ff9933", "#ffffff", "#138808", "#000080"],
  },
};

const EVENT = "bhakti:egg";

/** Lets anything (e.g. tapping my name five times on a phone) trigger an egg. */
export function triggerEgg(kind: EggKind) {
  window.dispatchEvent(new CustomEvent<EggKind>(EVENT, { detail: kind }));
}

const PIECES = 28;

/**
 * A hidden nod to my story: type "panama" or "india" anywhere (outside a text field) and a
 * short burst of that flag's colors rises from the bottom of the screen, with a one-line
 * caption. Under reduced motion only the caption appears. It never takes focus or blocks
 * clicks, and it clears itself after a few seconds.
 */
export function EasterEgg() {
  const [egg, setEgg] = useState<{ kind: EggKind; id: number } | null>(null);

  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      )
        return;
      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
      typed = (typed + e.key.toLowerCase()).slice(-6);
      for (const kind of Object.keys(EGGS) as EggKind[])
        if (typed.endsWith(kind)) {
          typed = "";
          setEgg({ kind, id: Date.now() });
        }
    };
    const onEgg = (e: Event) =>
      setEgg({ kind: (e as CustomEvent<EggKind>).detail, id: Date.now() });
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENT, onEgg);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENT, onEgg);
    };
  }, []);

  useEffect(() => {
    if (!egg) return;
    const timer = setTimeout(() => setEgg(null), 4200);
    return () => clearTimeout(timer);
  }, [egg]);

  const { caption, colors } = egg ? EGGS[egg.kind] : EGGS.panama;

  return (
    <div aria-live="polite" className="egg-layer">
      {egg && (
        <div key={egg.id} className="egg">
          <div aria-hidden="true" className="egg-burst">
            {Array.from({ length: PIECES }, (_, i) => (
              <span
                key={i}
                style={
                  {
                    "--x": `${((i * 37) % 100) - 50}vw`,
                    "--r": `${(i * 53) % 360}deg`,
                    "--d": `${(i % 7) * 60}ms`,
                    "--c": colors[i % colors.length],
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <p className="egg-caption">{caption}</p>
        </div>
      )}
    </div>
  );
}
