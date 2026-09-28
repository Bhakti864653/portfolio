import type { Project } from "./projects";

/** The four projects, in the site's project order. No dates or build order: each stands alone. */
export type Stage = {
  id: Project["slug"];
  label: string;
  /** The problem that started it, in one line (from the case study's "The real problem"). */
  started: string;
  /** What the project asked me to learn. */
  introduced: string[];
  /** The pieces the system was made of, as a measure of how complexity grew. */
  system: string[];
  /** The lesson it taught me, in one line. */
  lesson: string;
};

export const STAGES: Stage[] = [
  {
    id: "portico",
    label: "Portico",
    started:
      "Every university had its own deadlines, essays, and documents, scattered across notes.",
    introduced: [
      "A web server and SQL",
      "Real accounts",
      "A production-only bug",
    ],
    system: ["Flask app", "SQLite / Turso", "Email API"],
    lesson:
      "Scope every query to its owner, so one account can never see another’s data.",
  },
  {
    id: "synaptiq",
    label: "Synaptiq",
    started:
      "Rereading notes feels like studying, but it doesn’t show what you don’t know.",
    introduced: [
      "A separate frontend and API",
      "Structured AI output",
      "Row Level Security",
    ],
    system: ["Next.js", "FastAPI", "Supabase", "Groq LLM"],
    lesson:
      "An unlimited public demo endpoint taught me to audit rate limits on every endpoint.",
  },
  {
    id: "concord",
    label: "Concord",
    started:
      "Mentorship matches made by hand, or by one similarity number, are hard to explain.",
    introduced: ["A formal algorithm", "Realtime chat", "Database triggers"],
    system: ["Next.js", "FastAPI", "Postgres + RLS", "Realtime", "Triggers"],
    lesson:
      "Explainable decisions: every match comes with a reason a person can read.",
  },
  {
    id: "commonground",
    label: "CommonGround",
    started:
      "Neighbors notice the same local problems but report them in scattered ways, if at all.",
    introduced: ["Multi-agent AI", "Seven languages", "A real place"],
    system: [
      "Next.js",
      "Zod schemas",
      "Multi-agent Guide",
      "Map tiles",
      "7 languages",
    ],
    lesson:
      "A person makes the final call: the Guide drafts, but never submits anything without a click.",
  },
];

/**
 * Lessons that show up across the projects. Each project listed is one where the DEVLOG or
 * README shows the idea actually applied.
 */
export type Thread = { title: string; note: string; stages: Stage["id"][] };

export const THREADS: Thread[] = [
  {
    title: "Keep each person's data theirs",
    note: "`WHERE user_id = ?` on every query, database-level security policies, and a type that makes private fields impossible to send.",
    stages: ["portico", "synaptiq", "concord", "commonground"],
  },
  {
    title: "Check on the server, not the browser",
    note: "Deadlines parsed before they reach a calendar file, upload types enforced by storage, photo metadata re-validated inside the server action.",
    stages: ["portico", "synaptiq", "commonground"],
  },
  {
    title: "Limit what one visitor can do",
    note: "Login rate limiting, limits on the demo so it can’t drain the AI quota, and the same limiter on every endpoint.",
    stages: ["portico", "synaptiq", "concord"],
  },
  {
    title: "Explainable before clever",
    note: "Rule-based suggestions instead of a paid model, a match score you can read, and a reasoning trace for every agent.",
    stages: ["portico", "concord", "commonground"],
  },
  {
    title: "A person makes the final call",
    note: "A tutor limited to your material, and a Guide that drafts but never submits or changes a case without a click.",
    stages: ["synaptiq", "commonground"],
  },
];
