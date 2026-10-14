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
  /** Optional: why I built it, in my own voice, shown as a highlighted line near the top. */
  story?: string;
  /** Optional: who has really used it, e.g. "Used by 15 classmates before their biology exam". Hidden when empty. */
  usedBy?: string;
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
        "Each application has its own pile of deadlines and documents, and scattered notes hide what to do next.",
      does: [
        "Tracks deadlines, essays, recommendations, and documents for each school",
        "Gives each school a 0–100% readiness score and a ranked “what to do next” list",
        "Counts down to every deadline and exports them to your calendar",
        "Lets anyone try a private demo, no account needed",
      ],
      hard: "The live app kept crashing while my laptop copy worked perfectly. The cause was the order in which the production server started up.",
      learned: [
        "“It works when I test it” isn’t the same as “it survives a deploy.”",
        "Spotting that several features share one shape meant I built one thing instead of four, so it took a little more work than one feature, not four times as much.",
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
        heading: "The live app crashed, but never on my laptop",
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
        "A clean timeout with no detail is usually an infrastructure block, not a bug in my code.",
      ],
    },
  },
  {
    slug: "synaptiq",
    verb: "learn",
    story:
      "I built Synaptiq because biology overwhelmed me and I never knew where to start. I used it to prepare for my own biology test: it showed me which topics I was weakest in, so I knew what to study first.",
    usedBy: "Used by me for my biology test, and tested by classmates.",
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
    tags: ["Next.js", "Groq + Whisper", "Supabase"],
    gallery: [
      {
        src: "/work/gallery/synaptiq-dashboard-v2.png",
        alt: "Synaptiq dashboard: a 3D map of the student’s concepts colored by mastery, with the selected concept and a “Study this concept” button below it",
        width: 676,
        height: 529,
      },
      {
        src: "/work/gallery/synaptiq-concept.png",
        alt: "Synaptiq study page for “New England History”: a numbered concept index, the key idea and explanation, and a 3D globe visualization beside it",
        width: 676,
        height: 529,
      },
      {
        src: "/work/gallery/synaptiq-study-guide-v2.png",
        alt: "Synaptiq Study Guide under “Practice & review”: today’s plan with read-aloud, a quote from the student’s own material, and “explain it differently” options",
        width: 676,
        height: 529,
      },
      {
        src: "/work/gallery/synaptiq-tutor-v2.png",
        alt: "Synaptiq tutor answering “Why was Boston important to New England?” using only the student’s uploaded notes",
        width: 676,
        height: 529,
      },
      {
        src: "/work/gallery/synaptiq-flashcards-v2.png",
        alt: "Synaptiq flashcard 1 of 10, generated from the student’s notes and scheduled with SM-2 spaced repetition",
        width: 676,
        height: 529,
      },
    ],
    short: {
      problem:
        "Rereading doesn’t reveal what you don’t know, and a general AI chat isn’t tied to your course.",
      does: [
        "Builds a diagnostic quiz from your PDFs, slides, or documents",
        "Scores mastery per concept and aims new practice at your weakest ones",
        "Answers questions with a tutor limited to your own material",
        "Schedules flashcards with SM-2, the classic scheduling algorithm behind Anki",
      ],
      hard: "One malformed AI response could wipe out a student’s existing quiz. Now a bad response changes nothing.",
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
        "A 3D map of every concept, colored by mastery. Choosing one shows how well you know it and opens straight to that concept",
        "Spaced-repetition flashcards scheduled by SM-2, the classic scheduling algorithm behind Anki",
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
        "On screen, every AI-dependent action shows a friendly error with a retry button instead of raw exception text.",
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
        "The signed-in pages were redesigned so the dashboard leads with your next concept and the concept map links straight to the right study page.",
        "CI failed on every push because the runner used an older Node version than my machine. The workflow now matches.",
      ],
      limitations: [
        "A document too large to fit in the model's context would need real retrieval.",
        "Behind the friendly screen, some endpoints still put raw error text in their API response, visible only to the signed-in user who caused it.",
        "Uploaded documents are parsed without a sandbox, which a larger production system would need.",
      ],
      learned: [],
    },
  },
  {
    slug: "concord",
    verb: "connect",
    name: "Concord",
    chapter: "03",
    question: "How can the right people find each other fairly?",
    tagline: "Mentorship matching that is stable by construction.",
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
      "Fair mentorship matching: nobody can find a better match who would also choose them.",
    badge: "Stable matching",
    tags: ["FastAPI", "Postgres RLS", "Realtime"],
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
        "Matches made by hand or by one score are hard to explain, and they can pair people who’d both prefer someone else.",
      does: [
        "Mentees and mentors build profiles and rank each other",
        "Every suggestion explains its score in shared words and tags",
        "A proven matching method (Gale-Shapley) pairs people in rounds, so no two people would both rather be together",
        "Matched pairs get live chat, shared goals, and a session log",
      ],
      hard: "Matching in rounds created a situation the original code never expected: a mentor with no spots left. A request for that mentor crashed the matching.",
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
        heading:
          "Fair matching in rounds, where a mentor can take several mentees",
        body: [
          "The matcher is a pure function with no database or network access. It takes ranked ID lists and each mentor's capacity, and runs the classic proposal method: mentees ask their favorite mentors first, and each mentor holds on to the best offers so far, only deciding at the end (called “deferred acceptance”). It uses the version built for matching new doctors to hospitals, where one mentor, like one hospital, can accept several people. In Gale-Shapley the side that proposes gets a slight advantage, so here the mentees do.",
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
        heading: "A mentor with no spots left crashed the matching",
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
      learned: [],
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
      "Residents report local problems anonymously; AI agents route, draft, and follow up on each case, and a moderator approves every step.",
    intro:
      "An independent student demo of a civic platform for Santiago de Veraguas, Panama. Residents report problems anonymously, and every case gets a public number and status history. A four-step pipeline of AI agents drafts, routes, prepares a referral, and follows up, but a moderator approves every step and nothing is ever sent to any authority.",
    hardestProblem:
      "Letting AI agents work on real residents’ reports without letting them do harm. Agents can only propose, through typed and validated tools; a moderator approves every change; and there is no code that can send anything outside the app.",
    repo: "https://github.com/Bhakti864653/commonground",
    live: "https://commonground-psi.vercel.app/",
    liveNote:
      "Residents need no account. It starts in your browser's language if supported (seven languages), otherwise Spanish.",
    screenshot: {
      src: "/work/gallery/commonground-1.webp",
      alt: "CommonGround home for Santiago de Veraguas: a street map with numbered cases inside approximate area zones, under the student-demo banner",
    },
    oneLine:
      "A student demo where neighbors report local problems and AI agents route and follow up, in 7 languages.",
    badge: "4-step AI pipeline",
    tags: ["Groq agents", "Postgres (Neon)", "MapLibre"],
    gallery: [
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
        "Neighbors notice the same local problems, but reports are scattered and nobody can follow what happens next.",
      does: [
        "Report a problem anonymously; phone numbers, emails, and names are removed automatically",
        "Every case gets a public number and history; residents’ cases show only status changes",
        "AI agents draft, route, prepare a referral, and follow up daily; a Critic agent checks their proposals",
        "A moderator approves every step, and the outbox never sends anything",
      ],
      hard: "Letting AI agents work on real residents’ reports without letting them do harm. Agents can only propose, through typed and validated tools; a moderator approves every change; and there is no code that can send anything outside the app.",
      learned: [
        "Let agents propose, not act: approving a suggestion should run the same code a person’s button runs.",
        "If a field is private, strip it at the data layer and make it impossible to name.",
        "Prove safety with tests: one blocks the network to show nothing is ever sent.",
        "The AI suggests and a person decides, in every part of the app.",
      ],
    },
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "Zod",
      "Postgres (Neon)",
      "Groq agents (tool calling)",
      "Vercel Cron",
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
        "Residents of the pilot community, Santiago de Veraguas (Spanish first). Also volunteer moderators who review, verify, and approve every step.",
      ],
      features: [
        "A 5-step report form, or a chat with the AI Guide, which asks short questions and drafts a report the resident confirms",
        "Phone numbers, emails, ID numbers, house numbers, and names are removed automatically before anything is saved",
        "Public case numbers (SV-2026-0001) with a status history; residents’ cases show only status changes publicly",
        "A four-step agent pipeline: drafting, routing, a referral into a dry-run outbox, and a daily follow-up",
        "A moderator dashboard: cases by stage, the outbox, suggestions waiting for approval, and overdue cases",
        "An office portal for city departments, built but switched off; a moderator-only demo shows the full loop with simulated offices",
        "A street map where cases sit inside approximate area zones, never at a point on a street",
        "Seven interface languages, with a test that fails if any string is missing",
      ],
      system: {
        heading: "A four-step agent pipeline that can only propose",
        body: [
          "Drafting: the Guide asks short questions and drafts a report the resident confirms. Routing: an agent calls lookup tools (similar cases, case details) and proposes an office, a priority, a confidence score, and possible duplicates. Referral: an agent writes a formal message in Spanish into a dry-run outbox. Follow-up: a daily scheduled job flags stalled cases and drafts reminders, public updates, and a weekly summary.",
          "A Critic agent checks every proposal for mistakes, bias, missing information, and personal data before a moderator sees it. Each agent must finish with one schema-validated tool call; invalid output is retried once, then replaced by a rule-based answer. Approving a suggestion runs the same functions as the manual moderation buttons.",
        ],
      },
      design: [
        "Every data shape is a Zod schema, the single source of truth, checked at runtime.",
        "Sending is off, and there is no delivery code at all: even with the switch on, nothing could be sent. The database only allows the outbox status “dry_run”.",
        "The offices are placeholders with addresses that can never deliver, until a real agreement exists.",
        "Emergency lines are listed first, under a clear notice that CommonGround is not an emergency service.",
        "OpenStreetMap was chosen over Google Maps to avoid billing and tracking.",
      ],
      safety: [
        "Residents don’t need an account to report (only moderators sign in, with Google). Deleting your own case works through a one-time management link.",
        "Residents’ text reaches the agents only as marked, untrusted data. Prompt-injection tests show an agent can’t route a case to an office that doesn’t exist or send anything.",
        "An emergency phrase shows the verified emergency number (911) at once, before any AI runs.",
        "Every agent step and moderator decision is written to a private audit log.",
        "Photos are checked on the server and never stored. Only the file name, type, and size are kept.",
      ],
      challenge: {
        heading: "Private notes, hidden on screen, still reached the browser",
        body: [
          "The case page passed the full case object to a client component. The component never displayed the moderator's private notes, but Next.js serializes every prop sent to the browser, so the notes were readable in the page's own data.",
          "I found it in a deliberate review pass against my own evaluation doc. The fix is a `PublicCase` type that structurally omits every private field, plus a function that actually strips them. Referencing a private field on a public page is now a compile error, not a silent leak.",
          "The same lesson came back with the pipeline: office names were reaching real residents’ case pages inside the hidden page data. They are no longer sent at all.",
        ],
      },
      changes: [
        "A single referral step became a four-step agent pipeline, with a dry-run outbox, a daily follow-up, and an audit log of every step.",
        "After I handed out flyers in my neighborhood, the first real residents’ reports came in. Their public pages show only status changes.",
        "The illustrated map was replaced by a real OpenStreetMap street map for the pilot town.",
        "The critique agent kept discarding a correct duplicate. The cause was that it never received the other agents' tool results, so it now gets them.",
      ],
      limitations: [
        "It runs as an independent student demo and isn’t affiliated with the Alcaldía de Santiago. Approved referrals only go to a dry-run outbox: sending is paused, and there is no delivery channel.",
        "The office portal is switched off until the mayor’s office agrees, and the offices are placeholders.",
        "The privacy filter uses rules, so it can miss an unusual name or address. Moderators read every case.",
        "Photos are never stored (only the file name, type, and size are kept), so a case can't show an image.",
        "Areas are broad zones (center, north, south, east, west), not neighborhood names.",
      ],
      learned: [
        "Before calling a model's reasoning wrong, check what was actually in its context window.",
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
