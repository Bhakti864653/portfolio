"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, useMotion } from "@/lib/prefs";
import { EasterEgg } from "./EasterEgg";

type LenisLike = {
  scrollTo: (
    target: number,
    options?: {
      duration?: number;
      immediate?: boolean;
      onComplete?: () => void;
    },
  ) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    /** The smooth-scroll instance, when one is running (desktop, full motion). */
    __lenis?: LenisLike;
  }
}

/**
 * The site-wide motion layer, mounted once in the layout. Everything here is desktop-only
 * (a fine pointer that can hover) and off under reduced motion, so phones stay light and
 * nothing moves for anyone who asked it not to:
 *
 * - smooth scrolling (Lenis),
 * - a custom cursor that follows the real one (never hiding it) and grows over [data-cursor],
 * - magnetic pull on [data-magnetic] and a gentle 3D tilt on [data-tilt].
 *
 * The easter egg is the exception: it works everywhere, and under reduced motion it shows only
 * its caption.
 */
export function MotionLayer() {
  const motion = useMotion();
  const desktop = useMediaQuery("(hover: hover) and (pointer: fine)");
  const on = motion === "full" && desktop;

  useSmoothScroll(on);
  usePointerEffects(on);
  useReady();

  return (
    <>
      {on && <Cursor />}
      <EasterEgg />
    </>
  );
}

/** Marks the page as settled (after load, when the browser is idle), for decoration that waits. */
function useReady() {
  useEffect(() => {
    const root = document.documentElement;
    const mark = () => {
      root.dataset.ready = "";
    };
    const idle = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(mark, { timeout: 2500 })
        : setTimeout(mark, 600);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => window.removeEventListener("load", idle);
  }, []);
}

function useSmoothScroll(on: boolean) {
  useEffect(() => {
    if (!on) return;
    let lenis: LenisLike | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ autoRaf: true, anchors: true, lerp: 0.11 });
      lenis = instance;
      window.__lenis = instance;
      document.documentElement.classList.add("lenis-on");
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
      document.documentElement.classList.remove("lenis-on");
    };
  }, [on]);
}

/** Magnetic buttons and tilting cards, by delegation: one listener for the whole page. */
function usePointerEffects(on: boolean) {
  useEffect(() => {
    if (!on) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const active = new Set<HTMLElement>();

    const reset = (el: HTMLElement) => {
      el.style.removeProperty("translate");
      el.style.removeProperty("--tilt-x");
      el.style.removeProperty("--tilt-y");
      el.style.removeProperty("--glare-x");
      el.style.removeProperty("--glare-y");
      active.delete(el);
    };

    const update = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;
      const magnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      for (const el of active) if (el !== magnet && el !== tilt) reset(el);

      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const pull = Number(magnet.dataset.magnetic) || 0.3;
        magnet.style.translate = `${dx * pull}px ${dy * pull}px`;
        active.add(magnet);
      }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
        tilt.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
        tilt.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
        tilt.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
        active.add(tilt);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      for (const el of [...active]) reset(el);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [on]);
}

/**
 * A soft ring that trails the real cursor (which always stays visible). Over anything with
 * [data-cursor] it grows and shows that label, e.g. "View" over project cards. It never takes
 * pointer events, so it can't block a click, and keyboard and touch users never see it.
 */
function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    const tick = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      if (ring.current)
        ring.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame =
        Math.abs(x - cx) + Math.abs(y - cy) > 0.1
          ? requestAnimationFrame(tick)
          : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled ? labelled.dataset.cursor || "" : null);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const hide = () => setVisible(false);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("keydown", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("keydown", hide);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="cursor-ring"
      data-visible={visible || undefined}
      data-label={label !== null || undefined}
    >
      <span>{label}</span>
    </div>
  );
}
