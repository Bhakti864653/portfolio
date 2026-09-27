import { ChapterClose, ChapterOpening } from "../ChapterOpening";
import { Reveal } from "../Reveal";

const BELIEFS = [
  {
    title: "Technology should support human judgment.",
    body: "Every project here leaves the final call with a person: the student choosing what to study, the resident confirming a report, the moderator approving a change.",
  },
  {
    title: "AI should extend what people can do, not make them passive.",
    body: "The Synaptiq tutor answers only from your own notes. The CommonGround Guide drafts but never submits. Both are built to keep you thinking.",
  },
  {
    title: "Computer Science turns ideas into things people can use.",
    body: "It’s the difference between having a good idea about a problem and handing someone a working tool for it.",
  },
];

const BEYOND = [
  { label: "Science Club", detail: "Member" },
  { label: "Debate Club", detail: "Member" },
  {
    label: "Fundación Operación Sonrisa Panamá",
    detail: "School initiative supporting the foundation",
  },
  {
    label: "National Mathematics Olympiad",
    detail: "Represented my school twice",
  },
  { label: "Community service", detail: "More than 80 hours" },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="tone-night grain relative scroll-mt-16 bg-paper py-28 text-ink sm:py-40"
    >
      <div className="shell">
        <ChapterOpening
          number="03"
          title="About"
          id="about-title"
          heading="What I believe about building."
        >
          <p>
            I’m a 12th-grade student at The Oxford School in Panama, planning to
            study Computer Science. Long term, I want to build a company that
            creates technology around real human needs.
          </p>
        </ChapterOpening>

        {/* The principles: stacked and given room, so the page slows down here */}
        <Reveal className="mt-20 sm:mt-28">
          <ol>
            {BELIEFS.map((b, i) => (
              <li
                key={b.title}
                className="grid-12 gap-y-4 border-t border-line py-10 sm:py-14"
              >
                <p className="font-display text-5xl leading-none text-muted lg:col-span-2">
                  0{i + 1}
                </p>
                <p className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.06] lg:col-span-6">
                  {b.title}
                </p>
                <p className="body-copy max-w-[30rem] text-muted lg:col-span-4 lg:pt-2">
                  {b.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Secondary: supports the story without competing with the work */}
        <Reveal className="mt-16 sm:mt-20">
          <div className="grid-12 gap-y-4 border-t border-line pt-6">
            <h3 className="annot text-ink lg:col-span-4">Beyond the screen</h3>
            <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
              {BEYOND.map((item) => (
                <div key={item.label} className="border-b border-line py-3">
                  <dt className="font-semibold">{item.label}</dt>
                  <dd className="mt-0.5 text-[0.95rem] text-muted">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <ChapterClose
          number="03"
          next={{ href: "#contact", label: "04 Contact" }}
        />
      </div>
    </section>
  );
}
