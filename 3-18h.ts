//compon/myteam/myteammarchesvalietable
import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatMoney,
  formatter,
  getNextGames,
  getPositionBadge,
  lastChangeStyle,
  slugById,
} from "@/utils/utils";
import Image from "next/image";

interface MyTeamMatchesValueTableProps {
  players: players[];
  matches: matches[];
}

const MyTeamMatchesValueTable: React.FC<MyTeamMatchesValueTableProps> = ({
  players,
  matches,
}) => {
  // console.log("Players in MyTeamMatchesValueTable:", players); // Log the players to verify order

  return (
    <Card className="flex flex-col justify-start items-start  w-full  ">
      <Table className="">
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-text-center w-14">Pos</TableHead>
            <TableHead className=" text-center ">Jugador</TableHead>
            <TableHead className=" text-center ">Proximos Partidos</TableHead>
            <TableHead className=" text-center">Puntos</TableHead>
            <TableHead className=" text-center">Local</TableHead>
            <TableHead className=" text-center">Visitante</TableHead>
            <TableHead className=" text-right">Cambio</TableHead>
            <TableHead className=" text-right">Valor</TableHead>
            <TableHead className=" text-center p-0 m-0 md:hidden min-w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="p-0 m-0">
          {players.map((player, index) => {
            const nextThreeMatches = getNextGames(matches, player, 4);
            return (
              <TableRow key={player.playerID} className="">
                <TableCell className="">
                  <div
                    className={getPositionBadge(player.positionID).className}
                  >
                    {getPositionBadge(player.positionID).abbreviation}
                  </div>
                </TableCell>
                <TableCell className=" p-0 m-0 truncate min-w-[200px]">
                  <Link
                    className="flex flex-row justify-start items-center gap-1"
                    href={`/player/${player.playerID}`}
                  >
                    <div className="flex justify-center items-center flex-shrink-0 w-6 h-6">
                      <Image
                        src={`/teamLogos/${slugById(player.teamID)}.png`}
                        alt={player.teamName}
                        width={40}
                        height={40}
                        className="w-auto h-5"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="flex flex-col justify-start items-center flex-shrink-0 h-10 p-0 m-0 overflow-hidden">
                      <Image
                        src={player.image}
                        alt={player.nickname}
                        width={60}
                        height={60}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="text-xs md:text-sm  font-semibold whitespace-nowrap shrink-0">
                      {player.nickname.includes(" ") &&
                      player.nickname.length > 12
                        ? `${player.nickname.split(" ")[0].charAt(0)}. ${
                            player.nickname.split(" ")[1]
                          }${
                            player.nickname.split(" ").length > 2
                              ? ` ${player.nickname.split(" ")[2]}`
                              : ""
                          }`
                        : player.nickname}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="bg-neutral-100 border-x-2">
                  <div className="flex justify-center items-center space-x-2">
                    {nextThreeMatches.map((match, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex justify-center items-center w-6">
                          <Image
                            src={`/teamLogos/${slugById(
                              match.localTeamID === player.teamID
                                ? match.visitorTeamID
                                : match.localTeamID
                            )}.png`}
                            alt="opponent"
                            width={24}
                            height={24}
                            className="h-6 w-auto"
                          />
                        </div>
                        <div className="flex justify-center items-center ml-1">
                          {match.visitorTeamID !== player.teamID ? (
                            <HomeIcon
                              style={{ fontSize: 18 }}
                              className="text-neutral-500"
                            />
                          ) : (
                            <FlightIcon
                              style={{ fontSize: 18 }}
                              className="rotate-45 text-neutral-400"
                            />
                          )}
                        </div>
                        {index < nextThreeMatches.length - 1 && (
                          <div className="mx-1 h-5 border-r border-gray-400"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center ">
                  <div className="flex flex-row justify-center items-center gap-0.5">
                    <p className="font-bold text-base ">{player.points}</p>
                    <div className="mx-2 h-6 border-l border-neutral-300"></div>
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold leading-none">
                        {player.averagePoints?.toFixed(2)}
                      </p>
                      <p className="text-[11px] leading-none ">Media</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center bg-neutral-100 border-x-2">
                  <div className="flex flex-row justify-center items-center ">
                    <HomeIcon fontSize="small" className="text-neutral-400" />
                    <p className="font-bold ml-1">
                      {player.pointsData?.totalLocalPoints}
                    </p>
                    <div className="mx-2 h-6 border-l border-neutral-300"></div>
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold leading-none">
                        {player.pointsData?.averageLocalPoints?.toFixed(2)}
                      </p>
                      <p className="text-[11px] leading-none ">Media</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-row justify-center items-center ">
                    <FlightIcon
                      fontSize="small"
                      className="rotate-45 text-neutral-400"
                    />
                    <p className="font-bold ml-1">
                      {player.pointsData?.totalVisitorPoints}
                    </p>
                    <div className="mx-2 h-6 border-l border-neutral-300"></div>
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold leading-none">
                        {player.pointsData?.averageVisitorPoints?.toFixed(2)}
                      </p>
                      <p className="text-[11px] leading-none">Media</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  className={`bg-neutral-100 border-x-2 font-bold text-right tabular-nums text-xs md:text-sm  tracking-tighter  ${lastChangeStyle(
                    player.lastMarketChange
                  )}`}
                >
                  {formatter.format(player.lastMarketChange)}
                </TableCell>
                <TableCell className="font-semibold text-right tabular-nums text-xs md:text-sm tracking-tighter ">
                  {formatMoney(player.marketValue)}
                </TableCell>
                <TableCell className="text-center p-0 m-0 md:hidden">
                  <div className="flex flex-col justify-start items-center flex-shrink-0 h-10 p-0 m-0 overflow-hidden">
                    <Image
                      src={player.image}
                      alt={player.nickname}
                      width={60}
                      height={60}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default MyTeamMatchesValueTable;


//app/myteam/{squadid}
import { createClient } from "@/utils/supabase/server";
import { getAllPlayers, getSquadById } from "@/utils/supabase/functions";
import { redirect } from "next/navigation";
import {
  getAllMatches,
  fetchStatsForMyTeamsPlayers,
  fetchMyTeamPlayers,
  getFinishedMatches,
  getMySquads,
} from "@/utils/supabase/functions";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsDown, ChevronsUp } from "lucide-react";

import { formatter, lastChangeStyle } from "@/utils/utils";
import NextMatchesValueTable from "@/components/myTeam/MyTeamMatchesValueTable";
import PointHistoryTable from "@/components/myTeam/MyTeamPointHistoryTable";
import { deleteSquadById, fetchPlayersByIDs } from "@/utils/supabase/functions";

type Props = {
  playerData: players;
};

export const revalidate = 0;

// Helper function to get player stats map
function getPlayerStatsMap(stats) {
  const playerStatsMap = new Map();
  stats.forEach((stat) => {
    if (!playerStatsMap.has(stat.playerID)) {
      playerStatsMap.set(stat.playerID, []);
    }
    playerStatsMap.get(stat.playerID)?.push(stat);
  });
  return playerStatsMap;
}

function calculatePointsData(player, playerStats, matches) {
  const pointsData = {
    totalLocalPoints: 0,
    totalVisitorPoints: 0,
    localGames: 0,
    visitorGames: 0,
    averageLocalPoints: 0,
    averageVisitorPoints: 0,
  };

  const teamMatches = matches.filter(
    (m) => m.localTeamID === player.teamID || m.visitorTeamID === player.teamID
  );

  teamMatches.forEach((match) => {
    const stat = playerStats.find((s) => s.week === match.week);
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

  return pointsData;
}

function formatAndSortPlayerData(players, stats, matches, squads) {
  const playerStatsMap = getPlayerStatsMap(stats);

  const playersWithStatsAndPoints = players.map((player) => ({
    ...player,
    stats: playerStatsMap.get(player.playerID) || [],
    pointsData: calculatePointsData(
      player,
      playerStatsMap.get(player.playerID) || [],
      matches
    ),
  }));

  const squadsWithPlayers = squads.map((squad) => ({
    ...squad,
    players: Array.isArray(squad.playersIDS)
      ? squad.playersIDS
          .map((player) =>
            typeof player === "object" &&
            player !== null &&
            "playerID" in player
              ? playersWithStatsAndPoints.find(
                  (p) => p?.playerID === player?.playerID
                )
              : null
          )
          .filter((p) => p !== null)
      : [],
  }));

  squadsWithPlayers.forEach((squad) => {
    squad.players.sort((a, b) => {
      if (a && b) {
        if (a.positionID !== b.positionID) {
          return (a.positionID ?? 0) - (b.positionID ?? 0);
        }
        return a.playerID - b.playerID;
      }
      return 0;
    });
  });

  return squadsWithPlayers;
}

const getUserEmail = async (supabase) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return user.email;
};

export default async function MyTeam({
  params,
}: {
  params: { squadID: string };
}) {
  const squadID = params.squadID;
  const players = await getAllPlayers();
  const supabase = createClient();
  const email = await getUserEmail(supabase);

  if (!email) {
    return redirect("/login");
  }

  if (email) {
    const { mySquads } = await getMySquads(email);
    const playerIds = mySquads.flatMap((squad) =>
      Array.isArray(squad.playersIDS)
        ? squad.playersIDS
            .map((player) =>
              typeof player === "object" &&
              player !== null &&
              "playerID" in player
                ? player.playerID
                : null
            )
            .filter((id) => id !== null)
        : []
    );

    const [stats, players, { finishedMatches }, { allMatches: matchesData }] =
      await Promise.all([
        fetchStatsForMyTeamsPlayers(playerIds),
        fetchMyTeamPlayers(playerIds),
        getFinishedMatches(),
        getAllMatches(),
      ]);

    const squadsWithFormattedAndCalculatedData = formatAndSortPlayerData(
      players,
      stats,
      finishedMatches,
      mySquads
    );

    const team = squadsWithFormattedAndCalculatedData.find(
      (team) => team.squadID.toString() === squadID
    );

    const teamPlayers = team.players;
    const numberOfPlayers = teamPlayers.length;
    const totalMarketValue = teamPlayers.reduce(
      (acc, player) => acc + (player.marketValue || 0),
      0
    );
    const totalLastChange = teamPlayers.reduce(
      (acc, player) => acc + (player.lastMarketChange || 0),
      0
    );

    // const squadsWithPlayers = await Promise.all(
    //   mySquads.map(async (squad) => {
    //     const playerIDs = squad.playersIDS.map((p) => p.playerID);
    //     const players = await fetchPlayersByIDs(playerIDs);
    //     return {
    //       ...squad,
    //       players,
    //     };
    //   })
    // );

    // const squad = team || squadsWithPlayers[0];

    // const squadData = await getSquadById(String(squadID));
    // const playersIDS = squadData.playersIDS.map((player) =>
    //   typeof player === "object" && player !== null && "playerID" in player
    //     ? player.playerID
    //     : null
    // );

    return (
      <div className="w-full">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-lg font-semibold text-center my-1">
            {team.squadName}
          </h2>

          <NextMatchesValueTable players={teamPlayers} matches={matchesData} />

          <PointHistoryTable players={teamPlayers} matches={matchesData} />
        </div>
      </div>
    );
  }
}
