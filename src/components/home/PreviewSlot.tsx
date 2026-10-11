"use client";

import Link from "next/link";
import type { Ref } from "react";
import { useMediaQuery } from "@/lib/prefs";
import { projectByVerb } from "@/lib/projects";
import { MediaSlot } from "../MediaSlot";
import { useAbility } from "../verbs/ability";

/**
 * Where a project's preview floats in when its path is highlighted: its screenshot (or demo
 * video), one line, and a badge. Clicking it opens the case study, and the picture morphs into
 * the case study's own (a shared-element transition).
 *
 * There are two slots in the page, beside the figure on wide screens and under it on narrower
 * ones; only the one on screen takes part in the morph, so the transition always has a single
 * source. The card repeats what the path's own link says, so it stays out of the tab order:
 * keyboard users open the project from the path itself.
 */
export function PreviewSlot({ slotRef }: { slotRef?: Ref<HTMLDivElement> }) {
  const { active, setActive, release } = useAbility();
  const wide = useMediaQuery("(min-width: 1024px)");
  const onScreen = slotRef ? wide : !wide;
  const p = active ? projectByVerb(active) : null;

  return (
    <div ref={slotRef} className="preview-slot">
      {p ? (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          data-cursor="View"
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
      ) : (
        <p className="annot preview-hint">
          <span className="hint-pointer">Point at</span>
          <span className="hint-touch">Tap</span> a path to preview its project
        </p>
      )}
    </div>
  );
}
