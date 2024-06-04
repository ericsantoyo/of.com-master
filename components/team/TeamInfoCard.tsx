import { Card } from "@/components/ui/card";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import Link from "next/link";
import {
  getColor,
  formatDate,
  formatMoney,
  getWeeksTotalPointsFromStats,
  formatter,
  getTotalPointsOfTeam,
  getTotalMarketValueOfTeam,
  getNumberOfPlayersOfTeam,
  getNumberOfAvailablePlayersOfTeam,
  getTotalLastMarketChangeOfTeam,
} from "@/utils/utils";
import { getMatchesByTeamID } from "@/utils/supabase/functions";
import NextMatches from "./TeamNextMatches";
import TeamLastMatches from "./TeamLastMatches";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import TeamPreviousMatches from "./TeamPreviousMatches";

interface PlayerStats {
  statType: string;
  value: number;
}

export default async function TeamInfoCard({ teamInfo, playerInfo }) {
  const { teamMatches: matchesData } = await getMatchesByTeamID(
    teamInfo.teamID
  );

  const teamMatches = matchesData;

  const totalPoints = getTotalPointsOfTeam(playerInfo);
  const totalMarketValue = getTotalMarketValueOfTeam(playerInfo);
  const numberOfPlayers = getNumberOfPlayersOfTeam(playerInfo);
  const numberOfAvailablePlayers =
    getNumberOfAvailablePlayersOfTeam(playerInfo);

  const totalLastMarketChange = getTotalLastMarketChangeOfTeam(playerInfo);

  return (
    <>
      {/* <pre>{JSON.stringify(totalLastMarketChange, null, 2)}</pre> */}
      <Card className="relative flex flex-row justify-between items-center gap-4  md:px-6 px-4 py-2 text-xs md:text-sm  rounded  ">
        <Card className="z-40 hidden md:flex flex-col justify-between items-start gap-2 backdrop-blur-md bg-white/30 p-4 rounded">
          <div className="flex flex-row justify-center items-center">
            <p className=" font-normal mr-2">Puntos:</p>
            <p className=" font-bold">{totalPoints}</p>
          </div>
          <div className="flex flex-row justify-center items-center">
            <p className=" font-normal mr-2">Valor:</p>
            <p className=" font-bold">{formatter.format(totalMarketValue)}</p>
          </div>
          <div className="flex flex-row justify-center items-center">
            <p className=" font-normal mr-2">Cambio:</p>
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center">
                {totalLastMarketChange > 0 ? (
                  <ChevronsUp className="w-3 h-3 text-green-600" />
                ) : (
                  <ChevronsDown className="w-3 h-3 text-red-500" />
                )}
                <div
                  className={`font-bold tabular-nums tracking-tight 
                                          ${
                                            totalLastMarketChange < 0
                                              ? "text-red-500 dark:text-red-400"
                                              : "text-green-600 dark:text-green-400"
                                          }`}
                >
                  {formatMoney(totalLastMarketChange)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center">
            <p className=" font-normal mr-2	">Disponibles:</p>
            <p className=" font-bold">
              {numberOfAvailablePlayers} /{numberOfPlayers}
            </p>
          </div>
        </Card>

        <div className="  flex flex-col justify-betweem items-center flex-initial  md:flex-none  w-max	z-30  ">
          <Image
            src={teamInfo.image}
            alt={teamInfo.nickname}
            width={96}
            height={96}
            style={{
              objectFit: "contain",
              width: "auto",
            }}
            className="h-20 p-[6px]"
            priority
          />

          <div className="backdrop-blur-md bg-white/30 p-1 rounded mb-1">
            {/* <p>Team name</p> */}
            <p className="font-bold mx-auto	uppercase text-center  w-fit	">
              {teamInfo.name}
            </p>
          </div>
          <TeamLastMatches
            matches={teamMatches}
            selectedTeam={teamInfo.teamID}
            howMany={6}
          />
        </div>

        <div className="flex md:hidden">
          <NextMatches
            matches={teamMatches}
            selectedTeam={teamInfo.teamID}
            dateClass=""
            howMany={3}
            pClass=""
          />
        </div>
        <div className="hidden md:flex">
          <NextMatches
            matches={teamMatches}
            selectedTeam={teamInfo.teamID}
            dateClass=""
            howMany={4}
            pClass=""
          />
        </div>
        <div
          className="inset-0 bg-no-repeat bg-center absolute z-0 w-full h-full  bg-cover"
          style={{
            backgroundImage: `url(${teamInfo.stadium})`,
            opacity: 0.2,
          }}
        ></div>
      </Card>
    </>
  );
}
