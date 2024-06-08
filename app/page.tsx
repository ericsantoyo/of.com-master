import GamesPreview from "@/components/GamesPreview";
import NewMarketDown from "@/app/market/(components)/NewMarketDown";
import NewMarketUp from "@/app/market/(components)/NewMarketUp";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-full  ">
        <GamesPreview />
      </div>
      <Separator className="col-span-full " />
      <NewMarketUp />
      <NewMarketDown />
    </main>
  );
}
