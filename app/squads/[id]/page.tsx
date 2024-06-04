"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  getAllPlayers,
  getAllTeams,
  getSquadById,
  updateSquad,
} from "@/utils/supabase/functions";

const SquadPage = () => {
  const { id } = useParams();

  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [squadName, setSquadName] = useState("");
  const [error, setError] = useState("");
  const [squadPlayers, setSquadPlayers] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [teams, setTeams] = useState([]);
  const [lineup, setLineup] = useState([]);

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
      const { allTeams } = await getAllTeams();
      setTeams(allTeams);
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchSquadData = async () => {
      const squadData = await getSquadById(id);
      if (squadData) {
        setSquadName(squadData.squadName);
        setSquadPlayers(squadData.playersIDS || []);
        setLineup(squadData.lineup || []);
      }
    };
    if (id) {
      fetchSquadData();
    }
  }, [id, fetch]);
  console.log("lineup", lineup);

  function getPlayerById(id) {
    return players?.find((player) => player.playerID === id);
  }

  function getTeamByTeamID(teamID) {
    const team = teams.find((team) => team.teamID === teamID);
    return team ? team.image : "";
  }

  const addPlayer = (player) => {
    if (
      squadPlayers.length < 26 &&
      !squadPlayers.some((p) => p.playerID === player.playerID)
    ) {
      setSquadPlayers((prev) => [...prev, player]);
    }
  };

  const removePlayer = (playerID) => {
    setSquadPlayers((prev) => prev.filter((p) => p.playerID !== playerID));
    setLineup((prev) => {
      const updatedLineup = { ...prev };
      Object.keys(updatedLineup).forEach((position) => {
        if (updatedLineup[position]?.playerID === playerID) {
          console.log(
            `Removing player ${playerID} from lineup at position ${position}`
          );
          delete updatedLineup[position];
        }
      });
      console.log("Updated lineup after removal:", updatedLineup);
      return updatedLineup;
    });
  };

  const filteredPlayers = players.filter((player) =>
    player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const saveSquad = async () => {
    if (!squadName) {
      setError("Squad name must be provided");
      return;
    }

    if (squadPlayers.length === 0) {
      setError("At least one player must be selected");
      return;
    }

    setError("");

    const playerIDs = squadPlayers.map((player) => ({
      playerID: player.playerID,
    }));

    await updateSquad(id, {
      squadName,
      playersIDS: playerIDs,
      lineup: lineup,
    });
    setFetch((prev) => !prev);
    router.push("/myteams");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Edit Squad</h1>
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
        Update Changes
      </button>
      <div className="mt-4">
        <div className="text-sm font-medium text-black-300">
          You have selected {squadPlayers.length} players out of a maximum of 26
        </div>
        <ul className="mt-2">
          {squadPlayers.map((player) => (
            <li
              key={player.playerID}
              className="flex items-center justify-between p-2 mb-1 bg-gray-300 rounded-md"
            >
              <div className="flex flex-col items-center">
                <img
                  src={getPlayerById(player.playerID)?.image}
                  alt={player.image}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <div>
                  <div>{getPlayerById(player.playerID)?.name}</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={getTeamByTeamID(
                      getPlayerById(player.playerID)?.teamID
                    )}
                    style={{ width: "40px", height: "40px" }}
                  />
                  <div>{getPlayerById(player.playerID)?.teamName}</div>
                </div>
              </div>
              <div className="flex items-center gap-7 ">
                <div>{getPlayerById(player.playerID)?.position}</div>
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
};

export default SquadPage;
