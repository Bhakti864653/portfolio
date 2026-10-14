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
    system: ["Flask app", "SQLite / Turso", "pytest"],
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
    introduced: ["An AI agent pipeline", "Seven languages", "A real place"],
    system: [
      "Next.js",
      "Zod schemas",
      "Agent pipeline",
      "Daily cron",
      "7 languages",
    ],
    lesson:
      "A person makes the final call: agents propose, and a moderator approves every step.",
  },
];

/**
 * Lessons that show up across the projects. Each project listed is one where the DEVLOG or
 * README shows the idea actually applied.
 */
/** `plain`: one sentence anyone can follow; `note`: how the projects actually do it. */
export type Thread = {
  title: string;
  plain: string;
  note: string;
  stages: Stage["id"][];
};

export const THREADS: Thread[] = [
  {
    title: "Keep each person's data theirs",
    plain:
      "The apps are designed so nobody can see someone else's private information.",
    note: "Every query scoped to its owner, security policies in the database, and private fields that can't reach a public page.",
    stages: ["portico", "synaptiq", "concord", "commonground"],
  },
  {
    title: "Check on the server, not the browser",
    plain:
      "The apps never take a web page's word for it; they double-check everything themselves.",
    note: "The server re-checks every file type, date, and upload, whatever the browser says.",
    stages: ["portico", "synaptiq", "commonground"],
  },
  {
    title: "Limit what one visitor can do",
    plain:
      "No single person can overload an app or use up what everyone shares.",
    note: "Rate limits on logins, demos, and API endpoints, so nobody can drain shared resources; CommonGround's public Guide doesn't have one yet, and that's its next step.",
    stages: ["portico", "synaptiq", "concord"],
  },
  {
    title: "Explainable before clever",
    plain: "When an app makes a decision, a person can read why.",
    note: "Rules, readable scores, and reasoning traces before any black box.",
    stages: ["portico", "concord", "commonground"],
  },
  {
    title: "A person makes the final call",
    plain: "The AI can suggest, but a human always decides.",
    note: "The AI tutors and drafts; it never decides or submits without a person.",
    stages: ["synaptiq", "commonground"],
  },
];
