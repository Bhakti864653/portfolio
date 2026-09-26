import type { Project } from "./projects";

/** Stages in the order they began (by each repo's first commit). */
export type Stage = {
  id: "start" | Project["slug"];
  label: string;
  /** What was new at this stage. */
  firsts: string[];
};

export const STAGES: Stage[] = [
  {
    id: "start",
    label: "Day one",
    firsts: [
      "Installed Python, Git, and VS Code",
      "First script: variables and printing",
    ],
  },
  {
    id: "portico",
    label: "Portico",
    firsts: [
      "A web server and SQL",
      "Real accounts",
      "First production-only bug",
    ],
  },
  {
    id: "synaptiq",
    label: "Synaptiq",
    firsts: [
      "A separate frontend and API",
      "Structured AI output",
      "Row Level Security",
    ],
  },
  {
    id: "concord",
    label: "Concord",
    firsts: ["A formal algorithm", "Realtime chat", "Database triggers"],
  },
  {
    id: "commonground",
    label: "CommonGround",
    firsts: ["Multi-agent AI", "Seven languages", "A real place"],
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
