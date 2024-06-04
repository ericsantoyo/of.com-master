//actions/action.ts wasnt there. created.

'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSquads(email: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('squads')
    .select('*')
    .eq('email', email);

  return data || [];
}

export async function deleteSquad(formData : FormData) {
  try {
    const id = formData.get('id');
    const supabase = createClient();
    await supabase
      .from('squads')
      .delete()
      .eq('squadID' , id);

    // Revalidate the path after deleting a squad
    revalidatePath('/myteams');
  } catch (error) {
    console.error('Error deleting squad:', error);
  }
}


export async function createSquad(formData: FormData) {
  const supabase = createClient();
  const squadName = formData.get('squadName') as string;
  const playerIDs = formData.getAll('playerIDs') as string[];
  const email = formData.get('email') as string;

  const newSquad = {
    squadName,
    playersIDS: playerIDs.map((id) => ({ playerID: id })),
    email,
  };

  await supabase.from('squads').insert(newSquad);

  // Revalidate the path after creating a squad
  revalidatePath('/myteams');
}



//app/myteams/page.tsx
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
import AuthButton from "@/components/AuthButton";

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
      <div className="flex flex-col justify-start items-center max-w-2xl mx-auto gap-4">
        <div className="flex justify-end w-full">
        <AuthButton />
        </div>
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
    
  }
}




