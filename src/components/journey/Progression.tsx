"use client";

import { useEffect, useRef, useState } from "react";
import { STAGES } from "@/lib/journey";
import { projectBySlug } from "@/lib/projects";

/**
 * The four projects side by side. From 1024px it is a horizontal track the visitor
 * scrolls natively (trackpad, shift-wheel, arrow keys, or the buttons), with a position
 * indicator; below that it is a plain vertical sequence. No scroll hijacking either way.
 */
export function Progression() {
  const track = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  // The current stage is the one whose start is nearest the track's left edge (or the last one
  // once the track is scrolled to its end), so the indicator always names the leading stage.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const items = stagesOf(el);
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setAtEnd(end);
      if (end) {
        setCurrent(items.length - 1);
        return;
      }
      let best = 0;
      items.forEach((item, i) => {
        if (
          Math.abs(item.offsetLeft - el.scrollLeft) <
          Math.abs(items[best].offsetLeft - el.scrollLeft)
        )
          best = i;
      });
      setCurrent(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  function go(index: number) {
    const el = track.current;
    const item = el ? stagesOf(el)[index] : undefined;
    if (!el || !item) return;
    const smooth = document.documentElement.dataset.motion !== "reduce";
    el.scrollTo({
      left: item.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  const stage = STAGES[current];

  return (
    <div>
      {/* Position indicator and controls (desktop only; the phone layout is a plain column) */}
      <div className="mb-8 hidden items-center justify-between gap-6 lg:flex">
        <p className="annot text-ink" aria-live="polite">
          <span className={`accent-${stage.id} text-a1`}>0{current + 1}</span> /
          0{STAGES.length} · {stage.label}
        </p>
        <div aria-hidden="true" className="flex flex-1 gap-1.5">
          {STAGES.map((s, i) => (
            <span
              key={s.id}
              className={`accent-${s.id} h-[3px] flex-1 rounded-full transition-colors duration-300 ${i <= current ? "bg-a1" : "bg-line"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="press annot inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-ink disabled:opacity-35"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            disabled={current === STAGES.length - 1}
            className="press annot inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-ink disabled:opacity-35"
          >
            Next →
          </button>
        </div>
      </div>

      <ol
        ref={track}
        tabIndex={0}
        aria-label="Four projects"
        className={`relative flex flex-col lg:snap-x lg:snap-mandatory lg:flex-row lg:overflow-x-auto lg:overscroll-x-contain lg:pb-6 ${atEnd ? "" : "lg:[mask-image:linear-gradient(to_right,black_88%,transparent)]"}`}
      >
        {STAGES.map((s, i) => {
          const p = projectBySlug(s.id)!;
          return (
            <li
              key={s.id}
              data-stage
              className={`accent-${s.id} relative shrink-0 border-l-2 border-a1 pb-14 pl-7 lg:w-[min(34rem,44%)] lg:snap-start lg:border-l-0 lg:border-t-2 lg:pb-0 lg:pl-0 lg:pr-12 lg:pt-10`}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[8px] top-0 h-3.5 w-3.5 rounded-full border-2 border-a1 bg-paper lg:-top-[8px] lg:left-0"
              />
              <p className="annot text-a1">
                0{i + 1}
                <span className="text-muted">
                  {" "}
                  / 0{STAGES.length} ·{" "}
                  <span className="capitalize">{p.verb}</span>
                </span>
              </p>
              <h2 className="mt-2 font-display text-[clamp(2.4rem,4vw,3.25rem)] leading-none">
                {s.label}
              </h2>

              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="annot text-ink">The problem</dt>
                  <dd className="body-copy mt-1.5 text-ink">{s.started}</dd>
                </div>
                <div>
                  <dt className="annot text-ink">What it introduced</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {s.introduced.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line-strong px-2.5 py-1 text-[0.85rem] leading-none"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="annot text-ink">What failed</dt>
                  <dd className="body-copy mt-1.5 text-muted">
                    {p.caseStudy.challenge.heading}.
                  </dd>
                </div>
                <div>
                  <dt className="annot text-ink">What I learned</dt>
                  <dd className="body-copy mt-1.5 text-muted">
                    {p.caseStudy.learned[0]}
                  </dd>
                </div>
                <div className="border-l-2 border-a1 bg-soft py-3 pl-4 pr-3">
                  <dt className="annot text-ink">The lesson I keep</dt>
                  <dd className="mt-1.5 text-[0.98rem] leading-relaxed text-muted">
                    {s.lesson}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
        {/* Room after the last stage, so every stage can reach the left edge */}
        <li
          aria-hidden="true"
          className="hidden shrink-0 lg:block lg:w-[calc(100%-min(34rem,44%))]"
        />
      </ol>
    </div>
  );
}

const stagesOf = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>("[data-stage]"));
