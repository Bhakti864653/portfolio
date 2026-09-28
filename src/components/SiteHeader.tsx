"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { setMotion, setTheme, useMotion, useTheme } from "@/lib/prefs";
import { SITE } from "@/lib/projects";

export const ROUTES = [
  { id: "index", href: "/", number: "00", label: "Index" },
  { id: "work", href: "/work", number: "01", label: "Work" },
  { id: "journey", href: "/journey", number: "02", label: "Journey" },
  { id: "about", href: "/about", number: "03", label: "About" },
  { id: "contact", href: "/contact", number: "04", label: "Contact" },
] as const;

/** The route a path belongs to: case studies live under Work. */
export function routeFor(pathname: string) {
  return (
    ROUTES.slice(1).find(
      (r) => pathname === r.href || pathname.startsWith(`${r.href}/`),
    ) ?? (pathname === "/" ? ROUTES[0] : null)
  );
}

/**
 * The route transition: on every navigation a line crosses under the header, in the project's
 * color on a case study and in ink elsewhere. Purely decorative; it never delays the new page.
 */
function RouteLine({ pathname }: { pathname: string }) {
  const slug = pathname.startsWith("/work/") ? pathname.slice(6) : null;
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[-1px] h-[2px] overflow-hidden"
    >
      <div
        key={pathname}
        className={`route-line h-full origin-left ${slug ? `accent-${slug} bg-a1` : "bg-ink"}`}
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
        aria-label={`Theme: ${theme}. Switch to ${theme === "dark" ? "light" : "dark"}.`}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full border border-ink ${theme === "dark" ? "bg-ink" : ""}`}
        />
        Theme
      </button>
      <button
        type="button"
        className={button}
        aria-label={`Motion: ${motion === "reduce" ? "reduced" : "full"}. Switch to ${motion === "reduce" ? "full" : "reduced"}.`}
        onClick={() => setMotion(motion === "reduce" ? "full" : "reduce")}
      >
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-[2px] border border-ink ${motion === "reduce" ? "" : "bg-ink"}`}
        />
        Motion
      </button>
    </div>
  );
}

/** The phone menu: a full-screen index of the pages. Focus stays inside; Escape closes it. */
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
      aria-label="Menu"
      className="grain fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper lg:hidden"
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between border-b border-line">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3"
          aria-label="Bhakti Ahir, home"
        >
          <span className="font-display text-2xl leading-none">
            Bhakti Ahir
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="press annot inline-flex h-11 items-center rounded-full border border-line-strong px-4 text-ink"
        >
          Close
        </button>
      </div>

      <nav aria-label="Pages" className="shell flex-1 py-6">
        <ol>
          {ROUTES.map((c) => (
            <li key={c.id} className="border-b border-line">
              <Link
                href={c.href}
                onClick={onClose}
                aria-current={active === c.id ? "page" : undefined}
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
  const active = routeFor(pathname)?.id ?? null;
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
            aria-current={active === "index" ? "page" : undefined}
          >
            <span className="font-display text-2xl leading-none tracking-tight">
              Bhakti Ahir
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ol className="flex items-center gap-8">
              {ROUTES.slice(1).map((c) => (
                <li key={c.id}>
                  <Link
                    href={c.href}
                    aria-current={active === c.id ? "page" : undefined}
                    className={`link-draw annot flex items-baseline gap-2 pb-0.5 transition-colors ${active === c.id ? "text-ink" : "hover:text-ink"}`}
                  >
                    <span
                      className={active === c.id ? "text-ink" : "text-faint"}
                    >
                      {c.number}
                    </span>
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
        <RouteLine pathname={pathname} />
      </header>
      {/* Outside the header: its backdrop blur would otherwise contain this fixed panel. */}
      {open && <ChapterMenu id={menuId} active={active} onClose={close} />}
    </>
  );
}
