# Bhakti Ahir — Portfolio

> Technology should expand what people can do.

My personal portfolio, built around four human abilities, each tied to one project I built. Live at https://bhakti-ahir.vercel.app.

| Ability     | Project                                                      | What it is                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| **Decide**  | [Portico](https://github.com/Bhakti864653/uni-app-tracker)   | A command center for college applications                             |
| **Connect** | [Concord](https://github.com/Bhakti864653/concord)           | Mentorship matching with the Gale-Shapley stable matching algorithm   |
| **Learn**   | [Synaptiq](https://github.com/Bhakti864653/synaptiq)         | An adaptive study platform built from your own notes                  |
| **Act**     | [CommonGround](https://github.com/Bhakti864653/commonground) | A multilingual civic platform piloted in Santiago de Veraguas, Panama |

## What's inside

- **The four-verb system** on the homepage: an entrance of two screens on one sheet of paper, where a fine line runs from my name into four paths that meet at one center, "Human Judgment". On large screens with motion allowed the sheet pans across as you scroll; on phones, with reduced motion, or without JavaScript the two screens simply stack. Below it, one entrance per ability introduces its project. The figure is SVG and every word is normal HTML.
- **A case study for each project** at `/work/[slug]`: the problem, design decisions, privacy and safety, the hardest challenge, limitations, and what I learned.
- **A development journey** showing the lessons that carried from one project into the next, plus an about page and a contact page.
- Light and dark themes, a reduced-motion switch, keyboard-accessible controls, and a layout tested from 320px to 1440px.

Every claim about a project comes from that project's own README, development log, or code. The copy lives in one place: [`src/lib/projects.ts`](src/lib/projects.ts).

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Vitest + Testing Library · Prettier

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
