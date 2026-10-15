"use client";

import Image from "next/image";
import { useEffect, useRef, ViewTransition } from "react";
import { useMotion } from "@/lib/prefs";
import type { Project } from "@/lib/projects";
import { projectVideo } from "@/lib/videos";
import { LoomPlayer } from "./VideoPlayer";

/**
 * A project's 16:9 media slot, used on cards, previews, and case studies, filled from
 * lib/videos.ts. With a video file, it shows the screenshot first, loads the video only once it
 * scrolls near the screen, then plays it muted and looped; under reduced motion it never
 * autoplays (controls instead). With a Loom link, the case study (`player`) shows Loom's
 * player, and cards keep the screenshot with a small "Video" tag, since a player inside a
 * clickable card would take the click. Without a video it shows the screenshot.
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
  fill = false,
  player = false,
  ratio = "aspect-video",
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  morph?: boolean;
  className?: string;
  imageClassName?: string;
  /** Fill the parent's box (e.g. a grid cell) instead of keeping its own 16:9 shape. */
  fill?: boolean;
  /** The case study's own slot: a Loom link shows its player here. */
  player?: boolean;
  /** The box's shape when not filling its parent. */
  ratio?: string;
}) {
  const video = projectVideo(p.slug);
  const slot = (
    <div
      className={`relative ${fill ? "h-full w-full" : ratio} overflow-hidden bg-soft ${className}`}
    >
      {video?.kind === "file" ? (
        <DemoVideo project={p} src={video.src} />
      ) : video?.kind === "loom" && player ? (
        <LoomPlayer embed={video.embed} title={`${p.name} demo video`} />
      ) : (
        <>
          <Image
            src={p.screenshot.src}
            alt={p.screenshot.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover object-left-top ${imageClassName}`}
          />
          {video?.kind === "loom" && (
            <span className="video-tag annot absolute bottom-2 left-2">▶ Video</span>
          )}
        </>
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

function DemoVideo({ project: p, src }: { project: Project; src: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const motion = useMotion();
  const poster = p.screenshot.src;

  useEffect(() => {
    const el = video.current;
    if (!el || motion !== "full") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.getAttribute("src")) el.src = src;
          el.play().catch(() => {});
        } else el.pause();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src, motion]);

  return (
    <video
      ref={video}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      controls={motion !== "full"}
      src={motion !== "full" ? src : undefined}
      aria-label={`${p.name} demo video. ${p.screenshot.alt}`}
      className="h-full w-full object-cover object-left-top"
    />
  );
}
