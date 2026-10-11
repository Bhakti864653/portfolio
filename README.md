# Bhakti Ahir — Portfolio

> Technology should expand what people can do.

My personal portfolio, built around four human abilities, each tied to one project I built. Live at https://bhakti-ahir.vercel.app.

| Ability     | Project                                                      | What it is                                                          |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| **Decide**  | [Portico](https://github.com/Bhakti864653/uni-app-tracker)   | A command center for college applications                           |
| **Connect** | [Concord](https://github.com/Bhakti864653/concord)           | Mentorship matching with the Gale-Shapley stable matching algorithm |
| **Learn**   | [Synaptiq](https://github.com/Bhakti864653/synaptiq)         | An adaptive study platform built from your own notes                |
| **Act**     | [CommonGround](https://github.com/Bhakti864653/commonground) | A multilingual civic platform, run as an independent student demo   |

## What's inside

- **A short intro** on the first visit only: my name assembles on the paper, then gives way to the page (under two seconds, any key or tap skips it).
- **The statement**, "Technology should expand what people can do", revealed letter by letter; on a desktop the letters lean toward the cursor.
- **The four-path figure**: paths draw outward from "Human Judgment" one by one, bend and glow near the cursor, and choosing one floats in that project's preview (screenshot, one line, a badge). Opening it morphs the preview into the case study. On phones, the first tap previews and the second opens.
- **Stacking project cards**, a tech-stack marquee, and a statement that fills with color as you scroll past it.
- **Case studies** at `/work/[slug]`: a huge title, a summary card, a 16:9 media slot, a gallery of real screenshots with a lightbox, and five short sections with the full detail behind "Read more".
- **A journey** whose line draws itself as each project arrives.
- Smooth scrolling, page transitions (React's `<ViewTransition>`), a desktop-only custom cursor, magnetic buttons, film grain, and a hidden easter egg (try typing "panama" or "india").
- Light and dark themes and full keyboard navigation. With reduced motion (your system setting, or the **Motion** button), nothing moves: no intro, animations, smooth scrolling, custom cursor, or grain. Phones get a lighter version of the effects.

Every claim about a project comes from that project's own README, development log, or code. The copy lives in one place: [`src/lib/projects.ts`](src/lib/projects.ts).

## Adding things later

**A demo video** for a project's media slot (home cards, preview, and case study):

1. Put the video in `public/media/`, for example `public/media/portico.mp4` (MP4, ideally under 10 MB and without sound).
2. In `src/lib/projects.ts`, add one line inside that project, next to `badge:`:
   ```ts
   media: { video: "/media/portico.mp4" },
   ```
   It plays muted and looped once it scrolls into view, with the screenshot as its poster. To use a different poster image, add `poster: "/media/portico-poster.jpg"`.

**A certificate** (for example a Skilljar course): add one entry to `CERTIFICATIONS` in [`src/lib/certifications.ts`](src/lib/certifications.ts):

```ts
{
  name: "Claude Code in Action",
  issuer: "Anthropic Academy (Skilljar)",
  date: "2026-10",
  url: "https://verify.skilljar.com/c/your-certificate-id",
  badge: "/certificates/claude-code.png", // optional: put the image in public/certificates/
},
```

The "Skills & certifications" section on About, and the strip on the home page, appear on their own once there is at least one entry.

**A résumé**: save the PDF as `public/resume.pdf`. The Résumé buttons (header, phone menu, home page, and Contact) appear automatically on the next deploy.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Lenis (smooth scrolling) · Vitest + Testing Library · Prettier

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

When deploying, set `NEXT_PUBLIC_SITE_URL` to the site's real address so the sitemap and share links point to the right place.
