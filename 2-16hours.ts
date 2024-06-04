//app/login
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/myteams");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}


//app/myteams/[squadid]

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  getAllMatches,
  fetchStatsForMyTeamsPlayers,
  fetchMyTeamPlayers,
  getFinishedMatches,
  getMySquads,
  deleteSquadById,
  getSquadById,
} from "@/utils/supabase/functions";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { formatter, lastChangeStyle } from "@/utils/utils";
import NextMatchesValueTable from "@/components/myTeam/MyTeamMatchesValueTable";
import PointHistoryTable from "@/components/myTeam/MyTeamPointHistoryTable";

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

    const mysquad = await getSquadById(squadID);

    return (
      <div className="w-full">
        {/* <pre>{JSON.stringify(mysquad, null, 2)}</pre> */}
        <div className="flex flex-col justify-start items-center gap-4">
          {/* TEAM INFO CARD */}

          <Card className="transition-all flex flex-row justify-between items-center  md:px-8 px-4 pt-2 pb-4 md:py-2  w-full text-xs md:text-sm  ">
            <div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-2 md:gap-6 w-full ">
              <h2 className="text-lg font-semibold text-center">
                {team.squadName}
              </h2>
              <div className="flex flex-row justify-center items-center">
                <p className=" font-normal mr-2">Valor:</p>
                <p className=" font-bold">
                  {formatter.format(totalMarketValue)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <p className=" font-normal mr-2">Cambio:</p>

                {totalLastChange > 0 ? (
                  <ChevronsUp className="w-4 h-4 text-green-600" />
                ) : (
                  <ChevronsDown className="w-4 h-4 text-red-500" />
                )}
                <p
                  className={`font-bold text-right tabular-nums text-xs md:text-sm  tracking-tighter  ${lastChangeStyle(
                    totalLastChange
                  )}`}
                >
                  {" "}
                  {formatter.format(totalLastChange)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <p className=" font-normal mr-2	">Jugadores:</p>
                <p className=" font-bold">{numberOfPlayers} /26</p>
              </div>
            </div>
          </Card>
          <NextMatchesValueTable players={teamPlayers} matches={matchesData} />

          <PointHistoryTable players={teamPlayers} matches={matchesData} />
        </div>
      </div>
    );
  }
}



//app/myteams
import { createClient } from "@/utils/supabase/server";
import MyTeams from "@/components/myTeam/MySquadStats";
import {
  getAllMatches,
  fetchStatsForMyTeamsPlayers,
  fetchMyTeamPlayers,
  getFinishedMatches,
  getMySquads,
} from "@/utils/supabase/functions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Trash2, Pencil, Eye } from "lucide-react";

export const revalidate = 0;

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

