import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { STAGES, THREADS } from "@/lib/journey";
import {
  PROJECTS,
  VERB_ORDER,
  projectBySlug,
  projectByVerb,
} from "@/lib/projects";

describe("project data", () => {
  it("has one project per verb, with unique slugs", () => {
    expect(PROJECTS).toHaveLength(4);
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(4);
    expect(PROJECTS.map((p) => p.verb).sort()).toEqual([...VERB_ORDER].sort());
    for (const verb of VERB_ORDER) expect(projectByVerb(verb).verb).toBe(verb);
  });

  it("links only to Bhakti's own repositories and live https apps", () => {
    for (const p of PROJECTS) {
      expect(p.repo).toMatch(/^https:\/\/github\.com\/Bhakti864653\/[\w-]+$/);
      expect(p.live).toMatch(/^https:\/\//);
    }
  });

  it("fills every case-study section", () => {
    for (const p of PROJECTS) {
      const cs = p.caseStudy;
      for (const key of [
        "problem",
        "why",
        "users",
        "features",
        "design",
        "safety",
        "changes",
        "limitations",
      ] as const) {
        expect(cs[key].length, `${p.slug}.${key}`).toBeGreaterThan(0);
      }
      expect(cs.system.body.length).toBeGreaterThan(0);
      expect(cs.challenge.body.length).toBeGreaterThan(0);
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("points every screenshot at a real file with a description", () => {
    for (const p of PROJECTS) {
      expect(
        existsSync(path.join(process.cwd(), "public", p.screenshot.src)),
      ).toBe(true);
      expect(p.screenshot.alt.length).toBeGreaterThan(20);
    }
  });

  it("lists CommonGround first everywhere, numbered in that order", () => {
    expect(PROJECTS.map((p) => p.slug)).toEqual([
      "commonground",
      "portico",
      "synaptiq",
      "concord",
    ]);
    expect(PROJECTS.map((p) => p.chapter)).toEqual(["01", "02", "03", "04"]);
    expect(VERB_ORDER).toEqual(PROJECTS.map((p) => p.verb));
  });

  it("keeps the Journey in the order the apps were built", () => {
    expect(STAGES.map((s) => s.id)).toEqual([
      "portico",
      "synaptiq",
      "concord",
      "commonground",
    ]);
  });

  it("gives every project one short, first-person decision", () => {
    for (const p of PROJECTS) {
      expect(p.decision).toMatch(/^I /);
      expect(p.decision.split(/s+/).length).toBeLessThanOrEqual(35);
    }
  });

  it("shows Used by only where someone really used it", () => {
    expect(PROJECTS.filter((p) => p.usedBy).map((p) => p.slug)).toEqual([
      "commonground",
      "synaptiq",
    ]);
  });

  it("gives every project its human question", () => {
    for (const p of PROJECTS) expect(p.question).toMatch(/^How can .+\?$/);
  });

  it("looks projects up by slug", () => {
    expect(projectBySlug("concord")?.name).toBe("Concord");
    expect(projectBySlug("nope")).toBeUndefined();
  });

  it("journey threads only reference real stages, in one line each", () => {
    const ids = STAGES.map((s) => s.id);
    for (const t of THREADS) {
      for (const id of t.stages) expect(ids).toContain(id);
      expect(t.note.split(/(?<=[.!?])\s/).length, t.title).toBe(1);
    }
  });

  it("gives each project the requested badge, a one-liner, and 2-3 tags", () => {
    expect(PROJECTS.map((p) => p.badge)).toEqual([
      "4-step AI pipeline",
      "61 tests",
      "Adaptive AI tutor",
      "Stable matching",
    ]);
    for (const p of PROJECTS) {
      expect(p.oneLine.length, p.slug).toBeLessThan(120);
      expect(p.tags.length).toBeGreaterThanOrEqual(2);
      expect(p.tags.length).toBeLessThanOrEqual(3);
    }
  });

  it("has at least three real screenshots per project, each a real file with a description", () => {
    for (const p of PROJECTS) {
      const shots = [p.screenshot, ...p.gallery];
      expect(shots.length, p.slug).toBeGreaterThanOrEqual(3);
      for (const s of shots) {
        expect(
          existsSync(path.join(process.cwd(), "public", s.src)),
          s.src,
        ).toBe(true);
        expect(s.alt.length).toBeGreaterThan(20);
      }
    }
  });

  it("keeps the short case study sections short", () => {
    for (const p of PROJECTS) {
      expect(p.short.does.length).toBeGreaterThanOrEqual(3);
      expect(p.short.does.length).toBeLessThanOrEqual(4);
      expect(p.short.learned.length).toBeLessThanOrEqual(4);
      for (const text of [p.short.problem, p.short.hard])
        expect(text.split(/(?<=[.!?])\s/).length, p.slug).toBeLessThanOrEqual(
          3,
        );
    }
  });

  it("matches what the apps do today", () => {
    const portico = projectBySlug("portico")!;
    // Reminder emails exist in the code but are switched off: never offered as a feature.
    expect(portico.caseStudy.features.join(" ")).not.toMatch(/remind/i);
    expect(portico.caseStudy.limitations.join(" ")).toMatch(/switched off/);
    expect(portico.stack.join(" ")).toMatch(/61 tests/);

    const commonground = projectBySlug("commonground")!;
    expect(commonground.intro).toMatch(/student demo/);
    expect(commonground.caseStudy.limitations.join(" ")).toMatch(
      /referrals .* paused/,
    );
  });
});

describe("certifications and media", () => {
  it("formats certificate dates", async () => {
    const { formatMonth, CERTIFICATIONS } =
      await import("@/lib/certifications");
    expect(formatMonth("2026-10")).toBe("October 2026");
    for (const c of CERTIFICATIONS) {
      expect(c.url).toMatch(/^https:\/\//);
      expect(c.date).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it("points every video at a Loom link or a real file, or leaves it empty", async () => {
    const { VIDEOS, parseVideo } = await import("@/lib/videos");
    for (const value of Object.values(VIDEOS)) {
      if (!value) continue;
      const video = parseVideo(value);
      expect(video).not.toBeNull();
      if (video?.kind === "file" && video.src.startsWith("/"))
        expect(existsSync(path.join(process.cwd(), "public", video.src))).toBe(true);
    }
  });

  it("reads Loom links and video files, and ignores anything else", async () => {
    const { parseVideo } = await import("@/lib/videos");
    const id = "0123456789abcdef0123456789abcdef";
    expect(parseVideo(`https://www.loom.com/share/${id}?sid=x`)).toEqual({
      kind: "loom",
      embed: `https://www.loom.com/embed/${id}`,
    });
    expect(parseVideo(`https://loom.com/embed/${id}`)?.kind).toBe("loom");
    expect(parseVideo(" /media/intro.mp4 ")).toEqual({ kind: "file", src: "/media/intro.mp4" });
    expect(parseVideo("")).toBeNull();
    expect(parseVideo("coming soon")).toBeNull();
    expect(parseVideo("https://example.com/watch?v=1")).toBeNull();
  });
});

const words = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
/** Share of the shorter text's words that also appear in the other. */
const overlap = (a: string, b: string) => {
  const A = words(a);
  const B = words(b);
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / Math.max(1, Math.min(A.size, B.size));
};

describe("cards and case studies (2026-10 review)", () => {
  it("shows at most three tags per project, without version numbers, and no tag twice", () => {
    const seen = new Map<string, string>();
    for (const p of PROJECTS) {
      expect(p.tags.length).toBeLessThanOrEqual(3);
      for (const t of p.tags) {
        expect(t, `${p.slug}: ${t}`).not.toMatch(/\d/);
        expect(
          seen.get(t),
          `"${t}" is on ${seen.get(t)} and ${p.slug}`,
        ).toBeUndefined();
        seen.set(t, p.slug);
      }
    }
  });

  it("never repeats the hero image in the gallery", () => {
    for (const p of PROJECTS)
      expect(p.gallery.map((g) => g.src)).not.toContain(p.screenshot.src);
  });

  it("keeps the short sections as summaries, not repeats of Read more", () => {
    for (const p of PROJECTS) {
      expect(p.short.problem.length, p.slug).toBeLessThan(
        p.caseStudy.problem.join(" ").length,
      );
      expect(
        overlap(p.short.hard, p.caseStudy.challenge.body.join(" ")),
        p.slug,
      ).toBeLessThan(0.6);
      for (const extra of p.caseStudy.learned)
        for (const shown of p.short.learned)
          expect(overlap(extra, shown), `${p.slug}: ${extra}`).toBeLessThan(
            0.6,
          );
    }
  });

  it("explains the Concord algorithm's jargon in plain words", () => {
    const concord = projectBySlug("concord")!;
    const text = JSON.stringify(concord);
    expect(text).toMatch(/deferred acceptance/);
    expect(text).toMatch(/new doctors to hospitals/);
    expect(concord.oneLine).toBe(
      "Fair mentorship matching: nobody can find a better match who would also choose them.",
    );
  });

  it("gives every lesson a plain one-sentence explanation", () => {
    for (const t of THREADS) {
      expect(t.plain.length, t.title).toBeGreaterThan(10);
      // A short aside in brackets at the end doesn't count as a second sentence.
      const main = t.plain.replace(/\s*\([^)]*\)$/, "");
      expect(main.split(/(?<=[.!?])\s/).length, t.title).toBe(1);
    }
  });
});

describe("contrast", () => {
  const css = readFileSync(
    path.join(process.cwd(), "src/app/globals.css"),
    "utf8",
  );
  const lum = (hex: string) => {
    const c = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a: string, b: string) => {
    const [x, y] = [lum(a), lum(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  /** The value of a token in the light (first) or dark (second) palette. */
  const token = (name: string, which: 0 | 1) =>
    [...css.matchAll(new RegExp(`--${name}: (#[0-9a-f]{6})`, "gi"))][which][1];

  it("keeps small text and project colors at WCAG AA (4.5:1) on paper, light and dark", () => {
    for (const which of [0, 1] as const) {
      const paper = token("paper", which);
      const soft = token("soft", which);
      for (const name of [
        "muted",
        "faint",
        "portico-1",
        "synaptiq-1",
        "concord-1",
        "commonground-1",
      ]) {
        expect(
          ratio(token(name, which), paper),
          `${name} ${which ? "dark" : "light"}`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          ratio(token(name, which), soft),
          `${name} on soft`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

describe("About page margin notes", () => {
  it("quote lessons that exist", () => {
    // src/app/about/page.tsx quotes short.learned[0] of Portico and [1] of Synaptiq.
    expect(projectBySlug("portico")!.short.learned[0]).toMatch(
      /survives a deploy/,
    );
    expect(projectBySlug("synaptiq")!.short.learned[1]).toMatch(
      /security claims/,
    );
  });
});
