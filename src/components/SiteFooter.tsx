import Link from "next/link";
import { SITE } from "@/lib/projects";

/** Also the no-JavaScript route to every page, since the phone menu needs JS to open. */
const PAGES = [
  { href: "/work", label: "Work" },
  { href: "/journey", label: "Journey" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="annot shell flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
        <span>© 2026 Bhakti Ahir · Panamá</span>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-ink">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className="flex gap-5">
          <a href={SITE.github} className="hover:text-ink">
            GitHub
          </a>
          <a href={SITE.linkedin} className="hover:text-ink">
            LinkedIn
          </a>
          <a href={`mailto:${SITE.email}`} className="hover:text-ink">
            Email
          </a>
        </span>
      </div>
    </footer>
  );
}
