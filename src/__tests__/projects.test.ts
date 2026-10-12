import { existsSync } from "node:fs";
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
        "learned",
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

  it("keeps the project order Portico → Synaptiq → Concord → CommonGround", () => {
    expect(PROJECTS.map((p) => p.slug)).toEqual([
      "portico",
      "synaptiq",
      "concord",
      "commonground",
    ]);
    expect(PROJECTS.map((p) => p.chapter)).toEqual(["01", "02", "03", "04"]);
    expect(STAGES.map((s) => s.id)).toEqual(PROJECTS.map((p) => p.slug));
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
      "61 tests",
      "Adaptive AI tutor",
      "Stable matching",
      "7 languages",
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

  it("points any demo video at a real file", () => {
    for (const p of PROJECTS)
      if (p.media)
        expect(
          existsSync(path.join(process.cwd(), "public", p.media.video)),
        ).toBe(true);
  });
});
