"use client";

import Image from "next/image";
import { useEffect, useRef, ViewTransition } from "react";
import { useMotion } from "@/lib/prefs";
import type { Project } from "@/lib/projects";

/**
 * A project's 16:9 media slot, used on cards, previews, and case studies. With a demo video
 * (`project.media`), it shows the poster first, loads the video only once it scrolls near the
 * screen, then plays it muted and looped. Under reduced motion it never autoplays: the poster
 * stays, with controls to play it on purpose. Without a video it shows the screenshot.
 *
 * `morph` names the slot for the shared-element transition into the case study, so the same
 * picture appears to grow into the page it opens.
 */
export function MediaSlot({
  project: p,
  sizes,
  priority = false,
  morph = false,
  className = "",
  imageClassName = "",
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  morph?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const slot = (
    <div
      className={`relative aspect-video overflow-hidden bg-soft ${className}`}
    >
      {p.media ? (
        <DemoVideo project={p} />
      ) : (
        <Image
          src={p.screenshot.src}
          alt={p.screenshot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover object-left-top ${imageClassName}`}
        />
      )}
    </div>
  );
  return morph ? (
    <ViewTransition name={`media-${p.slug}`} share="morph" default="none">
      {slot}
    </ViewTransition>
  ) : (
    slot
  );
}

function DemoVideo({ project: p }: { project: Project }) {
  const video = useRef<HTMLVideoElement>(null);
  const motion = useMotion();
  const poster = p.media?.poster ?? p.screenshot.src;

  useEffect(() => {
    const el = video.current;
    if (!el || !p.media || motion !== "full") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.getAttribute("src")) el.src = p.media!.video;
          el.play().catch(() => {});
        } else el.pause();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [p.media, motion]);

  return (
    <video
      ref={video}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      controls={motion !== "full"}
      src={motion !== "full" ? p.media?.video : undefined}
      aria-label={`${p.name} demo video. ${p.screenshot.alt}`}
      className="h-full w-full object-cover object-left-top"
    />
  );
}
