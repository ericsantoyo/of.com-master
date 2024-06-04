"use client";

import { Card } from "@/components/ui/card";

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
