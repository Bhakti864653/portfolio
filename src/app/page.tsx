import { Certifications } from "@/components/Certifications";
import { Closing } from "@/components/home/Closing";
import { Entrance } from "@/components/home/Entrance";
import { Intro } from "@/components/home/Intro";
import { Marquee } from "@/components/home/Marquee";
import { Showcase } from "@/components/home/Showcase";
import { StatementFill } from "@/components/home/StatementFill";
import { HAS_RESUME } from "@/lib/resume";
import { preload } from "react-dom";

export default function Home() {
  // The opening screen's paper is the largest thing on it: start fetching it with the page.
  preload("/paper/sheet-light.webp", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Intro />
      <Entrance />
      <Showcase />
      <Marquee />
      <StatementFill />
      <Certifications compact />
      <Closing hasResume={HAS_RESUME} />
    </>
  );
}
