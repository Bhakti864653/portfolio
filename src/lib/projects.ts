/**
 * Every factual claim on the site lives here, sourced from each project's README, DEVLOG, and git
 * history (checked 2026-09-26). If a line can't be traced back to one of those, it doesn't belong.
 */

export type Verb = "decide" | "connect" | "learn" | "act";

export type Section = { heading: string; body: string[] };

/** A real screenshot of the live app. */
export type Shot = { src: string; alt: string; width: number; height: number };

/**
 * A demo video for a project's 16:9 media slot. Drop the file in `public/media/` and add one
 * line to the project, e.g. `media: { video: "/media/portico.mp4" },`. It plays muted and
 * looped once scrolled into view; until then (and under reduced motion) the poster shows,
 * which defaults to the project's screenshot.
 */
export type Media = { video: string; poster?: string };

export type Project = {
  slug: "portico" | "concord" | "synaptiq" | "commonground";
  verb: Verb;
  name: string;
  chapter: string;
  tagline: string;
  /** One line for cards and previews. */
  oneLine: string;
  /** A short, checkable highlight shown as a badge. */
  badge: string;
  /** Two or three headline technologies for cards. */
  tags: string[];
  media?: Media;
  /** More real screenshots for the case study gallery (the main screenshot comes first). */
  gallery: Shot[];
  /** The five short case-study sections; the full detail lives in caseStudy. */
  short: {
    problem: string;
    does: string[];
    hard: string;
    learned: string[];
  };
  /** The human question the project answers: where someone was stuck. */
  question: string;
  /** One sentence for the homepage; the case study holds the detail. */
  summary: string;
  intro: string;
  hardestProblem: string;
  repo: string;
  live: string;
  liveNote: string;
  screenshot: { src: string; alt: string };
  stack: string[];
  caseStudy: {
    problem: string[];
    why: string[];
    users: string[];
    features: string[];
    system: Section;
    design: string[];
    safety: string[];
    challenge: Section;
    changes: string[];
    limitations: string[];
    learned: string[];
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "portico",
    verb: "decide",
    name: "Portico",
    chapter: "01",
    question: "How can an overwhelming decision become clearer?",
    tagline: "A command center for college applications.",
    summary:
      "Tracks every deadline, essay, recommendation, and document, and suggests what to work on next.",
    intro:
      "Portico tracks every deadline, essay, recommendation letter, and document, gives each school a readiness score, and suggests what to work on next.",
    hardestProblem:
      "The free host erased its disk on every restart, so saved applications kept disappearing. I moved the production database to hosted SQLite (Turso) and kept a plain local file for development.",
    repo: "https://github.com/Bhakti864653/uni-app-tracker",
    live: "https://uni-app-tracker-b70h.onrender.com/",
    liveNote:
      "Free hosting: the first visit can take about 30 seconds to wake up. “Try the demo” needs no account.",
    screenshot: {
      src: "/work/portico.png",
      alt: "Portico demo dashboard: a route illustration toward decision day, university cards with completion rings and deadline countdowns, and a suggested next move",
    },
    oneLine:
      "A command center for college applications: every deadline, essay, and what to do next.",
    badge: "61 tests",
    tags: ["Python", "Flask", "SQLite"],
    gallery: [
      {
        src: "/work/gallery/portico-1.webp",
        alt: "Portico overview in the demo sandbox: “Your route to decision day”, a countdown to the next deadline, and university cards with completion rings",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/gallery/portico-2.webp",
        alt: "Portico applications board: universities in Researching, Building, Ready, and Submitted columns, each with its readiness percentage",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/gallery/portico-3.webp",
        alt: "Portico readiness page: an overall 57% score, a bar per university, and a tuition, aid, and net-cost comparison table",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/gallery/portico-4.webp",
        alt: "Portico calendar: October deadlines on a month grid and a queue of upcoming deadlines",
        width: 1440,
        height: 900,
      },
    ],
    short: {
      problem:
        "Every university has its own deadlines, essays, recommenders, and documents. Spread across notes, it’s hard to see what’s ready and what to do first.",
      does: [
        "Tracks deadlines, essays, recommendations, and documents for each school",
        "Gives each school a 0–100% readiness score and a ranked “what to do next” list",
        "Counts down to every deadline and exports them to your calendar",
        "Lets anyone try a private demo, no account needed",
      ],
      hard: "The live app crashed with “Resource deadlock avoided” while everything worked on my laptop. The database library started threads before the server split into worker processes. Waiting for the first real request fixed it.",
      learned: [
        "“It works when I test it” isn’t the same as “it survives a deploy.”",
        "Spotting that several features share one shape turned about four times the work into about 1.3 times.",
        "Scope every query to its owner, so one account can never see another’s data.",
      ],
    },
    stack: [
      "Python",
      "Flask",
      "SQLite / Turso",
      "Jinja",
      "Chart.js",
      "GitHub Actions",
      "pytest (61 tests)",
    ],
    caseStudy: {
      problem: [
        "Applying to university means keeping track of many schools at once, and each has its own deadline, essays, recommenders, and documents. When all of that lives in scattered notes, it is hard to see what is ready and what needs attention first.",
      ],
      why: [
        "I'm in my last year of school, so university applications were right in front of me. Every school had its own deadlines, essays, recommenders, and documents, and I wanted one place that showed what was done and what to do next.",
        "It was also a problem I understood from the inside: simple enough to begin as a checklist, with room to grow into a full system for planning, reminders, and next steps.",
      ],
      users: [
        "Students applying to several universities who want one place to see what's done, what's due, and what to do next.",
      ],
      features: [
        "University profiles with portal link, tuition, and financial-aid estimate, with automatic net-cost calculation",
        "Checklist, essay, recommendation, and document tracking, each with its own status flow",
        "A 0–100% Readiness Score per school, blending all four kinds of task",
        "Smart Suggestions: a rule-based “what to work on next” list ranked by urgency",
        "Deadline countdowns (“5 days left”, “3 days overdue”) on every school",
        "Pipeline view, analytics charts, a cost comparison table, and a deadline timeline",
        "Soft delete with Undo, duplicate an application, and export to CSV or a calendar (.ics) file",
        "Real accounts, plus a private demo sandbox for every visitor",
      ],
      system: {
        heading: "One task model instead of four",
        body: [
          "Checklist items, essays, recommendation letters, and documents look like four features, but they have the same shape: a task that belongs to a school and has a status. So they share one `tasks` table with a `task_type` column and a few type-specific fields.",
          "One set of routes and ownership checks covers all four. Every query is scoped to the logged-in user (`WHERE user_id = ?`), and a dedicated test proves one account can never see another's data.",
        ],
      },
      design: [
        "Rule-based suggestions instead of an AI call. The useful part, “tell me what to work on,” is a sort by urgency. Adding a paid model would have added cost and new ways to fail, without giving much more.",
        "Real undo instead of a second confirmation dialog. People click through confirm dialogs out of habit, so a deleted school can be restored with one click for 30 days.",
        "Each demo visitor gets their own seeded sandbox, deleted after 24 hours, so one stranger's edits never break the demo for the next.",
      ],
      safety: [
        "Passwords are hashed, every form has a CSRF token, and logins are rate-limited.",
        "The exports were a real attack surface. A school name starting with “=” would run as a formula in Excel (CSV injection), and a name containing line breaks could inject fake events into the calendar file. Both are neutralized now, and both have regression tests.",
      ],
      challenge: {
        heading: "A deadlock that only happened in production",
        body: [
          "After deploying, the live app returned errors and its worker processes were being killed with “Resource deadlock avoided.” Locally, everything worked.",
          "The database library starts background threads. My setup code ran before the production server split into worker processes, and each worker inherited a half-started runtime it could never finish. Running `python app.py` locally never splits into processes, so I couldn't reproduce it there.",
          "The fix was to wait until the first real request, which always runs inside a worker, before touching the database.",
        ],
      },
      changes: [
        "It started with one shared password. It now has real accounts with fully separated data.",
        "The first version kept its database as a file next to the code. The free host wipes that file on every deploy, so production moved to Turso.",
        "Reminders moved from Gmail SMTP to an HTTPS email API after the host's network-level block on email ports.",
        "Reminder emails were rebuilt so each student gets only their own deadlines, at their own address. A fact-check found they had only ever reached the site owner.",
        "It was renamed from “uni-app-tracker” to Portico.",
      ],
      limitations: [
        "It runs on a free tier, so the first request after a quiet period is slow.",
        "Deadline reminder emails are built but switched off: sending to students needs a verified email domain the project doesn't have yet.",
        "Suggestions are rules, not advice. They rank tasks by deadline and don't judge essay quality or which schools to choose.",
      ],
      learned: [
        "“It works when I test it” isn't the same as “it survives a deploy.”",
        "A clean timeout with no detail is usually an infrastructure block, not a bug in my code.",
        "Spotting that several features share one shape turned about four times the work into about 1.3 times the work.",
      ],
    },
  },
  {
    slug: "synaptiq",
    verb: "learn",
    name: "Synaptiq",
    chapter: "02",
    question: "How can a student understand what they actually know?",
    tagline: "A study partner built from your own notes.",
    summary:
      "Finds the concepts you’re weakest on, then builds practice, a guided study plan, and a tutor grounded in your own notes.",
    intro:
      "Upload your notes and take a diagnostic quiz. Synaptiq finds the concepts you're weakest on, then builds practice, a step-by-step study guide, a tutor that answers only from your material, and spaced-repetition flashcards.",
    hardestProblem:
      "If the AI returned even one malformed question, the app could crash after it had already deleted the student's old quiz. Now every generated item is checked before anything is saved, so a bad response can never destroy real work.",
    repo: "https://github.com/Bhakti864653/synaptiq",
    live: "https://synaptiq-eta.vercel.app/",
    liveNote:
      "The API sleeps on a free tier and can take about 30 seconds to wake. “Try the demo” works without an account.",
    screenshot: {
      src: "/work/synaptiq.png",
      alt: "Synaptiq landing page: the headline “Know what you actually know”, with sign-up, log-in, and try-the-demo buttons beside the Synaptiq mascot",
    },
    oneLine:
      "Turns your own notes into a quiz, then practice aimed at what you don’t know yet.",
    badge: "Adaptive AI tutor",
    tags: ["Next.js", "FastAPI", "Supabase"],
    gallery: [
      {
        src: "/work/gallery/synaptiq-dashboard.png",
        alt: "Synaptiq dashboard: your study materials and overall mastery at a glance",
        width: 676,
        height: 529,
      },
      {
        src: "/work/gallery/synaptiq-study-guide.png",
        alt: "Synaptiq study guide for “How Neural Networks Learn”: an exam-date planner and the first topic at 80%",
        width: 676,
        height: 529,
      },
      {
        src: "/work/gallery/synaptiq-tutor.png",
        alt: "Synaptiq tutor answering “How does gradient descent work?” from the student’s own uploaded notes",
        width: 676,
        height: 529,
      },
      {
        src: "/work/gallery/synaptiq-flashcards.png",
        alt: "Synaptiq flashcards, scheduled with SM-2 spaced repetition",
        width: 676,
        height: 529,
      },
    ],
    short: {
      problem:
        "Rereading notes feels like studying but doesn’t show what you don’t know. A generic AI chat isn’t tied to your material and happily uses facts your course never taught.",
      does: [
        "Builds a diagnostic quiz from your PDFs, slides, or documents",
        "Scores mastery per concept and aims new practice at your weakest ones",
        "Answers questions with a tutor limited to your own material",
        "Schedules flashcards with SM-2, the algorithm behind Anki",
      ],
      hard: "Regenerating a quiz deleted the old one before saving the new one, so a single malformed AI response could leave a student with nothing. Now every item is checked first, and a bad response changes nothing.",
      learned: [
        "How to ask an LLM for structured JSON, and how to handle every way that fails.",
        "Verify security claims against the real system, not a dashboard’s picture of it.",
        "A file input’s `accept` attribute is a convenience, not a control.",
      ],
    },
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "FastAPI",
      "Supabase",
      "Groq (LLM + Whisper)",
      "SM-2",
      "pytest",
      "Vitest",
    ],
    caseStudy: {
      problem: [
        "Rereading notes feels like studying but doesn't show what you don't know. Generic AI chat can answer questions, but it isn't tied to your material, and it happily uses facts your course never taught.",
      ],
      why: [
        "It's easy to reread your notes, feel ready, and still not know what you actually understand. I wanted a tool that finds those gaps and helps you close them.",
        "I also wanted to learn how to use AI responsibly: working only from your own material, honest when it doesn't know, and helping you think instead of thinking for you.",
      ],
      users: [
        "Students preparing for an exam from their own notes, slides, or readings.",
      ],
      features: [
        "Upload PDF, PPTX, DOCX, or TXT files. The text is extracted and split into chunks on the server",
        "A diagnostic quiz that identifies 3–6 concepts and scores mastery for each",
        "Adaptive practice aimed at your current weakest concepts",
        "A tutor told to answer only from your material, and to say so when it can't",
        "A Study Guide that unlocks each topic after you score 80% on it",
        "SM-2 spaced-repetition flashcards, the same scheduling algorithm Anki uses",
        "Read-aloud narration, and spoken answers transcribed with Whisper",
        "A private demo account for every visitor, deleted after 24 hours",
      ],
      system: {
        heading: "Mastery from the whole answer history",
        body: [
          "The schema separates documents, chunks, concepts, questions, responses, and mastery. Mastery is recalculated from a student's full answer history on every submission, not updated incrementally, so it can never drift from what actually happened.",
          "Mastery scoring and SM-2 scheduling are pure functions pulled out of the request handlers, so they have their own unit tests.",
        ],
      },
      design: [
        "No vector search. Study documents are short enough to fit whole in the model's context, so retrieval was dropped as complexity this project didn't need. That's a documented decision and the clear place to extend it.",
        "Every AI-dependent action has a friendly error with a retry button instead of raw exception text.",
        "Demo accounts are real users with a flag, not a fake code path that could drift out of sync.",
      ],
      safety: [
        "Row Level Security on every table and on the storage bucket, checked directly in the `pg_policies` database catalog after the dashboard showed a misleading preview.",
        "Uploads are limited to 20 MB and the four file types the parser handles, enforced by the storage provider, not just the file picker.",
        "The public demo endpoint is rate-limited, so nobody can drain the shared AI quota, and the cleanup secret is compared in constant time.",
      ],
      challenge: {
        heading: "A bad AI response could delete real work",
        body: [
          "Regenerating a quiz deleted the old questions first, then saved the new ones. If the model returned even one malformed item, saving failed halfway, and the student was left with no quiz at all.",
          "Now every generated item is validated before anything is written or deleted. A bad response is rejected as a whole, and the existing quiz stays untouched.",
        ],
      },
      changes: [
        "The original model was removed by the provider, which silently broke every AI feature. It was replaced after checking the provider's own model list.",
        "pgvector retrieval was planned and then dropped (see design decisions).",
        "Day-by-day Study Guide scheduling and read-aloud narration were added after the core loop worked.",
        "CI failed on every push because the runner used an older Node version than my machine. The workflow now matches.",
      ],
      limitations: [
        "A document too large to fit in the model's context would need real retrieval.",
        "Some endpoints still return raw error text to the signed-in user who caused it.",
        "Uploaded documents are parsed without a sandbox, which a larger production system would need.",
      ],
      learned: [
        "How to ask an LLM for structured JSON, and how to handle every way that fails.",
        "Verify security claims against the real system of record, not a dashboard's rendering of it.",
        "A file input's `accept` attribute is a convenience, not a control.",
      ],
    },
  },
  {
    slug: "concord",
    verb: "connect",
    name: "Concord",
    chapter: "03",
    question: "How can the right people find each other fairly?",
    tagline: "Mentorship matching that is fair by construction.",
    summary:
      "Mentees and mentors rank each other, and the Gale-Shapley algorithm pairs them so no two people would both rather be together.",
    intro:
      "Mentees and mentors rank each other, and Concord pairs them with the Gale-Shapley stable matching algorithm, so no two people would both rather be with each other than with their match.",
    hardestProblem:
      "Mentors can take more than one mentee, which the textbook algorithm doesn't handle. I used the variant built for that case and ran it in rounds that only match people still waiting, never reshuffling existing pairs.",
    repo: "https://github.com/Bhakti864653/concord",
    live: "https://concord-liard.vercel.app/",
    liveNote:
      "The API sleeps on a free tier and can take about 30 seconds to wake. “Try the demo” opens a ready-made match.",
    screenshot: {
      src: "/work/concord.png",
      alt: "Concord landing page: the headline “Find the mentor who already walked your path”, a sample match between a mentee and a mentor with the reason they were paired, and the five steps of how it works",
    },
    oneLine:
      "Mentorship matching where no mentee and mentor would both rather be with each other.",
    badge: "Stable matching",
    tags: ["Next.js", "FastAPI", "Postgres"],
    gallery: [
      {
        src: "/work/gallery/concord-1.webp",
        alt: "Concord “How matching actually works”: four steps of the Gale-Shapley algorithm and a sandbox to try it yourself",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/gallery/concord-2.webp",
        alt: "Concord demo dashboard: the mentee’s matched mentor, the next session, milestones, and their journey so far",
        width: 1440,
        height: 900,
      },
    ],
    short: {
      problem:
        "Mentorship programs often match people by hand or by one similarity score. Both are hard to explain, and both can leave two people who would each rather be with someone else.",
      does: [
        "Mentees and mentors build profiles and rank each other",
        "Every suggestion explains its score in shared words and tags",
        "Gale-Shapley pairs people in rounds, so every match is stable",
        "Matched pairs get live chat, shared goals, and a session log",
      ],
      hard: "Mentors can take several mentees, and each round only matches people still waiting. That created a mentor with no spots left, which crashed the algorithm until it learned to reject those proposals outright.",
      learned: [
        "Implement an algorithm from its formal description, and test the property that defines it.",
        "A successful build log doesn’t mean a working deployment. Check the real setting.",
        "Going from “recompute everything” to incremental rounds creates brand-new states.",
      ],
    },
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "FastAPI",
      "Supabase Postgres",
      "Row Level Security",
      "Realtime",
      "pytest",
    ],
    caseStudy: {
      problem: [
        "Mentorship programs often match people by hand or by one similarity number. Both are hard to explain, and a match that looks fine to the organizer can leave two people who would each rather be with someone else.",
      ],
      why: [
        "Good guidance often depends on who you already know. I wanted to build something that connects people with mentors more fairly, especially people who don't have those connections yet.",
        "I also wanted a project built on a real algorithm, one where I could prove the matches are stable instead of trusting a score.",
      ],
      users: [
        "Mentees looking for guidance on a career, field, or path, and mentors who have already walked it. There is also one operator who runs the matching rounds.",
      ],
      features: [
        "Separate profile shapes for mentees and mentors, with optional shared-experience tags (first-generation, career switcher, immigrant background, under-resourced school)",
        "Explainable suggestions: a score from word overlap (70%) and tag overlap (30%), broken down into the actual shared words and tags",
        "Rank your own list, lock it, and get matched by Gale-Shapley in admin-run rounds",
        "A “How it works” page with an interactive sandbox that steps through the algorithm",
        "Live chat, shared goals, a session log, private check-ins, and private notes once matched",
        "Notifications created by database triggers",
        "Consent-based mentor invitations by private link, and mentors who opt in before they can be matched",
        "Rematch requests, blocking, reporting, and community guidelines",
      ],
      system: {
        heading: "Gale-Shapley with capacity, run in rounds",
        body: [
          "The matcher is a pure function with no database or network access. It takes ranked ID lists and each mentor's capacity, and runs mentee-proposing deferred acceptance, the “hospitals and residents” version that lets one mentor accept several mentees.",
          "Around it is a round state machine: preferences open → locked → matching → results → a new round. Each run only considers people who are still unmatched, and reduces each mentor's capacity by their current matches, so existing pairs are never touched.",
        ],
      },
      design: [
        "The score is a simple formula, not an AI or embedding call, so every suggestion can be explained in plain words: “you both mentioned X, and you share tag Y.”",
        "Two database clients with different powers. Chat, notes, goals, and browsing go straight from the browser under Row Level Security. Only writes that must cross users, like matching and reports, go through the backend's service-role key.",
        "The irreversible round buttons explain exactly what they will do, after an unlabeled button once locked a real round by accident.",
      ],
      safety: [
        "Row Level Security is on every table. Chat, notes, availability, and goals are readable only by the two people in the match. Rankings, reports, and check-ins are private to their owner.",
        "When importing the monorepo into Vercel, the platform suggested adding the backend's service-role key (which bypasses every security policy) to the frontend project. I caught it and removed it before it was ever set.",
        "A security pass found that none of the authenticated endpoints were rate-limited, so I added per-user limits.",
      ],
      challenge: {
        heading: "When capacity can reach zero",
        body: [
          "Moving from “wipe and recompute everyone” to incremental rounds created a state the original code had never seen: a mentor whose remaining capacity is already zero.",
          "When a proposal arrived for such a mentor, the algorithm tried to bump a tentative match to make room, found none, and crashed on an empty `max()`. The fix rejects the proposal outright in that case. It has a dedicated test, and the same fix went into the browser sandbox on the “How it works” page.",
        ],
      },
      changes: [
        "It was scaffolded under the name “Wayfind” and renamed Concord.",
        "The single wipe-and-recompute matching run became an incremental round state machine.",
        "An AI-written match explanation was built and then removed completely. The key on the host was wrong, and then the account had no credits. The deterministic explanation became the permanent one.",
        "Leftover demo accounts are cleaned up by a scheduled job every 6 hours.",
        "Mentors now join matching only after onboarding, agreeing to be shown, and opting into a round.",
      ],
      limitations: [
        "Suggestions score every profile on the other side one by one, with no pagination. That's fine at this scale, but it wouldn't be for many users.",
        "The rate limiter lives in memory, so it resets when the free-tier server restarts.",
        "Rounds are advanced manually by one admin account.",
      ],
      learned: [
        "Implementing an algorithm from its formal description, and testing the property that defines it (stability), not just its output.",
        "A successful build log doesn't mean a working deployment. When signals disagree, check the real setting.",
        "Changing a design from “recompute everything” to incremental introduces new states, even when the core algorithm doesn't change.",
      ],
    },
  },
  {
    slug: "commonground",
    verb: "act",
    name: "CommonGround",
    chapter: "04",
    question: "How can local knowledge become collective action?",
    tagline:
      "Turning scattered local problems into trackable collective action.",
    summary:
      "Residents report local problems anonymously, every case gets a public number and history, and the AI Guide never acts without confirmation.",
    intro:
      "An independent student demo of a civic platform for Santiago de Veraguas, Panama. Residents report problems or propose fixes anonymously, and every case gets a public number and status history. The AI Guide helps, but never acts without a person's confirmation.",
    hardestProblem:
      "Private moderator notes were being sent to every visitor's browser inside the page data, even though they never appeared on screen. A public data type now makes passing a private field to a public page a compile error.",
    repo: "https://github.com/Bhakti864653/commonground",
    live: "https://commonground-psi.vercel.app/",
    liveNote:
      "No account needed. It starts in your browser's language if supported (seven languages), otherwise Spanish.",
    screenshot: {
      src: "/work/commonground.png",
      alt: "CommonGround community page for Santiago de Veraguas in Spanish: a map of five approximate areas holding numbered case markers, and an introduction to the Guide",
    },
    oneLine:
      "A student demo where neighbors report local problems anonymously, in seven languages.",
    badge: "7 languages",
    tags: ["Next.js", "TypeScript", "Groq agents"],
    gallery: [
      {
        src: "/work/gallery/commonground-1.webp",
        alt: "CommonGround home for Santiago de Veraguas: a street map with numbered cases inside approximate area zones, under the student-demo banner",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/gallery/commonground-2.webp",
        alt: "A CommonGround example case: flooding in the northern area, labeled “Example – not a real report”, with its public timeline",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/gallery/commonground-3.webp",
        alt: "CommonGround AI agent page: what the AI reviewed, with referrals to any office paused in the demo",
        width: 1440,
        height: 900,
      },
      {
        src: "/work/gallery/commonground-4.webp",
        alt: "CommonGround report form, step 2 of 5: choosing a category, with no name, phone number, or exact address needed",
        width: 1440,
        height: 900,
      },
    ],
    short: {
      problem:
        "Flooding, garbage, or a broken streetlight gets noticed by many neighbors but reported in scattered ways, if at all. Nobody can see whether someone already raised it, or what happened next.",
      does: [
        "Report a problem in five steps, with no name, phone number, or exact address",
        "Every case gets a public number, a status history, and a place on a street map",
        "An AI Guide helps draft a report, and the resident always confirms it",
        "For moderators, three AI agents review each case and a fourth critiques them",
      ],
      hard: "Private moderator notes were sent to every visitor’s browser inside the page data, even though they never appeared on screen. A public data type now makes passing a private field to a public page a compile error.",
      learned: [
        "If a field is private, strip it at the data layer and make it impossible to name.",
        "Before calling a model’s reasoning wrong, check what was actually in its context.",
        "The AI suggests and a person decides, in every part of the app.",
      ],
    },
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "Zod",
      "Postgres (Neon)",
      "Groq agents",
      "MapLibre + OpenStreetMap",
      "Vitest",
    ],
    caseStudy: {
      problem: [
        "Problems like flooding, uncollected garbage, or a broken streetlight get noticed by many neighbors but reported in scattered ways, if at all. Nobody can see whether someone else already raised it or what happened next.",
      ],
      why: [
        "I live in Panama, and I wanted to build something for a real place here, in Spanish first. Problems in a neighborhood are often noticed by everyone but reported by no one, and nobody can see what happens next.",
        "I wanted to see whether technology could help a community act together, while people, not the AI, stay in charge of every decision.",
      ],
      users: [
        "Residents of the pilot community, Santiago de Veraguas (Spanish first). Also volunteer moderators who review, verify, and update cases.",
      ],
      features: [
        "A 5-step report or proposal flow that never asks for a name, phone number, or exact address",
        "Public case numbers (SV-2026-0001) with a real status history",
        "A street map where cases sit inside approximate area zones, never at a point on a street",
        "Explore: server-side search and filters that ignore accents",
        "Verified contacts and sources, each showing when it was last checked",
        "Moderation: status, verification, duplicates, removal with a public reason, with moderators signing in through Google",
        "Seven interface languages, with a test that fails if any string is missing",
        'Adding a place opens its community, or starts a starter community marked "not reviewed yet" until a moderator reviews it',
      ],
      system: {
        heading: "A multi-agent Guide that can only suggest",
        body: [
          "For moderators, case analysis runs three specialist agents at the same time (duplicates, status, verification). A critique agent then reviews their combined output. A reasoning trace shows what each agent did, including agents that found nothing.",
          "The Guide never changes a case itself. Approving a suggestion calls the same functions as the manual moderation buttons. A report drafted in chat only becomes real when the resident clicks confirm, which goes through the same path as the manual form.",
        ],
      },
      design: [
        "Every data shape is a Zod schema, the single source of truth, checked at runtime.",
        "Emergency lines are listed first, under a clear notice that CommonGround is not an emergency service.",
        "OpenStreetMap was chosen over Google Maps to avoid billing and tracking.",
        "A 3D “Community Pulse” view was built, then removed in a redesign because it didn't help anyone act.",
      ],
      safety: [
        "No accounts at all. Deleting your own case works through a one-time management link.",
        "Photos are validated on the server, and only their metadata is kept, never the image.",
        "The Guide's safety is tested with a live adversarial eval suite, not only unit tests.",
        "Chat history sent to the Guide is sanitized, so a user can't inject a fake “system” turn.",
      ],
      challenge: {
        heading: "“Not rendered” is not “not sent”",
        body: [
          "The case page passed the full case object to a client component. The component never displayed the moderator's private notes, but Next.js serializes every prop sent to the browser, so the notes were readable in the page's own data.",
          "I found it in a deliberate review pass against my own evaluation doc. The fix is a `PublicCase` type that structurally omits every private field, plus a function that actually strips them. Referencing a private field on a public page is now a compile error, not a silent leak.",
        ],
      },
      changes: [
        "The illustrated map was replaced by a real OpenStreetMap street map for the pilot town. Communities without map settings keep the illustration.",
        "The critique agent kept discarding a correct duplicate. The cause was that it never received the other agents' tool results, so it now gets them.",
        "A public landing page was added at `/`, and the dashboard moved to `/home`.",
      ],
      limitations: [
        "It runs as an independent student demo: it sends no reports to any authority and isn't affiliated with the Alcaldía de Santiago. AI-prepared referrals to an office are built but paused.",
        "Photos are never stored, only their file name and type, so a case can't show an image.",
        "Areas are broad zones (center, north, south, east, west), not neighborhood names.",
        "Starter communities that visitors create have no local moderator until one reviews them.",
      ],
      learned: [
        "If a field is private, strip it at the data layer and make it impossible to name, not just unlikely.",
        "Before calling a model's reasoning wrong, check what was actually in its context window.",
        "A third-party stylesheet that isn't in a CSS layer can only be overridden by CSS that isn't in a layer either.",
      ],
    },
  },
];

