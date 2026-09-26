import { About } from "@/components/home/About";
import { Chapters } from "@/components/home/Chapters";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Journey } from "@/components/home/Journey";

export default function Home() {
  return (
    <>
      <Hero />
      <Chapters />
      <Journey />
      <About />
      <Contact />
    </>
  );
}
