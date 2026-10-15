import type { Video } from "@/lib/videos";

/** Loom's own player, loaded only when it nears the screen. Fills its (positioned) parent. */
export function LoomPlayer({ embed, title }: { embed: string; title: string }) {
  return (
    <iframe
      src={embed}
      title={title}
      loading="lazy"
      allow="fullscreen; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 h-full w-full border-0"
    />
  );
}

/** A video someone chooses to watch (with sound): Loom's player, or a file with normal controls. */
export function VideoPlayer({
  video,
  title,
  className = "",
}: {
  video: Video;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-[14px] border border-line-strong bg-ink ${className}`}
    >
      {video.kind === "loom" ? (
        <LoomPlayer embed={video.embed} title={title} />
      ) : (
        <video
          src={video.src}
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
    </div>
  );
}
