import {
  getAllMatches,
  getFinishedMatches,
  getTopPlayersByPositionWithStats,
} from "@/utils/supabase/functions";
import TopPlayers from "@/components/stats/TopPlayers";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyTeamLineup from "@/components/myTeam/MyTeamLineup";
import BestLineup from "@/components/stats/BestLineup";

export const revalidate = 0;

// positionIDs and their names
const positions = [
  { id: 1, name: "Portero" },
  { id: 2, name: "Defensa" },
  { id: 3, name: "Centrocampista" },
  { id: 4, name: "Delantero" },
  { id: 5, name: "Entrenador" },
];

function formatAndSortPlayerData(
  players: players[],
  matches: matches[],
  positions: { id: number; name: string }[]
): { playersWithStatsAndPoints: players[]; playersGroupedByPosition: any[] } {
  const playersWithStatsAndPoints = players.map((player) => {
    const pointsData = {
      totalLocalPoints: 0,
      totalVisitorPoints: 0,
      localGames: 0,
      visitorGames: 0,
      averageLocalPoints: 0,
      averageVisitorPoints: 0,
    };

    const teamMatches = matches.filter(
      (m) =>
        m.localTeamID === player.teamID || m.visitorTeamID === player.teamID
    );

    teamMatches.forEach((match) => {
      const stat = player.stats.find((s) => s.week === match.week);
      if (stat) {
        if (match.localTeamID === player.teamID) {
          pointsData.localGames++;
          pointsData.totalLocalPoints += stat.totalPoints ?? 0;
        } else {
          pointsData.visitorGames++;
          pointsData.totalVisitorPoints += stat.totalPoints ?? 0;
        }
      }
    });

    pointsData.averageLocalPoints =
      pointsData.localGames > 0
        ? pointsData.totalLocalPoints / pointsData.localGames
        : 0;
    pointsData.averageVisitorPoints =
      pointsData.visitorGames > 0
        ? pointsData.totalVisitorPoints / pointsData.visitorGames
        : 0;

    return {
      ...player,
      pointsData,
    };
  });

  const playersGroupedByPosition = positions.map((position) => ({
    position: position.name,
    players: playersWithStatsAndPoints.filter(
      (player) => player.positionID === position.id
    ),
  }));

  return { playersWithStatsAndPoints, playersGroupedByPosition };
}

export default async function StatsPage() {
  const { topPlayersWithStats } = await getTopPlayersByPositionWithStats();
  const { allMatches: matchesData } = await getAllMatches();
  const { finishedMatches: finishedMatches } = await getFinishedMatches();

  const { playersGroupedByPosition, playersWithStatsAndPoints } =
    formatAndSortPlayerData(topPlayersWithStats, finishedMatches, positions);

  return (
    <>
      {/* <pre>{JSON.stringify(topPlayersWithStats, null, 2)}</pre> */}
      <div className="flex w-full">
        <Tabs defaultValue="top20" className="grow w-full mx-auto">
          <TabsList className="flex flex-row justify-center items-center ">
            <TabsTrigger className="w-full" value="top20">
              Top 20
            </TabsTrigger>
            <TabsTrigger className="w-full" value="plantilla">
              Best XI
            </TabsTrigger>
            <TabsTrigger className="w-full" value="partidos">
              <div className="flex gap-2 justify-center items-center">
                <p className="flex">Tabla</p>
                <div className="flex justify-center items-center p-1">
                  <svg
                    className="transition-all w-4 fill-red-600 group-hover:fill-neutral-100"
                    viewBox="0 0 70 64"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.91 25.173L20.332 0h16.854L15.497 30.861h14.08L7.675 42.026l-4.41-5.618C1.701 34.346.99 32.782.99 30.648c0-1.92.712-3.77 1.92-5.475zM17.203 51.2c0-1.778.712-3.698 1.99-5.547L51.265 0h18.56L33.841 51.2h16.213L24.882 64l-5.405-6.897c-1.493-1.92-2.275-3.84-2.275-5.902l.001-.002z"></path>
                  </svg>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top20" className="overflow-visible mx-auto">
            <TopPlayers
              players={playersGroupedByPosition}
              matches={matchesData}
            />
          </TabsContent>
          <TabsContent value="plantilla" className="overflow-visible mx-auto">
            <BestLineup players={playersWithStatsAndPoints} />
          </TabsContent>
          <TabsContent value="partidos" className="overflow-visible mx-auto">
            {/* <TeamMatchList matchesData={matchesData} teamselected={team.teamID} /> */}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
