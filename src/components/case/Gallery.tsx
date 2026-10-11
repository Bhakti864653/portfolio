"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Shot } from "@/lib/projects";

/**
 * Real screenshots of the live app in a grid. Opening one shows it large in a lightbox (a native
 * modal dialog, so focus stays inside and Escape closes it); the arrow keys and buttons move
 * between shots, and closing returns focus to the thumbnail that opened it.
 */
export function Gallery({ shots, name }: { shots: Shot[]; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number, button: HTMLButtonElement) => {
    opener.current = button;
    setIndex(i);
    const el = dialog.current;
    if (el?.showModal) el.showModal();
    else el?.setAttribute("open", "");
  };
  const close = useCallback(() => {
    const el = dialog.current;
    if (el?.close) el.close();
    else {
      el?.removeAttribute("open");
      setIndex(null);
    }
  }, []);
  const step = useCallback(
    (by: number) =>
      setIndex((i) =>
        i === null ? i : (i + by + shots.length) % shots.length,
      ),
    [shots.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => {
      setIndex(null);
      opener.current?.focus();
    };
    el.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("close", onClose);
    };
  }, [step]);

  const shot = index === null ? null : shots[index];

  return (
    <>
      <ul className="gallery grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shots.map((s, i) => (
          <li key={s.src}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              data-cursor="Open"
              className="gallery-thumb group block w-full overflow-hidden rounded-[10px] border border-line bg-soft text-left"
            >
              <span className="relative block aspect-video overflow-hidden">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="gallery-image object-cover object-left-top"
                />
              </span>
              <span className="sr-only">
                Open screenshot {i + 1} of {shots.length} larger
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={`${name} screenshots`}
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {shot && (
          <figure className="lightbox-figure">
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="92vw"
              className="lightbox-image"
            />
            <figcaption className="lightbox-caption mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span>{shot.alt}</span>
              <span className="annot lightbox-caption">
                {index! + 1} / {shots.length}
              </span>
            </figcaption>
          </figure>
        )}
        <div className="lightbox-controls">
          <button
            type="button"
            onClick={() => step(-1)}
            className="lightbox-btn"
          >
            ← Previous
          </button>
          <button type="button" onClick={close} className="lightbox-btn">
            Close
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="lightbox-btn"
          >
            Next →
          </button>
        </div>
      </dialog>
    </>
  );
}
