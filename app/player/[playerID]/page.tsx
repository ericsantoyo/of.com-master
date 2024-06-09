import {
  getPlayerById,
  getMatchesByTeamID,
  getTeamByTeamID,
} from "@/utils/supabase/functions";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { formatMoney, nicknameById, slugById } from "@/utils/utils";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";
import PlayerAllValueTable from "@/app/player/(components)/PlayerAllValueTable";
import PlayerFantasyStat from "@/app/player/(components)/PlayerFantasyStat";
import PlayerMatchesStats from "@/app/player/(components)/PlayerMatchesStats";
import PlayerNextMatches from "@/app/player/(components)/PlayerNextMatches";
import PlayerPreviousMatches from "@/app/player/(components)/PlayerPreviousMatches";
import PlayerValueChart from "@/app/player/(components)/PlayerValueChart";

type Props = {
  playerData: players;
};

export const revalidate = 0;

export default async function Player({
  params,
}: {
  params: { playerID: number };
}) {
  const { player: playerData, stats: playerStat } = await getPlayerById(
    params.playerID
  );

  if (!playerData || playerData.teamID === null) {
    return notFound();
  }

  const { teamMatches: matchesData } = await getMatchesByTeamID(
    playerData.teamID
  );
  const { teamData: teamInfo } = await getTeamByTeamID(playerData.teamID);

  function formatPlayerWithStats(playerData: players, playerStat: stats[]) {
    const playerStats = playerStat.filter(
      (stat) => stat.playerID === playerData.playerID
    );
    return { playerData, stats: playerStats };
  }

  const playerWithStats = formatPlayerWithStats(playerData, playerStat);

  let totalLocalPoints = 0;
  let totalVisitorPoints = 0;
  let localGames = 0;
  let visitorGames = 0;

  playerStat.forEach((stat) => {
    const match = matchesData.find((m) => m.week === stat.week);
    if (match) {
      if (match.localTeamID === playerWithStats.playerData.teamID) {
        localGames++;
        if (stat.totalPoints !== null) {
          totalLocalPoints += stat.totalPoints;
        }
      } else if (match.visitorTeamID === playerWithStats.playerData.teamID) {
        visitorGames++;
        if (stat.totalPoints !== null) {
          totalVisitorPoints += stat.totalPoints;
        }
      }
    }
  });

  const averageLocalPoints = localGames > 0 ? totalLocalPoints / localGames : 0;
  const averageVisitorPoints =
    visitorGames > 0 ? totalVisitorPoints / visitorGames : 0;

  return (
    <div className="w-full">
      <Card className="relative flex flex-row justify-between items-center w-full  p-4 ">
        {/* POINTS INFO */}
        <div className="z-40 flex justify-start items-center w-1/3 gap-4">
          <Card className="backdrop-blur-sm p-1.5  md:p-4 bg-white/30 z-40 flex flex-col md:flex-row justify-between items-center  ">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-row justify-center items-center  w-full">
                <div className=" font-bold uppercase text-center w-min whitespace-nowrap	 ">
                  {nicknameById(playerData.teamID)}
                </div>
                <div className="mx-1 h-4 border-l border-neutral-300"></div>
                <Image
                  src={`/teamLogos/${slugById(playerData.teamID)}.png`}
                  alt={playerData.teamName || "teamLogo"}
                  width={24}
                  height={24}
                  className="h-6 w-auto"
                />
              </div>
              <div className="my-2 w-20 border-b border-neutral-300"></div>
              <div className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center gap-1">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-xs uppercase font-medium">Puntos</p>
                    <div className="flex justify-center items-center ">
                      <p className="text-lg font-bold">{playerData.points}</p>
                      <div className="mx-1 h-6 border-l border-neutral-300"></div>
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-md font-bold">
                          {(playerData.averagePoints ?? 0).toFixed(2)}
                        </p>
                        <p className="text-xs font-medium">Media</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-2 h-24 border-l border-neutral-300 hidden md:flex"></div>
            <div className="flex flex-col justify-between items-center ">
              <div className="my-1 w-20 border-b border-neutral-300 md:hidden"></div>
              <div className="flex flex-row justify-center items-center">
                <div className="flex flex-col justify-center items-center ">
                  <HomeIcon fontSize="small" />
                  <p className="text-lg font-bold">{totalLocalPoints}</p>
                  <Separator className="w-full my-1" />
                  <p className="text-xs font-medium">Media</p>
                  <p className="text-md font-bold">
                    {averageLocalPoints.toFixed(2)}
                  </p>
                </div>
                <div className="mx-1 md:mx-2 h-24 border-l border-neutral-300"></div>
                <div className="flex flex-col justify-center items-center">
                  <FlightIcon fontSize="small" className="rotate-45" />
                  <p className="text-lg font-bold">{totalVisitorPoints}</p>
                  <Separator className="w-full my-1" />
                  <p className="text-xs font-medium">Media</p>
                  <p className="text-md font-bold">
                    {averageVisitorPoints.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {/* Card for marketValue and lastMarketChange */}
          <Card className="backdrop-blur-sm p-1.5 md:p-4 bg-white/30 z-40 hidden lg:flex flex-col justify-center items-center gap-1">
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs uppercase font-medium">Valor</p>
              <div className="flex flex-col justify-center items-center ">
                <p className="text-lg font-bold">
                  {formatMoney(playerData.marketValue ?? 0)}
                </p>
                <div className="my-1.5 w-20 border-b border-neutral-300"></div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex justify-center items-center">
                    {(playerData.lastMarketChange ?? 0) > 0 ? (
                      <ChevronsUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ChevronsDown className="w-4 h-4 text-red-500" />
                    )}
                    <div
                      className={`font-bold tabular-nums tracking-tight 
      ${
        (playerData.lastMarketChange ?? 0) < 0
          ? "text-red-500 dark:text-red-400"
          : "text-green-600 dark:text-green-400"
      }`}
                    >
                      {formatMoney(playerData.lastMarketChange ?? 0)}
                    </div>
                  </div>

                  <p className="text-xs font-medium">Último cambio</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        {/* IMAGE & NAME */}
        <div className="z-40 flex flex-col justify-center items-center gap-2 lg:gap-4 w-1/3">
          <div className="h-36 ">
            <Image
              src={playerData.image || "/playerImages/defaultplayer.png"}
              alt={playerData.nickname || "Player Image"}
              width={144}
              height={144}
              className="backdrop-blur-sm h-36 object-cover object-top rounded-full border-2 border-white drop-shadow-md"
            />
          </div>

          <div className="">
            <h3 className="font-bold text-lg md:text-xl mx-auto text-center  leading-none">
              {playerData.nickname}
            </h3>
          </div>

          <Card className="backdrop-blur-sm p-1 bg-white/30 z-40 flex lg:hidden flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              {/* <p className="text-xs font-medium">Valor</p> */}
              <div className="flex flex-col justify-center items-center ">
                <div className="flex gap-1 justify-center items-center">
                  <p className="text-xs font-bold ">
                    {formatMoney(playerData.marketValue ?? 0)}
                  </p>
                  <p className="text-sm">€</p>
                </div>
                <div className="my-0.5 w-20 border-b border-neutral-300"></div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex justify-center items-center">
                    {(playerData.lastMarketChange ?? 0) > 0 ? (
                      <ChevronsUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <ChevronsDown className="w-3 h-3 text-red-500" />
                    )}
                    <div
                      className={`text-xs font-bold tabular-nums tracking-tight 
                                          ${
                                            (playerData.lastMarketChange ?? 0) <
                                            0
                                              ? "text-red-500 dark:text-red-400"
                                              : "text-green-600 dark:text-green-400"
                                          }`}
                    >
                      {formatMoney(playerData.lastMarketChange ?? 0)}
                    </div>
                  </div>

                  {/* <p className="text-xs font-medium">Último cambio</p> */}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* MATCHES INFO */}
        <div className="z-40 flex flex-col justify-center items-end md:flex-row md:justify-end gap-5 md:gap-4 w-1/3">
          {/* LAST MATCHES */}
          <div className="flex flex-col justify-start items-center h-full">
            <p className="text-xs uppercase font-bold pb-1 text-center">
              Últimos...
            </p>
            <div className="hidden lg:flex">
              <PlayerPreviousMatches
                matchesData={matchesData}
                playerWithStats={playerWithStats}
                fetchedPlayer={playerData}
                howMany={4}
              />
            </div>
            <div className="flex lg:hidden">
              <PlayerPreviousMatches
                matchesData={matchesData}
                playerWithStats={playerWithStats}
                fetchedPlayer={playerData}
                howMany={3}
              />
            </div>
          </div>
          {/* NEXT MATCHES */}
          <div className="flex flex-col justify-start items-center h-full">
            <p className="text-xs uppercase font-bold pb-1 text-center">
              Próximos...
            </p>
            <div className="hidden lg:flex">
              <PlayerNextMatches
                matches={matchesData}
                selectedTeam={playerData.teamID}
                dateClass="hidden"
                howMany={4}
              />
            </div>
            <div className="flex lg:hidden">
              <PlayerNextMatches
                matches={matchesData}
                selectedTeam={playerData.teamID}
                dateClass="hidden"
                howMany={3}
              />
            </div>
          </div>
        </div>
        {/* BACKGROUND */}
        <div
          className="inset-0 bg-no-repeat bg-center absolute z-0 w-full h-full  bg-cover"
          style={{
            backgroundImage: `url(${teamInfo[0].stadium})`,
            opacity: 0.2,
          }}
        ></div>
      </Card>
      <Tabs defaultValue="puntos" className="grow w-full mx-auto">
        <TabsList className="flex flex-row justify-center items-center mt-2">
          <TabsTrigger className="w-full" value="puntos">
            Puntos
          </TabsTrigger>
          <TabsTrigger className="w-full" value="valor">
            Valor
          </TabsTrigger>
          <TabsTrigger className="w-full" value="stats">
            Stats
          </TabsTrigger>
          <TabsTrigger className="w-full" value="noticias">
            Noticias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="puntos" className="overflow-visible mx-auto">
          <PlayerMatchesStats
            matchesData={matchesData}
            playerStat={playerStat}
            playerData={playerData}
          />
        </TabsContent>
        <TabsContent value="valor" className="overflow-visible mx-auto ">
          {/* GRAPH */}
          <Card className="flex flex-col justify-center items-center py-2">
            <div className="flex w-full h-full justify-start items-center">
              <PlayerValueChart fetchedPlayer={playerData} />
            </div>
            <Separator className="w-full mb-2" />
            <PlayerAllValueTable
              playerData={playerData}
              playerStat={playerStat}
            />
          </Card>
        </TabsContent>
        <TabsContent value="stats" className="overflow-visible mx-auto">
          {/* STATS */}
          <PlayerFantasyStat
            matchesData={matchesData}
            playerStat={playerStat}
            playerData={playerData}
          />
        </TabsContent>
        <TabsContent
          value="noticias"
          className="overflow-visible mx-auto"
        ></TabsContent>
      </Tabs>
    </div>
  );
}
