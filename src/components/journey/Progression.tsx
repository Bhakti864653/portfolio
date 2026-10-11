"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { STAGES } from "@/lib/journey";
import { useMotion } from "@/lib/prefs";
import { projectBySlug } from "@/lib/projects";

/**
 * The four projects side by side. From 1024px it is a horizontal track the visitor
 * scrolls natively (trackpad, shift-wheel, arrow keys, or the buttons), with a position
 * indicator; below that it is a plain vertical sequence. No scroll hijacking either way.
 *
 * As each stage comes into view, its line draws itself in (across on a desktop, down on a
 * phone), then the card bursts in and its step number counts up. Under reduced motion every
 * stage is simply there.
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
              className={`accent-${s.id} h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= current ? "bg-a1" : "bg-line"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            data-magnetic="0.2"
            className="press annot inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-ink disabled:opacity-35"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            disabled={current === STAGES.length - 1}
            data-magnetic="0.2"
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
        {STAGES.map((s, i) => (
          <Stage key={s.id} index={i} id={s.id} />
        ))}
        {/* Room after the last stage, so every stage can reach the left edge */}
        <li
          aria-hidden="true"
          className="hidden shrink-0 lg:block lg:w-[calc(100%-min(34rem,44%))]"
        />
      </ol>
    </div>
  );
}

function Stage({ index, id }: { index: number; id: string }) {
  const s = STAGES[index];
  const p = projectBySlug(id)!;
  const item = useRef<HTMLLIElement>(null);
  const motion = useMotion();
  const [shown, setShown] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  // Draw the line, then burst the card in and count its number up, once, when it scrolls in.
  useEffect(() => {
    const el = item.current;
    if (!el || motion !== "full") return;
    if (shown) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motion, shown]);

  useEffect(() => {
    if (!shown) return;
    const target = index + 1;
    let n = 0;
    const start = setTimeout(function tick() {
      n += 1;
      setCount(n);
      if (n < target) timer = setTimeout(tick, 140);
    }, 380);
    let timer: ReturnType<typeof setTimeout> | undefined;
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [shown, index]);

  const state = motion !== "full" ? undefined : shown ? "shown" : "waiting";
  // Without motion the number is simply shown; with it, it counts up from 00 once in view.
  const number = state === undefined ? index + 1 : (count ?? 0);

  return (
    <li
      ref={item}
      data-stage
      data-state={state}
      className={`stage accent-${s.id} relative shrink-0 pb-14 pl-7 lg:w-[min(34rem,44%)] lg:snap-start lg:pb-0 lg:pl-0 lg:pr-12 lg:pt-10`}
      style={{ "--n": index } as CSSProperties}
    >
      {/* The timeline's line: down the left edge on a phone, across the top on a desktop */}
      <span aria-hidden="true" className="stage-line bg-a1" />
      <span
        aria-hidden="true"
        className="stage-dot absolute -left-[8px] top-0 h-3.5 w-3.5 rounded-full border-2 border-a1 bg-paper lg:-top-[8px] lg:left-0"
      />
      <div className="stage-body">
        <p className="annot text-a1">
          <span className="tabular-nums">
            {String(number).padStart(2, "0")}
          </span>
          <span className="text-muted">
            {" "}
            / 0{STAGES.length} · <span className="capitalize">{p.verb}</span>
          </span>
        </p>
        <h2 className="mt-2 font-display text-[clamp(2.4rem,4vw,3.25rem)] leading-none">
          {s.label}
        </h2>

        <div className="relative mt-6 aspect-video overflow-hidden rounded-[8px] border border-line">
          <Image
            src={p.screenshot.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 30rem, 90vw"
            className="object-cover object-left-top"
          />
        </div>

        <dl className="mt-6 space-y-5">
          <div>
            <dt className="annot text-ink">The problem</dt>
            <dd className="body-copy mt-1.5 text-ink">{s.started}</dd>
          </div>
          <div className="border-l-2 border-a1 bg-soft py-3 pl-4 pr-3">
            <dt className="annot text-ink">The lesson I keep</dt>
            <dd className="mt-1.5 text-[1.02rem] leading-relaxed">
              {s.lesson}
            </dd>
          </div>
        </dl>

        <details className="read-more mt-5">
          <summary className="group flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold">
            <span className="link-draw">What it introduced</span>
            <span
              aria-hidden="true"
              className="text-lg leading-none transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="read-more-body pt-3">
            <ul className="flex flex-wrap gap-1.5">
              {s.introduced.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
            <p className="body-copy mt-4 text-muted">
              What failed: {p.caseStudy.challenge.heading}.
            </p>
          </div>
        </details>
      </div>
    </li>
  );
}

const stagesOf = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>("[data-stage]"));
