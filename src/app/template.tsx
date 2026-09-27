/** Remounts on every navigation, so each new page eases in (see .route-enter). */
export default function Template({ children }: LayoutProps<"/">) {
  return <div className="route-enter">{children}</div>;
}
