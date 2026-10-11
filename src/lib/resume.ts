import { existsSync } from "node:fs";
import path from "node:path";

/** The Résumé buttons appear on their own once a real file is dropped at public/resume.pdf. */
export const HAS_RESUME = existsSync(
  path.join(process.cwd(), "public", "resume.pdf"),
);