export const VERB_ORDER: Verb[] = ["decide", "learn", "connect", "act"];

export function projectByVerb(verb: Verb): Project {
  return PROJECTS.find((p) => p.verb === verb)!;
}

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const SITE = {
  name: "Bhakti Ahir",
  email: "ahirbhakti11@gmail.com",
  github: "https://github.com/Bhakti864653",
  linkedin: "https://www.linkedin.com/in/bhakti-ahir-756b9943a/",
  journeyRepo: "https://github.com/Bhakti864653/learning-journey",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  philosophy: "Technology should expand what people can do.",
  statement:
    "I build systems that help people decide, learn, connect, and act—while keeping human judgment at the center.",
  tagline:
    "Student developer building human-centered tools for learning, opportunity, and community.",
  identity: "12th-grade student developer at The Oxford School, Panama.",
  /** The one human line about me, used on the home page and About. */
  about:
    "Born in Panama, grew up partly in India, and I code to fix problems I see, like the potholes outside my house.",
};

/** Every technology the four projects actually use, for the home page marquee. */
export const TECH = [
  "Python",
  "Flask",
  "Next.js",
  "React",
  "TypeScript",
  "FastAPI",
  "Supabase",
  "Postgres",
  "SQLite",
  "Tailwind CSS",
  "Zod",
  "Groq",
  "MapLibre",
  "Vitest",
  "pytest",
  "GitHub Actions",
];
