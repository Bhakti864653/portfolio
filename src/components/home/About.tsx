import { ChapterOpening } from "../ChapterOpening";
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
      className="scroll-mt-16 py-24 sm:py-32"
    >
      <div className="shell">
        <ChapterOpening
          part="III"
          label="Point of view"
          id="about-title"
          heading="What I believe about building."
        >
          <p>
            I’m a 12th-grade student at The Oxford School in Panama, planning to
            study Computer Science. Long term, I want to build a company that
            creates technology around real human needs.
          </p>
        </ChapterOpening>

        {/* The principles: one ordered row of three, numbered like the rest of the site */}
        <Reveal className="mt-16 sm:mt-20">
          <ol className="grid gap-y-10 border-t border-ink lg:grid-cols-3">
            {BELIEFS.map((b, i) => (
              <li
                key={b.title}
                className="pt-6 lg:border-l lg:border-line lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
              >
                <p className="annot text-ink">0{i + 1}</p>
                <p className="mt-4 font-display text-[1.9rem] leading-[1.1]">
                  {b.title}
                </p>
                <p className="body-copy mt-4 text-muted">{b.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Secondary: supports the story without competing with the work */}
        <Reveal className="mt-24 sm:mt-28">
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
      </div>
    </section>
  );
}
