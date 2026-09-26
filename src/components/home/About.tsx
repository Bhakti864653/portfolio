import { Reveal } from "../Reveal";

const BELIEFS = [
  {
    n: "i.",
    title: "Technology should support human judgment.",
    body: "Every project here leaves the final call with a person: the student choosing what to study, the resident confirming a report, the moderator approving a change.",
  },
  {
    n: "ii.",
    title: "AI should extend what people can do, not make them passive.",
    body: "The Synaptiq tutor answers only from your own notes. The CommonGround Guide drafts but never submits. Both are built to keep you thinking.",
  },
  {
    n: "iii.",
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
      className="scroll-mt-16 border-y border-line bg-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="annot flex justify-between border-t border-ink pt-3">
          <span>Part III · Point of view</span>
          <span>About</span>
        </div>

        <Reveal className="mt-10 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="about-title"
              className="font-display text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.98]"
            >
              What I believe{" "}
              <span className="italic text-muted">about building.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted">
              I’m a 12th-grade student at The Oxford School in Panama, planning
              to study Computer Science.
            </p>
            <div className="mt-10 border-t border-line pt-5">
              <p className="annot">Long-term goal</p>
              <p className="mt-2 max-w-md font-display text-2xl leading-snug">
                Build a company that creates technology around real human needs.
              </p>
            </div>
          </div>

          <ol className="lg:col-span-7">
            {BELIEFS.map((b) => (
              <li
                key={b.n}
                className="grid grid-cols-[3rem_1fr] gap-2 border-b border-line py-7 first:pt-0"
              >
                <span className="font-display text-2xl italic text-muted">
                  {b.n}
                </span>
                <div>
                  <p className="font-display text-[1.9rem] leading-tight">
                    {b.title}
                  </p>
                  <p className="mt-2 max-w-prose leading-relaxed text-muted">
                    {b.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-24 grid gap-8 lg:grid-cols-12">
          <h3 className="font-display text-3xl lg:col-span-5">
            Beyond the screen
          </h3>
          <dl className="lg:col-span-7">
            {BEYOND.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <dt className="font-display text-xl">{item.label}</dt>
                <dd className="annot sm:text-right">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
