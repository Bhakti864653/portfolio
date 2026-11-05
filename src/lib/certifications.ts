/**
 * Skills and certifications (no dates are shown, by choice). The section on About (and the strip on the home page) stays hidden
 * until there is at least one entry. To add one, append an object like this:
 *
 *   {
 *     name: "Claude Code in Action",
 *     issuer: "Anthropic Academy (Skilljar)",
 *     url: "https://verify.skilljar.com/c/your-certificate-id",
 *     badge: "/certificates/claude-code.png", // optional: an image in public/certificates/
 *   },
 */
export type Certification = {
  /** The course or certificate name, exactly as issued. */
  name: string;
  issuer: string;
  /** The public "View certificate" link. */
  url: string;
  /** Optional badge or logo image under public/. */
  badge?: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    name: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic",
    url: "https://verify.skilljar.com/c/kpxr3omhmyq4",
  },
  {
    name: "Claude Code in Action",
    issuer: "Anthropic",
    url: "https://verify.skilljar.com/c/scnvwnomq5d5",
  },
  {
    name: "Introduction to Model Context Protocol",
    issuer: "Anthropic",
    url: "https://verify.skilljar.com/c/9km8jmtmpv42",
  },
];
