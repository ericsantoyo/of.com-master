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
