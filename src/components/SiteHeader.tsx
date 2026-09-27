"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { setMotion, setTheme, useMotion, useTheme } from "@/lib/prefs";
import { SITE } from "@/lib/projects";
import { Monogram } from "./Monogram";

const CHAPTERS = [
  { id: "index", number: "00", label: "Index" },
  { id: "work", number: "01", label: "Work" },
  { id: "journey", number: "02", label: "Journey" },
  { id: "about", number: "03", label: "About" },
  { id: "contact", number: "04", label: "Contact" },
];

/** Which homepage chapter is under the reading line. Case-study pages belong to Work. */
function useActiveChapter(pathname: string) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);
  return pathname.startsWith("/work/") ? "work" : active;
}

/** A thin line under the header, filling in the four project colors as you read. */
function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[-1px] h-[2px]"
    >
      <div
        ref={bar}
        className="h-full origin-left"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(90deg, var(--portico-1) 0 25%, var(--synaptiq-1) 25% 50%, var(--concord-1) 50% 75%, var(--commonground-1) 75%)",
        }}
      />
    </div>
  );
}

function Preferences() {
  const theme = useTheme();
  const motion = useMotion();
  const button =
    "press annot inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-ink hover:border-line-strong";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={button}
        aria-pressed={theme === "dark"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full border border-ink ${theme === "dark" ? "bg-ink" : ""}`}
        />
        Dark
      </button>
      <button
        type="button"
        className={button}
        aria-pressed={motion === "reduce"}
        onClick={() => setMotion(motion === "reduce" ? "full" : "reduce")}
      >
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-[2px] border border-ink ${motion === "reduce" ? "bg-ink" : ""}`}
        />
        Reduce motion
      </button>
    </div>
  );
}

/** The phone menu: a full-screen chapter index. Focus stays inside; Escape closes it. */
function ChapterMenu({
  id,
  active,
  onClose,
}: {
  id: string;
  active: string | null;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
    focusables()[0]?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      id={id}
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Chapters"
      className="grain fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper lg:hidden"
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between border-b border-line">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3"
          aria-label="Bhakti Ahir, home"
        >
          <Monogram className="h-8 w-auto text-ink" title={null} />
          <span className="font-display text-xl leading-none">Bhakti Ahir</span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="press annot inline-flex h-11 items-center rounded-full border border-line-strong px-4 text-ink"
        >
          Close
        </button>
      </div>

      <nav aria-label="Chapters" className="shell flex-1 py-6">
        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.id} className="border-b border-line">
              <Link
                href={`/#${c.id}`}
                onClick={onClose}
                aria-current={active === c.id ? "true" : undefined}
                className="group flex min-h-16 items-baseline gap-5 py-3"
              >
                <span className="annot w-7 text-faint">{c.number}</span>
                <span
                  className={`font-display text-[2.5rem] leading-none ${active === c.id ? "text-ink" : "text-muted group-hover:text-ink"}`}
                >
                  {c.label}
                </span>
                {active === c.id && (
                  <span className="annot ml-auto self-center text-ink">
                    You are here
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>

        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            { href: SITE.linkedin, label: "LinkedIn ↗" },
            { href: SITE.github, label: "GitHub ↗" },
            { href: `mailto:${SITE.email}`, label: "Email" },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="press inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Preferences />
        </div>
      </nav>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const active = useActiveChapter(pathname);
  const toggle = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggle.current?.focus();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <a
          href="#main"
          className="annot absolute left-4 top-2 -translate-y-20 rounded bg-ink px-3 py-2 text-paper focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="shell flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Bhakti Ahir, home"
          >
            <Monogram className="h-8 w-auto text-ink" title={null} />
            <span className="font-display text-xl leading-none tracking-tight">
              Bhakti Ahir
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ol className="flex items-center gap-8">
              {CHAPTERS.slice(1).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/#${c.id}`}
                    aria-current={active === c.id ? "true" : undefined}
                    className={`link-draw annot flex items-baseline gap-2 pb-0.5 transition-colors ${active === c.id ? "text-ink" : "hover:text-ink"}`}
                  >
                    <span className="text-faint">{c.number}</span>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="hidden lg:block">
            <Preferences />
          </div>

          <button
            ref={toggle}
            type="button"
            className="press annot inline-flex h-11 items-center rounded-full border border-line px-4 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
        <ReadingProgress />
      </header>
      {/* Outside the header: its backdrop blur would otherwise contain this fixed panel. */}
      {open && <ChapterMenu id={menuId} active={active} onClose={close} />}
    </>
  );
}
