/**
 * Every factual claim on the site lives here, sourced from each project's README, DEVLOG, and git
 * history (checked 2026-09-26). If a line can't be traced back to one of those, it doesn't belong.
 */

export type Verb = "decide" | "connect" | "learn" | "act";

export type Section = { heading: string; body: string[] };

export type Project = {
  slug: "portico" | "concord" | "synaptiq" | "commonground";
  verb: Verb;
  name: string;
  chapter: string;
  tagline: string;
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
    tagline: "A command center for college applications.",
    summary:
      "Tracks every deadline, essay, recommendation, and document, and suggests what to work on next.",
    intro:
      "Portico tracks every deadline, essay, recommendation letter, and document, gives each school a readiness score, and suggests what to work on next.",
    hardestProblem:
      "The free host erased its disk on every restart, so saved applications kept disappearing. I moved the database to hosted SQLite, and sent reminders through an email API because the host blocks email ports.",
    repo: "https://github.com/Bhakti864653/uni-app-tracker",
    live: "https://uni-app-tracker-b70h.onrender.com/",
    liveNote:
      "Free hosting: the first visit can take about 30 seconds to wake up. “Try the demo” needs no account.",
    screenshot: {
      src: "/work/portico.png",
      alt: "Portico demo dashboard: a route illustration toward decision day, university cards with completion rings and deadline countdowns, and a suggested next move",
    },
    stack: [
      "Python",
      "Flask",
      "SQLite / Turso",
      "Jinja",
      "Chart.js",
      "Resend",
      "GitHub Actions",
      "pytest",
    ],
    caseStudy: {
      problem: [
        "Applying to university means keeping track of many schools at once, and each has its own deadline, essays, recommenders, and documents. When all of that lives in scattered notes, it is hard to see what is ready and what needs attention first.",
      ],
      why: [
        "I'm in my last year of school, so university applications were right in front of me. Every school had its own deadlines, essays, recommenders, and documents, and I wanted one place that showed what was done and what to do next.",
        "It was also the right first project: a problem I understood well, small enough to start as a checklist, with plenty of room to grow as I learned.",
      ],
      users: [
        "Students applying to several universities who want one place to see what's done, what's due, and what to do next.",
      ],
      features: [
        "University profiles with portal link, tuition, and financial-aid estimate, with automatic net-cost calculation",
        "Checklist, essay, recommendation, and document tracking, each with its own status flow",
        "A 0–100% Readiness Score per school, blending all four kinds of task",
        "Smart Suggestions: a rule-based “what to work on next” list ranked by urgency",
        "Pipeline view, analytics charts, a cost comparison table, and a deadline timeline",
        "Soft delete with Undo, duplicate an application, and export to CSV or a calendar (.ics) file",
        "Real accounts, plus a private demo sandbox for every visitor",
        "A daily email reminder for approaching deadlines",
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
        "It was renamed from “uni-app-tracker” to Portico.",
      ],
      limitations: [
        "It runs on a free tier, so the first request after a quiet period is slow.",
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
    tagline:
      "Turning scattered local problems into trackable collective action.",
    summary:
      "Residents report local problems anonymously, every case gets a public number and history, and the AI Guide never acts without confirmation.",
    intro:
      "A civic platform piloted for Santiago de Veraguas, Panama. Residents report problems or propose fixes anonymously, and every case gets a public number and status history. The AI Guide helps, but never acts without a person's confirmation.",
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
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "Zod",
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
        "Moderation: status, verification, duplicates, removal with a public reason",
        "Seven interface languages, with a test that fails if any string is missing",
        "Visitors can save a place preference, while unsupported locations are clearly identified as not set up yet. Moderators can configure additional communities through the prototype administration flow.",
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
        "It's a prototype with no database yet. Submitted cases and new communities live in memory and disappear on a restart or redeploy.",
        "The admin area is a passphrase-gated prototype, not a real account system.",
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
    "I build systems that help people decide, learn, connect, and act—without removing the human judgment that gives those actions meaning.",
};