//app/squads/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  createNewSquad,
  getAllPlayers,
  getAllTeams,
  getAllUsers,
} from "@/utils/supabase/functions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Squad() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [squadName, setSquadName] = useState("");
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlayers = async () => {
      const { allPlayers } = await getAllPlayers();
      setPlayers(allPlayers);
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      const { allTeams } = await getAllTeams(); // Fetch all teams
      setTeams(allTeams); // Set the teams state with the fetched data
    };

    fetchTeams(); // Call the fetchTeams function
  }, []);

  function getTeamByTeamID(teamID) {
    const team = teams.find((team) => team.teamID === teamID);
    return team ? team.image : "";
  }

  useEffect(() => {
    const supabase = createClient();
    const data = supabase.auth.onAuthStateChange((event, session) => {
      console.log(session);
      setSession(session);
    });
    return () => {
      data.data.subscription.unsubscribe();
    };
  }, []);

  const addPlayer = (player) => {
    if (
      selectedPlayers.length < 26 &&
      !selectedPlayers.some((p) => p.playerID === player.playerID)
    ) {
      setSelectedPlayers((prev) => [...prev, player]);
    }
  };

  const removePlayer = (playerId) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.playerID !== playerId));
  };

  const filteredPlayers = players.filter((player) =>
    player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const saveSquad = async () => {
    if (!squadName) {
      setError("Squad name must be provided");
      return;
    }

    if (selectedPlayers.length === 0) {
      setError("At least one player must be selected");
      return;
    }

    setError("");

    const playerIDs = selectedPlayers.map((player) => ({
      playerID: player.playerID,
    }));

    const newSquad = {
      squadName: squadName,
      playersIDS: playerIDs,
      email: session?.user?.email,
    };

    await createNewSquad(newSquad);

    router.push("/myteams");

    setSquadName("");
    setSelectedPlayers([]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Create a Squad</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label
          htmlFor="squadName"
          className="block text-sm font-medium text-black-300"
        >
          Name
        </label>

        <input
          type="text"
          id="squadName"
          className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none sm:text-sm"
          placeholder="Enter squad name"
          value={squadName}
          onChange={(e) => setSquadName(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="searchPlayer"
          className="block text-sm font-medium text-black-300"
        >
          Player
        </label>
        <input
          type="text"
          id="searchPlayer"
          className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none sm:text-sm"
          placeholder="Search players"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="overflow-auto max-h-60">
          {filteredPlayers.map((player) => (
            <li
              key={player.playerID}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => addPlayer(player)}
            >
              {player.nickname}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={saveSquad}
        type="button"
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
      >
        Save Changes
      </button>
      <div className="mt-4">
        <div className="text-sm font-medium text-black-300">
          You have selected {selectedPlayers.length} players out of a maximum of
          26
        </div>

        <ul className="mt-2">
          {selectedPlayers.map((player) => (
            <li
              key={player.playerID}
              className="flex items-center justify-between p-2 mb-1 bg-gray-300 rounded-md"
            >
              <div className="flex flex-col items-center">
                <img
                  src={player.image}
                  alt={player.nickname}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <div>
                  <div>{player.nickname}</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div>
                  <img
                    src={getTeamByTeamID(player.teamID)}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                  <div>{player.teamName}</div>
                </div>
              </div>
              <div className="flex items-center gap-7 ">
                <div>{player.position}</div>
                <button
                  onClick={() => removePlayer(player.playerID)}
                  className="px-2 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


//components/authButton.tsx
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hola, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}


//components/myTeam/Delete.tsx new
import { deleteSquad } from "@/actions/actions";
import { Trash2 } from "lucide-react";

const Delete = ({ id } : { id: string }) => {
  return (
    <form action={deleteSquad}>
      <input type="hidden" name="id" value={id} />
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2">
        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </form>
  );
};

export default Delete;


//components/myTeam/Edit.tsx new
import { deleteSquad } from "@/actions/actions";
import { Trash2 } from "lucide-react";

const Delete = ({ id } : { id: string }) => {
  return (
    <form action={deleteSquad}>
      <input type="hidden" name="id" value={id} />
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2">
        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </form>
  );
};

export default Delete;


//components/myTeam/SquadForm.tsx
"use client";

import React, { useState } from 'react';
import { createSquad } from '@/actions/actions';
import { useRouter } from 'next/navigation';

const SquadForm = ({ allPlayers, allTeams, userEmail }) => {
  const [filteredPlayers, setFilteredPlayers] = useState(allPlayers);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [squadName, setSquadName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const getTeamByTeamID = (teamID) => {
    const team = allTeams.find((team) => team.teamID === teamID);
    return team ? team.image : '';
  };

  const addPlayer = (player) => {
    if (
      selectedPlayers.length < 26 &&
      !selectedPlayers.some((p) => p.playerID === player.playerID)
    ) {
      setSelectedPlayers((prev) => [...prev, player]);
    }
  };

  const removePlayer = (playerId) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.playerID !== playerId));
  };

  const saveSquad = async (event) => {
    event.preventDefault();

    if (!squadName) {
      setError("Squad name must be provided");
      return;
    }

    if (selectedPlayers.length === 0) {
      setError("At least one player must be selected");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append('squadName', squadName);
    formData.append('email', userEmail);
    selectedPlayers.forEach(player => {
      formData.append('playerIDs', player.playerID);
    });

    await createSquad(formData);
    router.push("/myteams");

    setSquadName("");
    setSelectedPlayers([]);
  };

  return (
    <form onSubmit={saveSquad}>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label
          htmlFor="squadName"
          className="block text-sm font-medium text-black-300"
        >
          Name
        </label>

        <input
          type="text"
          id="squadName"
          name="squadName"
          className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none sm:text-sm"
          placeholder="Enter squad name"
          value={squadName}
          onChange={(e) => setSquadName(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="searchPlayer"
          className="block text-sm font-medium text-black-300"
        >
          Player
        </label>
        <input
          type="text"
          id="searchPlayer"
          className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none sm:text-sm"
          placeholder="Search players"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            const filtered = allPlayers.filter((player) =>
              player.nickname.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredPlayers(filtered);
          }}
        />
        <ul className="overflow-auto max-h-60">
          {filteredPlayers.map((player) => (
            <li
              key={player.playerID}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => addPlayer(player)}
            >
              {player.nickname}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
      >
        Save Changes
      </button>
      <div className="mt-4">
        <div className="text-sm font-medium text-black-300">
          You have selected {selectedPlayers.length} players out of a maximum of 26
        </div>

        <ul className="mt-2">
          {selectedPlayers.map((player) => (
            <li
              key={player.playerID}
              className="flex items-center justify-between p-2 mb-1 bg-gray-300 rounded-md"
            >
              <div className="flex flex-col items-center">
                <img
                  src={player.image}
                  alt={player.nickname}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <div>
                  <div>{player.nickname}</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div>
                  <img
                    src={getTeamByTeamID(player.teamID)}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                  <div>{player.teamName}</div>
                </div>
              </div>
              <div className="flex items-center gap-7 ">
                <div>{player.position}</div>
                <button
                  onClick={() => removePlayer(player.playerID)}
                  className="px-2 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};

export default SquadForm;
