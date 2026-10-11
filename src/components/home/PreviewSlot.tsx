"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/prefs";
import { PROJECTS } from "@/lib/projects";
import { MediaSlot } from "../MediaSlot";
import { useAbility } from "../verbs/ability";

/**
 * Where a project's preview floats in when its path is highlighted: its screenshot (or demo
 * video), one line, and a badge. Clicking it opens the case study, and the picture morphs into
 * the case study's own (a shared-element transition).
 *
 * All four cards are built (and their pictures loaded) ahead of time, stacked in the same spot;
 * choosing a path only fades and slides the right one in, so nothing is created, fetched, or
 * decoded at the moment you point. That is what keeps the switch smooth. They are built just
 * after the page has loaded (or when the slot nears the screen), so they never slow the opening.
 *
 * There are two slots in the page, beside the figure on wide screens and under it on narrower
 * ones; only the one on screen takes part in the morph, so the transition always has a single
 * source. The cards repeat what each path's own link says, so they stay out of the tab order:
 * keyboard users open the project from the path itself.
 */
export function PreviewSlot({
  slotRef,
}: {
  /** Receives the slot, e.g. so the Entrance can aim its line through the gap above it. */
  slotRef?: (el: HTMLDivElement | null) => void;
}) {
  const { active, setActive } = useAbility();
  const wide = useMediaQuery("(min-width: 1024px)");
  const onScreen = slotRef ? wide : !wide;
  // Beside the figure (wide screens) the card is compact, so it always fits on a laptop screen;
  // under the figure (narrow screens) there is room for the full card.
  const compact = !!slotRef;
  const box = useRef<HTMLDivElement | null>(null);
  const [built, setBuilt] = useState(false);

  // Build the cards once the page has settled after loading, or as soon as the slot is about to
  // come into view, whichever is first: always before anyone can point at a path, and never
  // during the first load, which they would slow down.
  useEffect(() => {
    const el = box.current;
    if (!el || built) return;
    const build = () => setBuilt(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) build();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    let idle = 0;
    const whenIdle = () => {
      idle =
        "requestIdleCallback" in window
          ? window.requestIdleCallback(build, { timeout: 3000 })
          : (setTimeout(build, 1500) as unknown as number);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("load", whenIdle);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, [built]);

  return (
    <div
      ref={(el) => {
        box.current = el;
        slotRef?.(el);
      }}
      className="preview-slot"
      data-open={!!active || undefined}
    >
      <p className="annot preview-hint" aria-hidden={!!active || undefined}>
        <span className="hint-pointer">Point at</span>
        <span className="hint-touch">Tap</span> a path to preview its project
      </p>
      {(built || active) &&
        PROJECTS.map((p) => {
          const on = active === p.verb;
          return (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              prefetch={false}
              tabIndex={-1}
              aria-hidden="true"
              data-cursor="View"
              data-on={on || undefined}
              onMouseEnter={() => setActive(p.verb)}
              className={`preview-card accent-${p.slug} ${compact ? "preview-compact grid grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)]" : "block"} overflow-hidden rounded-[10px] border border-line-strong bg-soft shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)]`}
            >
              <MediaSlot
                project={p}
                sizes={compact ? "12rem" : "90vw"}
                morph={onScreen}
                fill={compact}
                imageClassName="preview-image"
              />
              {compact ? (
                <div className="flex min-w-0 flex-col justify-center gap-2 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <p className="font-display text-[1.6rem] leading-none text-a1">
                      {p.name}
                    </p>
                    <span className="badge">{p.badge}</span>
                  </div>
                  <p className="text-[0.9rem] leading-snug text-ink">
                    {p.oneLine}
                  </p>
                  <p className="annot flex items-center gap-2 text-ink">
                    Open the case study <span className="preview-arrow">→</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 p-4">
                    <div>
                      <p className="font-display text-[1.7rem] leading-none text-a1">
                        {p.name}
                      </p>
                      <p className="mt-1.5 text-[0.95rem] leading-snug text-ink">
                        {p.oneLine}
                      </p>
                    </div>
                    <span className="badge shrink-0">{p.badge}</span>
                  </div>
                  <p className="annot flex items-center gap-2 border-t border-line px-4 py-2.5 text-ink">
                    Open the case study <span className="preview-arrow">→</span>
                  </p>
                </>
              )}
            </Link>
          );
        })}
    </div>
  );
}
