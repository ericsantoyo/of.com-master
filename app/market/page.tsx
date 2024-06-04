import NewMarketDown from "@/components/market/NewMarketDown";
import NewMarketUp from "@/components/market/NewMarketUp";
import {
  getAllPlayers,
  getAllStats,
  getAllMatches,
  getAllTeams,
} from "@/utils/supabase/functions";

type Props = {};

export default async function page(props: Props) {
  const { allPlayers: players } = await getAllPlayers();
  const { allStats: stats } = await getAllStats();
  const { allMatches: matchesData } = await getAllMatches();
  const { allTeams: teams } = await getAllTeams();

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NewMarketUp />
      <NewMarketDown />
    </main>
  );
}
