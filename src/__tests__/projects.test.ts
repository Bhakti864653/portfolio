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

  it("journey threads only reference real stages", () => {
    const ids = STAGES.map((s) => s.id);
    for (const t of THREADS)
      for (const id of t.stages) expect(ids).toContain(id);
  });
});
