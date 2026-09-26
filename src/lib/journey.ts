import type { Project } from "./projects";

/** The four projects in the order they began (by each repo's first commit). */
export type Stage = {
  id: Project["slug"];
  label: string;
  /** What was new at this stage. */
  introduced: string[];
  /** The pieces the system was made of, as a measure of how complexity grew. */
  system: string[];
  /** The lesson this stage handed to the next one. */
  carried: string;
};

export const STAGES: Stage[] = [
  {
    id: "portico",
    label: "Portico",
    introduced: [
      "A web server and SQL",
      "Real accounts",
      "A production-only bug",
    ],
    system: ["Flask app", "SQLite / Turso", "Email API"],
    carried:
      "Every query scoped to its owner, so one account can never see another’s data.",
  },
  {
    id: "synaptiq",
    label: "Synaptiq",
    introduced: [
      "A separate frontend and API",
      "Structured AI output",
      "Row Level Security",
    ],
    system: ["Next.js", "FastAPI", "Supabase", "Groq LLM"],
    carried:
      "An unlimited public demo endpoint taught me to audit rate limits on every endpoint.",
  },
  {
    id: "concord",
    label: "Concord",
    introduced: ["A formal algorithm", "Realtime chat", "Database triggers"],
    system: ["Next.js", "FastAPI", "Postgres + RLS", "Realtime", "Triggers"],
    carried:
      "Explainable decisions: a score you can read became a reasoning trace for every AI agent.",
  },
  {
    id: "commonground",
    label: "CommonGround",
    introduced: ["Multi-agent AI", "Seven languages", "A real place"],
    system: [
      "Next.js",
      "Zod schemas",
      "Multi-agent Guide",
      "Map tiles",
      "7 languages",
    ],
    carried: "Next: a real database, documented as the next step.",
  },
];

/**
 * Lessons that carried from one project into the next. Each stage listed is one where the
 * DEVLOG or README shows the idea actually applied.
 */
export type Thread = { title: string; note: string; stages: Stage["id"][] };

export const THREADS: Thread[] = [
  {
    title: "Keep each person's data theirs",
    note: "From `WHERE user_id = ?` on every query, to database-level security policies, to a type that makes private fields impossible to send.",
    stages: ["portico", "synaptiq", "concord", "commonground"],
  },
  {
    title: "Check on the server, not the browser",
    note: "Deadlines parsed before they reach a calendar file, upload types enforced by storage, photo metadata re-validated inside the server action.",
    stages: ["portico", "synaptiq", "commonground"],
  },
  {
    title: "Limit what one visitor can do",
    note: "Login rate limiting, then a demo endpoint that could have drained the AI quota, then the same limiter ported to every endpoint.",
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
