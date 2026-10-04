import { Closing } from "@/components/home/Closing";
import { Entrance } from "@/components/home/Entrance";
import { Portals } from "@/components/home/Portals";

export default function Home() {
  return (
    <>
      <Entrance />
      <Portals />
      <Closing />
    </>
  );
}
