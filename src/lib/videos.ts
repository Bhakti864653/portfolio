/**
 * Every video on the site, one line each. To add one, paste between the quotes either
 *   - a Loom share link, e.g. "https://www.loom.com/share/0123456789abcdef0123456789abcdef", or
 *   - a video file you put in public/media/, e.g. "/media/intro.mp4" (.mp4 or .webm).
 * Left as "", a slot stays hidden: no box, no "coming soon". (A project then just shows its
 * screenshot, as it always has.)
 */
export const VIDEOS = {
  /** "Meet Bhakti": under the hero on the home page, and at the top of About. */
  intro: "",
  /** Each project's demo: its case study, and its cards on the home and Work pages. */
  commonground: "",
  portico: "",
  synaptiq: "",
  concord: "",
};

export type Video =
  | { kind: "loom"; embed: string }
  | { kind: "file"; src: string };

const LOOM = /^https:\/\/(?:www\.)?loom\.com\/(?:share|embed)\/([0-9a-f]{16,64})(?:[/?#].*)?$/i;
const FILE = /^(?:\/|https:\/\/)\S+\.(?:mp4|webm)(?:[?#]\S*)?$/i;

/** What a pasted link is, or null for "" (and for anything unrecognised, so a typo hides the slot instead of breaking the page). */
export function parseVideo(value: string | undefined): Video | null {
  const v = value?.trim() ?? "";
  const loom = v.match(LOOM);
  if (loom) return { kind: "loom", embed: `https://www.loom.com/embed/${loom[1]}` };
  if (FILE.test(v)) return { kind: "file", src: v };
  return null;
}

export function introVideo(): Video | null {
  return parseVideo(VIDEOS.intro);
}

export function projectVideo(slug: keyof typeof VIDEOS): Video | null {
  return parseVideo(VIDEOS[slug]);
}
