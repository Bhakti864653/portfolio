import { TECH } from "@/lib/projects";

/**
 * A slow, looping band of the technologies behind the four projects. The list is read once by
 * screen readers; the moving copy is decorative. It pauses on hover, and under reduced motion it
 * stands still and wraps.
 */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : "Technologies I use"}
      className="marquee-row"
    >
      {TECH.map((t) => (
        <li key={t} className="marquee-item">
          {t}
          <span aria-hidden="true" className="marquee-dot">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <section
      aria-label="Tech stack"
      className="marquee below-fold border-b border-line"
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
