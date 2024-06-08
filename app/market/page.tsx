import NewMarketDown from "@/app/market/(components)/NewMarketDown";
import NewMarketUp from "@/app/market/(components)/NewMarketUp";

type Props = {};

export default async function page(props: Props) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NewMarketUp />
      <NewMarketDown />
    </main>
  );
}
