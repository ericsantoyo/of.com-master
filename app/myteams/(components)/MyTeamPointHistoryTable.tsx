import { Card } from "@/components/ui/card";

import { ChevronsDown, ChevronsUp } from "lucide-react";
import Link from "next/link";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

import {
  formatMoney,
  formatter,
  getColor,
  getPositionBadge,
  slugById,
} from "@/utils/utils";
import Image from "next/image";

interface MyTeamPointHistoryTableProps {
  players: players[];
  matches: matches[];
}
function calculateUniqueWeeks(players: players[]): number[] {
  const allWeeks = players.flatMap((player) =>
    player.stats.map((stat) => stat.week)
  );
  const weeksSet = new Set(allWeeks);
  return Array.from(weeksSet).sort((a, b) => b - a);
}

const MyTeamPointHistoryTable: React.FC<MyTeamPointHistoryTableProps> = ({
  players,
  matches,
}) => {
  // Determine unique weeks for the selected team
  const uniqueWeeks = calculateUniqueWeeks(players);

  const selectedTeamPlayers = players;
  return (
    <>
      <Card className="flex flex-col justify-start items-start  w-full  ">
        <Table className="">
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px]">ID</TableHead> */}
              <TableHead className="w-text-center w-14">Pos</TableHead>
              {/* <TableHead className="w-text-center w-14">Pos</TableHead> */}
              <TableHead className=" text-center ">Jugador</TableHead>
              <TableHead className=" text-center ">
                <div className="flex flex-row justify-center items-center w-full divide-x-[1px] ">
                  {uniqueWeeks.map((week) => (
                    <div key={week} className="items-center ">
                      <div className="flex flex-col justify-center items-center ">
                        <div
                          className={`text-center  w-7 h-7  flex justify-center items-center }`}
                        >
                          <p className="text-xs items-center align-middle">
                            J{week}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TableHead>
              <TableHead className=" text-center ">Puntos</TableHead>
              <TableHead className=" text-center p-0 m-0 md:hidden min-w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-0 m-0">
            {selectedTeamPlayers.map((player, index) => {
              return (
                <TableRow key={player.playerID} className="">
                  {/* <TableCell className="">
                    {player.playerID}
                  </TableCell> */}

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

                  <TableCell className="text-center ">
                    <div className="flex flex-row justify-center items-center w-full divide-x-[1px]">
                      {uniqueWeeks.map((week) => {
                        const stat = player.stats.find((s) => s.week === week);
                        const match = matches.find(
                          (m) =>
                            m.week === week &&
                            (m.localTeamID === player.teamID ||
                              m.visitorTeamID === player.teamID)
                        );
                        const opponentTeamID =
                          match?.localTeamID === player.teamID
                            ? match.visitorTeamID
                            : match?.localTeamID;

                        return (
                          <div
                            key={week}
                            className="flex flex-col justify-center items-center "
                          >
                            {stat &&
                            (player.positionID === 5 ||
                              (stat.mins_played &&
                                !(
                                  stat.mins_played[0] === 0 &&
                                  stat.mins_played[1] === 0
                                ))) ? (
                              <div className="flex flex-row justify-center items-center w-full ">
                                <div className="flex flex-col justify-center items-center gap-1 ">
                                  <div
                                    className={`text-center w-7 h-7 flex justify-center items-center  ${
                                      stat.isInIdealFormation
                                        ? "border-yellow-500  border-[3px]"
                                        : ""
                                    } ${getColor(stat.totalPoints)}`}
                                  >
                                    <p className="text-[14px] items-center align-middle">
                                      {stat.totalPoints}
                                    </p>
                                  </div>
                                  {opponentTeamID && (
                                    <Image
                                      src={`/teamLogos/${slugById(
                                        opponentTeamID
                                      )}.png`}
                                      alt="opponent"
                                      width={20}
                                      height={20}
                                      style={{ objectFit: "contain" }}
                                      className="h-4"
                                    />
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-col justify-center items-center gap-1">
                                  <div
                                    className={`text-center  w-7 h-7 flex justify-center items-center  ${getColor(
                                      0
                                    )}`}
                                  >
                                    <p className="text-[14px] items-center align-middle">
                                      -
                                    </p>
                                  </div>
                                  {opponentTeamID && (
                                    <Image
                                      src={`/teamLogos/${slugById(
                                        opponentTeamID
                                      )}.png`}
                                      alt="opponent"
                                      width={20}
                                      height={20}
                                      style={{ objectFit: "contain" }}
                                      className="h-4"
                                    />
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-center bg-neutral-100 border-x-2 m-0 px-1">
                    <div className="flex flex-row justify-center items-center">
                      <p className="font-bold text-base ">{player.points}</p>
                      {/* <p className="text-xs">pts</p> */}
                      <div className="mx-2 h-6 border-l border-neutral-300"></div>
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold leading-none">
                          {player.averagePoints.toFixed(2)}
                        </p>
                        <p className="text-[11px] leading-none ">Media</p>
                      </div>
                    </div>
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
    </>
  );
};

export default MyTeamPointHistoryTable;
