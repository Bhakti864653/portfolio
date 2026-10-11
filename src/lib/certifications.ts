/**
 * Skills and certifications. The section on About (and the strip on the home page) stays hidden
 * until there is at least one entry. To add one, append an object like this:
 *
 *   {
 *     name: "Claude Code in Action",
 *     issuer: "Anthropic Academy (Skilljar)",
 *     date: "2026-10",
 *     url: "https://verify.skilljar.com/c/your-certificate-id",
 *     badge: "/certificates/claude-code.png", // optional: an image in public/certificates/
 *   },
 */
export type Certification = {
  /** The course or certificate name, exactly as issued. */
  name: string;
  issuer: string;
  /** Year and month earned, as "YYYY-MM". */
  date: string;
  /** The public "View certificate" link. */
  url: string;
  /** Optional badge or logo image under public/. */
  badge?: string;
};

export const CERTIFICATIONS: Certification[] = [];

/** "2026-10" → "October 2026". */
export function formatMonth(date: string): string {
  const [year, month] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
