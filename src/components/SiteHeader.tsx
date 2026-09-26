"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Monogram } from "./Monogram";
import { setMotion, setTheme, useMotion, useTheme } from "@/lib/prefs";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#journey", label: "Journey" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function Preferences() {
  const theme = useTheme();
  const motion = useMotion();
  const button =
    "annot inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-ink hover:border-line-strong";
  return (
    <div className="flex items-center gap-2">
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  // Close the phone menu whenever the route or hash changes.
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <a
        href="#main"
        className="annot absolute left-4 top-2 -translate-y-20 rounded bg-ink px-3 py-2 text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Bhakti Ahir, home"
        >
          <Monogram className="h-8 w-8 text-ink" title={null} />
          <span className="font-display text-xl leading-none tracking-tight">
            Bhakti Ahir
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="annot text-ink hover:underline hover:underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Preferences />
        </div>

        <button
          type="button"
          className="annot inline-flex h-9 items-center rounded-full border border-line px-4 text-ink lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-line bg-paper px-4 pb-6 pt-4 sm:px-8 lg:hidden"
      >
        <nav aria-label="Main (menu)">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-3 font-display text-3xl"
                >
                  {item.label}
                  <span className="annot">{pathname === "/" ? "↓" : "→"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-5">
          <Preferences />
        </div>
      </div>
    </header>
  );
}
