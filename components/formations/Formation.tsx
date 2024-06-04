"use client";
import React, { useEffect, useState } from "react";
import { getPositionsForFormation } from "@/utils/formations";
import {
  getAllPlayers,
  getSquadById,
  updateSquad,
} from "@/utils/supabase/functions";

const Formation = ({
  formationName,
  squadID,
  onPlayerAdd,
  squadPlayers,
  selectedPlayer,
  setSelectedPlayer,
}) => {
  const positions = getPositionsForFormation(formationName);
  const [lineup, setLineup] = useState({});
  const [players, setPlayers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingClear, setLoadingClear] = useState(false);
  const [filteredLineup, setFilteredLineup] = useState({});

  const positionTranslations = {
    Portero: "Goalkeeper",
    "Lateral izquierdo": "Left back",
    "Lateral derecho": "Right back",
    Central: "Center back",
    Defensa: "Defender",
    Centrocampista: "Midfielder",
    Delantero: "Forward",
    "Delantero centro": "Striker",
    Extremo: "Winger",
  };

  const translatePosition = (spanishPosition) => {
    return positionTranslations[spanishPosition] || spanishPosition;
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      const { allPlayers } = await getAllPlayers();
      setPlayers(allPlayers);
    };
    const fetchLineup = async () => {
      const { lineup, error } = await getSquadById(squadID);
      if (lineup) {
        setLineup(lineup);
        setFilteredLineup(lineup);
      }
    };
    fetchLineup();
    fetchPlayers();
  }, [squadID]);

  useEffect(() => {
    console.log("formation changed", positions);
    let modifiedLineup = { ...lineup };
    for (let i = 0; i < positions.length; i++) {
      if (modifiedLineup[i]) {
        const playerPositionRole = translatePosition(
          modifiedLineup[i].position
        );
        const selectedPositionRole = translatePosition(positions[i]?.role);
        console.log(playerPositionRole, selectedPositionRole);
        if (playerPositionRole !== selectedPositionRole) {
          delete modifiedLineup[i];
        }
      }
    }
    setFilteredLineup(modifiedLineup);
  }, [formationName]);

  const getPlayerById = (id) => {
    return (
      players.find((player) => player.playerID === id) || {
        name: "",
        image: "",
        position: "",
      }
    );
  };

  const handlePlayerClick = (positionId) => {
    setSelectedPosition(positionId);
    setSelectedPlayer(squadPlayers[positionId]?.playerID);
  };

  const handlePlayerSelection = (playerId) => {
    const playerToAdd = getPlayerById(playerId);
    const selectedPositionRole = translatePosition(
      positions[selectedPosition]?.role
    );

    if (
      playerToAdd &&
      selectedPosition !== null &&
      positions[selectedPosition]
    ) {
      const playerPositionRole = translatePosition(playerToAdd.position);

      if (playerPositionRole === selectedPositionRole) {
        const updatedLineup = {
          ...lineup,
          [selectedPosition]: playerToAdd,
        };
        const playerToRemovePosition = Object.keys(lineup).find(
          (key) => lineup[key].position === selectedPositionRole
        );
        if (playerToRemovePosition) {
          delete updatedLineup[playerToRemovePosition];
        }
        setLineup(updatedLineup);
        setFilteredLineup(updatedLineup);
        onPlayerAdd(updatedLineup);
        setSelectedPlayer(null);
        setSelectedPosition(null);
      } else {
        alert(
          `Player's position does not match the role required for this position: ${selectedPositionRole}`
        );
      }
    }
  };

  const saveChanges = async (lineup) => {
    setLoadingSave(true);
    await updateSquad(squadID, { lineup });
    alert("Lineup updated successfully!");
    setLoadingSave(false);
  };

  const clearLineup = async () => {
    setLoadingClear(true);
    setLineup({});
    setFilteredLineup({});
    await updateSquad(squadID, { lineup: {} });
    alert("Lineup cleared successfully!");
    setLoadingClear(false);
  };

  return (
    <div>
      <div>
        <h1>{filteredLineup.squadName}</h1>
      </div>
      <div className="flex gap-8 px-10 mb-5">
        <button
          onClick={() => saveChanges(filteredLineup)}
          className={`px-4 py-2 rounded-md ${
            loadingSave ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          disabled={loadingSave}
        >
          {loadingSave ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => clearLineup()}
          className={`px-4 py-2 rounded-md ${
            loadingClear ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
          } text-white`}
          disabled={loadingClear}
        >
          {loadingClear ? "Deleting..." : "Delete Lineup"}
        </button>
      </div>
      <div className="relative flex items-center">
        <div
          className="relative football-field-container"
          style={{ width: "400px", height: "600px" }}
        >
          <img
            src="/FieldLineup.png"
            alt="Football Field"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="top-0 left-0 z-10 w-full h-full position-absolute">
            {positions.map((position, index) => (
              <div
                key={index}
                className="absolute position-marker"
                style={{ left: `${position?.x}%`, top: `${position?.y}%` }}
                onClick={() => handlePlayerClick(index)}
              >
                {filteredLineup[index] ? (
                  <div className="relative transform right-2 bottom-2">
                    <img
                      src={filteredLineup[index]?.image}
                      alt="Selected Player"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="absolute text-sm text-white transform -translate-x-1/2 top-full left-1/2">
                      {
                        getPlayerById(
                          filteredLineup[index].playerID
                        )?.name.split(" ")[0]
                      }
                    </span>
                  </div>
                ) : (
                  <>
                    <span
                      role="img"
                      aria-label="Position Marker"
                      className="text-purple-500"
                    >
                      🟣
                    </span>
                    <button
                      onClick={() => setSelectedPlayer(index)}
                      className="absolute text-white transform -translate-x-1/2 -translate-y-1/2 bg-transparent top-1/2 left-1/2"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedPlayer !== null && (
          <div className="absolute top-0 right-0 ml-12 overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {squadPlayers.map((player) => (
                <li
                  key={player.playerID}
                  className="flex items-center py-4 space-x-4"
                >
                  <img
                    src={getPlayerById(player.playerID)?.image}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {getPlayerById(player.playerID)?.name.split(" ")[0]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getPlayerById(player.playerID)?.teamName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {translatePosition(
                        getPlayerById(player.playerID)?.position
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePlayerSelection(player.playerID)}
                    className="px-2 py-1 text-white bg-blue-500 rounded-md"
                  >
                    Select
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Formation;
