"use client";

import Link from "next/link";
import type { Ref } from "react";
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
 * decoded at the moment you point. That is what keeps the switch smooth.
 *
 * There are two slots in the page, beside the figure on wide screens and under it on narrower
 * ones; only the one on screen takes part in the morph, so the transition always has a single
 * source. The cards repeat what each path's own link says, so they stay out of the tab order:
 * keyboard users open the project from the path itself.
 */
export function PreviewSlot({ slotRef }: { slotRef?: Ref<HTMLDivElement> }) {
  const { active, setActive, release } = useAbility();
  const wide = useMediaQuery("(min-width: 1024px)");
  const onScreen = slotRef ? wide : !wide;

  return (
    <div
      ref={slotRef}
      className="preview-slot"
      data-open={!!active || undefined}
    >
      <p className="annot preview-hint" aria-hidden={!!active || undefined}>
        <span className="hint-pointer">Point at</span>
        <span className="hint-touch">Tap</span> a path to preview its project
      </p>
      {PROJECTS.map((p) => {
        const on = active === p.verb;
        return (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            data-cursor="View"
            data-on={on || undefined}
            onMouseEnter={() => setActive(p.verb)}
            onMouseLeave={release}
            className={`preview-card accent-${p.slug} block overflow-hidden rounded-[10px] border border-line-strong bg-soft shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)]`}
          >
            <MediaSlot
              project={p}
              sizes="(min-width: 1024px) 26rem, 90vw"
              morph={onScreen}
              imageClassName="preview-image"
            />
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
          </Link>
        );
      })}
    </div>
  );
}
