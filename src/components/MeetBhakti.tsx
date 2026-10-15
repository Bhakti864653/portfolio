import { introVideo } from "@/lib/videos";
import { VideoPlayer } from "./VideoPlayer";

/**
 * My short introduction video (lib/videos.ts `intro`): under the hero on the home page, and at
 * the top of About. Until there is a video, nothing renders at all.
 */
export function MeetBhakti({ variant = "home" }: { variant?: "home" | "about" }) {
  const video = introVideo();
  if (!video) return null;

  if (variant === "about") {
    return (
      <section aria-labelledby="meet-title" className="shell pb-12 sm:pb-16">
        <h2 id="meet-title" className="annot mb-5 text-ink">
          Meet Bhakti
        </h2>
        <VideoPlayer
          video={video}
          title="Video: meet Bhakti, and the apps I’ve built"
          className="mx-auto max-w-4xl"
        />
      </section>
    );
  }

  return (
    <section
      id="meet"
      aria-labelledby="meet-title"
      className="border-b border-line py-16 sm:py-24"
    >
      <div className="shell grid-12 items-center gap-y-8">
        <div className="lg:col-span-4">
          <p className="annot text-ink">Meet Bhakti</p>
          <h2
            id="meet-title"
            className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]"
          >
            Hi, I’m Bhakti.
          </h2>
          <p className="mt-4 max-w-[22rem] text-lg leading-snug text-muted">
            A short video introducing myself and the apps I’ve built.
          </p>
        </div>
        <VideoPlayer
          video={video}
          title="Video: meet Bhakti, and the apps I’ve built"
          className="lg:col-span-8"
        />
      </div>
    </section>
  );
}
