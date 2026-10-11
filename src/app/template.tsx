import { ViewTransition } from "react";

/**
 * Remounts on every navigation, so each page animates in. Where the browser supports view
 * transitions, the old page slides away as the new one rises in (see ::view-transition rules in
 * globals.css), and named elements (a project's picture and title) morph across. Elsewhere the
 * page simply eases in (.route-enter). Under reduced motion neither moves.
 */
export default function Template({ children }: LayoutProps<"/">) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="route-enter">{children}</div>
    </ViewTransition>
  );
}
