"use client";

import React, { useEffect, useState } from "react";
import { updateSquad } from "@/actions/myTeamsActions";
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
import { UserPlus, Trash2, UserSearch, Users } from "lucide-react";
import { formatter, getPositionBadge, slugById } from "@/utils/utils";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const EditSquadForm = ({
  allPlayers,
  allTeams,
  userEmail,
  squad,
}: {
  allPlayers: players[];
  allTeams: teams[];
  userEmail: string;
  squad: squads;
}) => {
  const [filteredPlayers, setFilteredPlayers] = useState(allPlayers.slice(0, 6));
  const squadID = squad.squadID;
  const [squadPlayers, setSquadPlayers] = useState<players[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [squadName, setSquadName] = useState(squad.squadName || "");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (squad.playersIDS) {
      const updatedSquadPlayers = squad.playersIDS
        .map(({ playerID }) => allPlayers.find((player) => player.playerID === playerID))
        .filter((player) => !!player) as players[]; // Filter out undefined values
      setSquadPlayers(updatedSquadPlayers);
    }
  }, [squad.playersIDS, allPlayers]);

  const getTeamByTeamID = (teamID: number) => {
    const team = allTeams.find((team) => team.teamID === teamID);
    return team ? team.image : "";
  };

  const addPlayer = (player: players) => {
    if (
      squadPlayers.length < 26 &&
      !squadPlayers.some((p) => p.playerID === player.playerID)
    ) {
      setSquadPlayers((prev) => [
        ...prev,
        player,
      ]);
    }
  };

  const removePlayer = (playerId: number) => {
    setSquadPlayers((prev) => prev.filter((p) => p.playerID !== playerId));
  };

  const saveSquad = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!squadName) {
      setError("Nombre del equipo es requerido");
      return;
    }

    if (squadPlayers.length === 0) {
      setError("Selecciona al menos un jugador");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("squadName", squadName);
    formData.append("email", userEmail);
    formData.append("squadID", squadID);
    squadPlayers.forEach((player) => {
      formData.append("playerIDs", String(player.playerID));
    });

    await updateSquad(formData);
    router.push("/myteams");
  };

  const handleSquadNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSquadName = e.target.value;
    if (newSquadName.length <= 20) {
      setSquadName(newSquadName);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <Card className="flex flex-col justify-start items-start w-full p-4 h-[486px]">
        <form
          className="flex flex-col justify-between w-full h-full gap-4"
          onSubmit={saveSquad}
        >
          <div className="flex flex-col gap-4 pt-2">
            <div className="relative w-full flex flex-row justify-center items-center">
              <label
                htmlFor="squadName"
                className="block text-base font-medium ml-1"
              ></label>
              <Input
                type="text"
                id="squadName"
                name="squadName"
                onChange={handleSquadNameChange}
                value={squadName}
                placeholder="Nombre de tu equipo..."
                className="pl-10 outline-none text-md backdrop-blur-sm bg-white"
              />
              <Users className="absolute h-4 w-4 top-[10px] left-4 text-muted-foreground" />
            </div>
            <div className="relative w-full flex flex-row justify-center items-center">
              <label
                htmlFor="searchPlayer"
                className="block text-base font-medium ml-1"
              ></label>
              <Input
                type="text"
                id="searchPlayer"
                name="searchPlayer"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  const filtered = allPlayers
                    .filter((player) =>
                      player.nickname
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    )
                    .slice(0, e.target.value ? undefined : 4);
                  setFilteredPlayers(filtered);
                }}
                value={searchTerm}
                placeholder="Buscar Jugadores"
                className="pl-10 outline-none text-md backdrop-blur-sm bg-white"
              />
              <UserSearch className="absolute h-4 w-4 top-[10px] left-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-col justify-start h-full w-full overflow-auto">
            {filteredPlayers.map((player) => (
              <div
                key={player.playerID}
                onClick={() => addPlayer(player)}
                className="flex flex-col justify-start items-center w-full cursor-pointer hover:bg-gray-100"
              >
                <div className="flex justify-between items-center space-x-2 w-full px-4 hover:bg-gray-100 cursor-pointer">
                  <div className="flex flex-row justify-start items-center gap-2">
                    <div
                      className={getPositionBadge(player.positionID).className}
                    >
                      {getPositionBadge(player.positionID).abbreviation}
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
                    <div className="flex flex-col text-sm font-semibold whitespace-nowrap shrink-0">
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
                </div>
                <Separator className="mt-0.5" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              variant={"blue"}
              className="flex justify-center items-center gap-2"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-center">Guardar Equipo</span>
            </Button>

            {error ? (
              <div className="text-sm font-medium text-center text-red-500">
                {error}
              </div>
            ) : (
              <div className="text-sm font-medium text-center text-neutral-500">
                {squadPlayers.length} jugadores de un total de 26
              </div>
            )}
          </div>
        </form>
      </Card>
      <Card className="flex flex-col justify-start items-start w-full p-4 h-[486px] overflow-visible">
        <h1 className="text-base font-medium text-center w-full">
          Jugadores Seleccionados ({squadPlayers.length})
        </h1>

        <Table className="">
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-14">Pos</TableHead>
              <TableHead className="pl-8">Jugador</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-0 m-0">
            {squadPlayers.map((player) => (
              <TableRow key={player.playerID} className="">
                <TableCell className="">
                  <div
                    className={getPositionBadge(player.positionID).className}
                  >
                    {getPositionBadge(player.positionID).abbreviation}
                  </div>
                </TableCell>
                <TableCell className="p-0 m-0 truncate min-w-[200px]">
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
                    <div className="flex flex-col text-sm  font-semibold whitespace-nowrap shrink-0">
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
                <TableCell className="flex justify-center items-center">
                  <Button
                    onClick={() => removePlayer(player.playerID)}
                    variant={"red"}
                    size={"icon"}
                    className=""
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default EditSquadForm;
