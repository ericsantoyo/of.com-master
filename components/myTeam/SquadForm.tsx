"use client";

import React, { useState } from "react";
import { createSquad } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Trash2 } from "lucide-react";
import {
  formatMoney,
  formatter,
  getNextGames,
  getPositionBadge,
  lastChangeStyle,
  slugById,
} from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

const SquadForm = ({
  allPlayers,
  allTeams,
  userEmail,
}: {
  allPlayers: players[];
  allTeams: teams[];
  userEmail: string;
}) => {
  const [filteredPlayers, setFilteredPlayers] = useState(allPlayers);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [squadName, setSquadName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const getTeamByTeamID = (teamID: number) => {
    const team = allTeams.find((team) => team.teamID === teamID);
    return team ? team.image : "";
  };

  const addPlayer = (player: players) => {
    if (
      selectedPlayers.length < 26 &&
      !selectedPlayers.some((p: players) => p.playerID === player.playerID)
    ) {
      // Convert playerID to number before adding
      setSelectedPlayers((prev) => [
        ...prev,
        { ...player, playerID: Number(player.playerID) },
      ]);
    }
  };

  const removePlayer = (playerId) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.playerID !== playerId));
  };

  const saveSquad = async (event: { preventDefault: () => void }) => {
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
    formData.append("squadName", squadName);
    formData.append("email", userEmail);
    selectedPlayers.forEach((player) => {
      formData.append("playerIDs", String(player.playerID)); // Ensure playerID is number
    });

    await createSquad(formData);
    router.push("/myteams");

    setSquadName("");
    setSelectedPlayers([]);
  };

  const handleSquadNameChange = (e) => {
    const newSquadName = e.target.value;
    if (newSquadName.length <= 20) {
      setSquadName(newSquadName);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <Card className="flex flex-col justify-start items-start w-full p-4 ">
        <form className="flex flex-col w-full gap-4" onSubmit={saveSquad}>
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <label
              htmlFor="squadName"
              className="block text-sm font-medium text-black-300"
            >
              Nombre del equipo
            </label>

            <input
              type="text"
              id="squadName"
              name="squadName"
              className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none text-sm"
              placeholder="Entra un nombre para tu equipo"
              value={squadName}
              onChange={handleSquadNameChange}
            />
          </div>
          <div>
            <label
              htmlFor="searchPlayer"
              className="block text-sm font-medium text-black-300"
            >
              Jugadores
            </label>
            <input
              type="text"
              id="searchPlayer"
              className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none text-sm"
              placeholder="Buscar Jugadores"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                const filtered = allPlayers.filter((player) =>
                  player.nickname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
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
            className="flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-center">Guardar Equipo</span>
          </button>

          <div className="text-sm font-medium text-black-300">
            Haz seleccionado {selectedPlayers.length} jugadores de un total of
            26
          </div>
        </form>
      </Card>
      <Card className="flex flex-col justify-start items-start w-full  ">
        <Table className="">
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-14">Pos</TableHead>
              <TableHead className="  ">Jugador</TableHead>

              <TableHead className=" text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-0 m-0">
            {selectedPlayers.map((player: players) => {
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
                    <div className="flex flex-row justify-start items-center gap-2">
                      <div className="flex justify-center items-center flex-shrink-0 w-6 h-6">
                        <Image
                          src={`/teamLogos/${slugById(player.teamID)}.png`}
                          alt={player.teamName}
                          width={48}
                          height={48}
                          className="w-auto h-6"
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
                      <div className="flex flex-col text-xs md:text-sm  font-semibold whitespace-nowrap shrink-0">
                        <p className="font-semibold whitespace-nowrap">
                          {player.nickname.includes(" ") &&
                          player.nickname.length > 13
                            ? `${player.nickname.split(" ")[0].charAt(0)}. ${
                                player.nickname.split(" ")[1]
                              }${
                                player.nickname.split(" ").length > 2
                                  ? ` ${player.nickname.split(" ")[2]}`
                                  : ""
                              }`
                            : player.nickname}
                        </p>
                        <div className={`text-[11px] font-light text-start`}>
                          {formatter.format(player.marketValue)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className={"flex justify-center items-center"}>
                    <button
                      onClick={() => removePlayer(player.playerID)}
                      className="py-1 px-1.5 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-5 " />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* <ul className="mt-2">
          {selectedPlayers.map((player) => (
            <li
              key={player.playerID}
              className="flex items-center justify-between p-2 mb-1 bg-gray-300 rounded-md"
            >
              <div className="flex flex-col items-center">
                <img
                  src={player.image}
                  alt={player.nickname}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "10px",
                  }}
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
        </ul> */}
    </div>
  );
};

export default SquadForm;
