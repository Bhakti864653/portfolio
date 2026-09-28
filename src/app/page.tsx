import { Arrival } from "@/components/home/Arrival";
import { Closing } from "@/components/home/Closing";
import { Portals } from "@/components/home/Portals";

export default function Home() {
  return (
    <>
      <Arrival />
      <Portals />
      <Closing />
    </>
  );
}
