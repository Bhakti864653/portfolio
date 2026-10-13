import Image from "next/image";
import { CERTIFICATIONS, formatMonth } from "@/lib/certifications";

/**
 * Skills and certifications from lib/certifications.ts. Renders nothing at all until there is at
 * least one entry. `compact` is the one-row strip on the home page; the full version is on About.
 */
export function Certifications({ compact = false }: { compact?: boolean }) {
  if (CERTIFICATIONS.length === 0) return null;

  if (compact)
    return (
      <section
        aria-labelledby="certs-strip-title"
        className="border-b border-line py-10"
      >
        <div className="shell flex flex-wrap items-center gap-x-8 gap-y-4">
          <h2 id="certs-strip-title" className="annot text-ink">
            Certifications
          </h2>
          <ul className="flex flex-wrap gap-3">
            {CERTIFICATIONS.map((c) => (
              <li key={c.url}>
                <a href={c.url} className="cert-chip" data-magnetic="0.2">
                  {c.name}
                  <span className="text-muted"> · {c.issuer}</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );

  return (
    <section aria-labelledby="certs-title" className="shell py-16 sm:py-24">
      <div className="grid-12 gap-y-6">
        <h2 id="certs-title" className="annot text-ink lg:col-span-3">
          Skills &amp; certifications
        </h2>
        {/* One certificate gets a full-width card; from two on, a two-column grid. */}
        <ul
          className={`grid gap-4 lg:col-span-9 ${CERTIFICATIONS.length > 1 ? "sm:grid-cols-2" : "max-w-2xl"}`}
        >
          {CERTIFICATIONS.map((c) => (
            <li
              key={c.url}
              className="flex gap-4 rounded-[10px] border border-line bg-soft p-5"
            >
              {c.badge && (
                <Image
                  src={c.badge}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-md object-contain"
                />
              )}
              <div>
                <p className="font-semibold leading-snug">{c.name}</p>
                <p className="mt-1 text-[0.95rem] text-muted">
                  {c.issuer} · {formatMonth(c.date)}
                </p>
                <a
                  href={c.url}
                  className="link-draw mt-3 inline-block text-sm font-semibold"
                >
                  View certificate ↗<span className="sr-only">: {c.name}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
