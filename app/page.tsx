import GamesPreview from "@/components/GamesPreview";
import NewMarketDown from "@/app/market/(components)/NewMarketDown";
import NewMarketUp from "@/app/market/(components)/NewMarketUp";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
  getAllPlayers,
  getAllStats,
  getMatchesByTeamID,
  getAllTeams,
  getAllMatches,
} from "@/utils/supabase/functions";
import { getCurrentWeek } from "@/utils/utils";

const GamesPreviewSkeleton = () => {
  return (
    <div className="flex flex-col justify-start items-center w-full h-full overflow-y-auto grow">
      <div className="flex flex-row justify-center items-center gap-2 pb-2">
        <Button variant="outline" className="mr-3 ">
          <ChevronLeftIcon />
        </Button>
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
        <div className="mx-2 h-4 border-l border-neutral-300"></div>
        <Skeleton className="h-6 w-28" />
        <Button variant="outline" className="ml-3">
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="flex flex-row justify-between items-center w-full p-1 ">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-2 mx-auto w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="" key={index}>
              <Skeleton className="flex flex-row justify-between items-center text-center w-full h-full p-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default async function Home() {
  const { allMatches: matchesData } = await getAllMatches();
  const initialWeek = getCurrentWeek(matchesData);
  const { allPlayers: players } = (await getAllPlayers()) as {
    allPlayers: players[];
  };
  const { allStats: stats } = (await getAllStats()) as { allStats: stats[] };
  const { allTeams: teams } = (await getAllTeams()) as { allTeams: teams[] };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* <pre>{JSON.stringify(matchesData, null, 2)}</pre> */}
      <Suspense fallback={<GamesPreviewSkeleton />}>
        <div className="col-span-full">
          <GamesPreview initialWeek={initialWeek} matches={matchesData} />
        </div>
      </Suspense>
      <div className="col-span-full w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-3" />
      <NewMarketUp allPlayers={players} allStats={stats} allMatches={matchesData} />
      <NewMarketDown allPlayers={players} allStats={stats} allMatches={matchesData} />
    </main>
  );
}
