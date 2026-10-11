"use client";

import { useEffect, type CSSProperties } from "react";

const NAME = "Bhakti Ahir";
/** When the name has fully gone (keep in step with .intro in globals.css). */
const LENGTH = 1700;
const LEAVE = 320;

/**
 * The opening, first visit only: my name assembles letter by letter on the paper, then scatters
 * away as the statement rises in its place, all in under two seconds. Any key, click, tap, or
 * scroll skips it. It plays over the real page rather than behind a curtain, so the page is
 * painted (and counts as loaded) from the very first frame.
 *
 * Whether it plays is decided before first paint by the boot script in lib/prefs.ts (home page,
 * full motion, not seen before), which sets data-intro="play" on <html>. Without that, the
 * intro is display: none, so it never flashes for returning visitors, under reduced motion,
 * or without JavaScript. It is decorative only: the real page is already there underneath.
 */
export function Intro() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "play") return;
    try {
      localStorage.setItem("introSeen", "1");
    } catch {
      // Blocked storage: it may play again next visit, which is harmless.
    }
    let leaving: ReturnType<typeof setTimeout> | undefined;
    const done = () => {
      root.dataset.intro = "done";
      cleanup();
    };
    const skip = () => {
      if (root.dataset.intro !== "play") return;
      root.dataset.intro = "leaving";
      clearTimeout(finish);
      leaving = setTimeout(done, LEAVE);
    };
    const finish = setTimeout(done, LENGTH);
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    function cleanup() {
      clearTimeout(finish);
      for (const type of events) window.removeEventListener(type, skip);
    }
    for (const type of events)
      window.addEventListener(type, skip, { passive: true });
    return () => {
      cleanup();
      clearTimeout(leaving);
      if (root.dataset.intro !== "done") root.dataset.intro = "done";
    };
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <p className="intro-name">
        {[...NAME].map((ch, i) => (
          <span
            key={i}
            className="intro-letter"
            style={
              {
                "--i": i,
                "--fx": `${((i * 47) % 9) - 4}em`,
                "--fy": `${((i * 29) % 7) - 3}em`,
                "--fr": `${((i * 71) % 90) - 45}deg`,
              } as CSSProperties
            }
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>
      <span className="intro-rule" />
      <span className="intro-skip annot">Press any key to skip</span>
    </div>
  );
}
