import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/projects";

/**
 * A crop of a project's real screenshot: zoomed into one region and dissolved at its edges by a
 * mask, so it reads as a glimpse of the interface rather than another browser window.
 *
 * The caller positions it (relative or absolute) through `className`.
 *
 * `focus` is the point of the screenshot to center on (0–1 on each axis); `zoom` scales the
 * screenshot relative to the fragment's width.
 */
export function Fragment({
  project,
  focus = [0.5, 0.5],
  zoom = 1.6,
  mask = "fragment",
  className = "",
  imageClassName = "",
  sizes = "40vw",
  alt = "",
  priority = false,
  style,
}: {
  project: Project;
  focus?: [number, number];
  zoom?: number;
  mask?: "fragment" | "fragment-v" | "fragment-h" | "none";
  className?: string;
  imageClassName?: string;
  sizes?: string;
  alt?: string;
  priority?: boolean;
  style?: CSSProperties;
}) {
  // Position the zoomed image so `focus` lands in the middle, clamped so no empty edge shows.
  const width = zoom * 100;
  const left = Math.min(0, Math.max(100 - width, 50 - focus[0] * width));
  const top = focus[1] * 100;
  return (
    <div
      className={`overflow-hidden ${mask === "none" ? "" : mask} ${className}`}
      style={style}
    >
      <Image
        src={project.screenshot.src}
        alt={alt}
        width={1440}
        height={900}
        sizes={sizes}
        priority={priority}
        className={`absolute max-w-none ${imageClassName}`}
        style={{
          width: `${width}%`,
          left: `${left}%`,
          top: "50%",
          transform: `translateY(-${top}%)`,
        }}
      />
    </div>
  );
}
