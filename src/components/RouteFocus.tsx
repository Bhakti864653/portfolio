"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * After a client-side navigation, moves focus to the new page's heading, so keyboard and screen
 * reader users start at the top of the new page instead of on a link that no longer exists.
 * Skipped on first load (the browser handles that) and when the URL points at a section.
 */
export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.location.hash) return;
    const target =
      document.querySelector<HTMLElement>("#main h1") ??
      document.getElementById("main");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