export default async function MyTeamsPage() {
  const supabase = createClient();
  const email = await getUserEmail(supabase);

  if (!email) {
    return redirect("/login");
  }

  try {
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

    return (
      <div className="flex flex-col justify-start items-center max-w-2xl mx-auto">
        <div className="flex flex-row justify-between items-center w-full pb-4">
          <h1 className="text-xl font-bold w-2/3 text-center">My Teams</h1>
          <Link className="w-1/3 flex justify-end mr-4" href="/squads">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              New Team
            </button>
          </Link>
        </div>
        {/* <Separator className="my-4"/> */}
        <div className="container mx-auto">
          <div className="flex flex-row justify-between items-center">
            <div className="font-bold w-1/4 text-center">Nombre</div>
            <div className="font-bold w-1/4 text-center">Jugadores</div>
            <div className="font-bold w-1/2 text-center"></div>
          </div>
          <Separator className="my-2" />

          <div className="flex flex-col justify-start gap-2">
            {mySquads.map((squad) => (
              <div
                key={squad.squadID}
                className="flex flex-row justify-between items-center"
              >
                <div className="w-1/4 flex-none text-center">
                  {squad.squadName}
                </div>
                <div className="w-1/4 flex-none text-center">
                  {Array.isArray(squad.playersIDS) ? squad.playersIDS.length : 0}/26
                </div>
                <div className="flex flex-row justify-end items-center gap-4 w-1/2 shrink-0 ">
                  <Link
                    href={`myteams/${squad.squadID}`}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold rounded p-2"
                  >
                    <Eye size={20} />
                  </Link>
                  <Link
                    href={`squads/${squad.squadID}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded p-2"
                  >
                    <Pencil size={20} />
                  </Link>
                  <button
                    // onClick={() => deleteSquad(squad.squadID)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                  {/* <Link
                    href={`lineup/${squad.squadID}`}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded p-2"
                  >
                    Edit lineup
                  </Link> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return redirect("/error");
  }
}

//components/myTeam/MySquadStats.tsx
"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import Link from "next/link";
import { formatter, lastChangeStyle } from "@/utils/utils";
import NextMatchesValueTable from "./MyTeamMatchesValueTable";
import PointHistoryTable from "./MyTeamPointHistoryTable";
import { deleteSquadById, fetchPlayersByIDs } from "@/utils/supabase/functions";
import React, { useState, useEffect, useCallback } from "react";

interface PlayerWithStats extends players {
  stats: stats[];
}

const MyTeams = ({
  teams,
  matches,
  session,
}: {
  teams: any;
  matches: matches[];
  session: string;
}) => {
  const [selectedTeam, setSelectedTeam] = useState(teams[0] || null);
  const [squads, setSquads] = useState(teams || []);

  const handleTeamSelect = useCallback(
    async (teamId: string) => {
      const team = squads.find((team) => team.squadID.toString() === teamId);

      if (team) {
        const playerIDs = team.playersIDS.map((p) => p.playerID);
        const players = await fetchPlayersByIDs(playerIDs);
        setSelectedTeam({ ...team, players });
      } else {
        setSelectedTeam(null);
      }
    },
    [squads]
  );

  const deleteSquad = useCallback(
    async (squadId: string) => {
      await deleteSquadById(squadId);
      const updatedSquads = squads.filter((squad) => squad.id !== squadId);
      setSquads(updatedSquads);
      setSelectedTeam(updatedSquads.length > 0 ? updatedSquads[0] : null);
    },
    [squads]
  );

  const selectedTeamPlayers = selectedTeam?.players || [];
  const numberOfPlayers = selectedTeamPlayers.length;
  const totalMarketValue = selectedTeamPlayers.reduce(
    (acc, player) => acc + (player.marketValue || 0),
    0
  );
  const totalLastChange = selectedTeamPlayers.reduce(
    (acc, player) => acc + (player.lastMarketChange || 0),
    0
  );

  return (
    <>
      <div className="flex flex-col justify-start items-center gap-4">
        <div className="flex w-full md:flex-row flex-col justify-between items-center gap-4">
          <Card className="transition-all flex flex-row justify-between items-center gap-6 md:gap-8 md:px-6 px-4 py-2 md:w-3/4 w-full text-xs md:text-sm h-full md:h-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-6 w-full">
              <div className="flex flex-row justify-center items-center">
                <p className="font-normal mr-2">Valor:</p>
                <p className="font-bold">
                  {formatter.format(totalMarketValue)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <p className="font-normal mr-2">Cambio:</p>
                {totalLastChange > 0 ? (
                  <ChevronsUp className="w-4 h-4 text-green-600" />
                ) : (
                  <ChevronsDown className="w-4 h-4 text-red-500" />
                )}
                <p
                  className={`font-bold text-right tabular-nums text-xs md:text-sm tracking-tighter ${lastChangeStyle(
                    totalLastChange
                  )}`}
                >
                  {formatter.format(totalLastChange)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <p className="font-normal mr-2">Jugadores:</p>
                <p className="font-bold">{numberOfPlayers} /26</p>
              </div>
            </div>
          </Card>
        </div>

        {selectedTeam && (
          <>
            <NextMatchesValueTable
              players={selectedTeamPlayers}
              matches={matches}
            />
            <PointHistoryTable
              players={selectedTeamPlayers}
              matches={matches}
            />
          </>
        )}
      </div>
    </>
  );
};

export default MyTeams;
