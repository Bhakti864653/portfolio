# Bhakti Ahir — Portfolio

> Technology should expand what people can do.

My personal portfolio, built around four human abilities, each tied to one project I built:

| Ability     | Project                                                      | What it is                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| **Decide**  | [Portico](https://github.com/Bhakti864653/uni-app-tracker)   | A command center for college applications                             |
| **Connect** | [Concord](https://github.com/Bhakti864653/concord)           | Mentorship matching with the Gale-Shapley stable matching algorithm   |
| **Learn**   | [Synaptiq](https://github.com/Bhakti864653/synaptiq)         | An adaptive study platform built from your own notes                  |
| **Act**     | [CommonGround](https://github.com/Bhakti864653/commonground) | A multilingual civic platform piloted in Santiago de Veraguas, Panama |

## What's inside

- **The four-verb system** on the homepage: four paths that all run through one center, "Human judgment". Choosing a verb introduces its project. On wide screens with motion allowed it is drawn in 3D (React Three Fiber, loaded only when it will be shown); on phones, with reduced motion, or without WebGL it is a flat SVG. Every word lives in normal HTML, never inside the 3D canvas.
- **A case study for each project** at `/work/[slug]`: the problem, design decisions, privacy and safety, the hardest challenge, limitations, and what I learned.
- **A development journey** showing the lessons that carried from one project into the next.
- Light and dark themes, a reduced-motion switch, keyboard-accessible controls, and a layout tested from 320px to 1440px.

Every claim about a project comes from that project's own README, development log, or code. The copy lives in one place: [`src/lib/projects.ts`](src/lib/projects.ts).

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber · Vitest + Testing Library · Prettier

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command                | What it does         |
| ---------------------- | -------------------- |
| `npm run dev`          | Start the dev server |
| `npm run build`        | Production build     |
| `npm test`             | Run the tests        |
| `npm run lint`         | ESLint               |
| `npm run typecheck`    | TypeScript check     |
| `npm run format:check` | Prettier check       |

When deploying, set `NEXT_PUBLIC_SITE_URL` to the site's real address so the sitemap and share links point to the right place. To show a résumé button in the Contact section, add a file at `public/resume.pdf`.
