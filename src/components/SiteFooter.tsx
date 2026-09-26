import { SITE } from "@/lib/projects";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="annot mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-6 sm:flex-row sm:justify-between sm:px-8">
        <span>© 2026 Bhakti Ahir</span>
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
        <span>Built with Next.js · Panamá</span>
      </div>
    </footer>
  );
}
