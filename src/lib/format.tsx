import { Fragment, type ReactNode } from "react";

/** Renders `backtick` spans in project copy as <code>; everything else stays plain text. */
export function inline(text: string): ReactNode {
  return text
    .split(/(`[^`]+`)/g)
    .map((part, i) =>
      part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
        <code key={i}>{part.slice(1, -1)}</code>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );
}
