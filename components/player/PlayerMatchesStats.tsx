import Image from "next/image";
import { getColor, slugById } from "@/utils/utils";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import TimerOffOutlinedIcon from "@mui/icons-material/TimerOffOutlined";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import PhonelinkEraseRoundedIcon from "@mui/icons-material/PhonelinkEraseRounded";
import FontDownloadRoundedIcon from "@mui/icons-material/FontDownloadRounded";
import RectangleRoundedIcon from "@mui/icons-material/RectangleRounded";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PlayerMatchesStats({
  matchesData,
  playerData,
  playerStat,
}: {
  matchesData: matches[];
  playerData: players;
  playerStat: stats[];
}) {
  const renderPerformanceIcons = (matchWeek: number, matchState: number) => {
    const stat = playerStat.find((s) => s.week === matchWeek);

    if (
      matchState === 7 &&
      (!stat ||
        (Array.isArray(stat.mins_played) &&
          stat.mins_played.reduce((a: any, b: any) => a + b, 0) === 0))
    ) {
      return (
        <div className="flex justify-between items-center w-full">
          <TimerOffOutlinedIcon
            color="action"
            fontSize="inherit"
            className="ml-1"
          />
          <p className="text-sm italic flex-grow text-right text-gray-600">
            No participó
          </p>
        </div>
      );
    }

    const icons = [];
    if (stat) {
      if (playerData.positionID === 5) {
        // Coach-specific icons
        icons.push(
          <div
            key={`separator-coach1-${matchWeek}`}
            className="mx-1 h-5 border-l border-neutral-400"
          ></div>,

          <div
            key={`total-points-coach-${matchWeek}`}
            className={`text-center border-[0.5px] w-5 h-5 border-neutral-700 rounded-xs flex justify-center items-center ${getColor(
              stat.totalPoints
            )}`}
          >
            <p className={`text-[12px] items-center align-middle`}>
              {stat.totalPoints}
            </p>
          </div>
        );
      } else {
        // Player-specific icons
        if (Array.isArray(stat.mins_played) && stat.mins_played.length > 0) {
          icons.push(
            <div
              key={`mins-played-${matchWeek}`}
              className="flex items-center mr-auto text-sm"
            >
              <WatchLaterOutlinedIcon color="action" fontSize="inherit" />
              <span className="ml-1">
                <span className="font-semibold text-xs">
                  {String(stat.mins_played[0])}
                </span>
                '
              </span>
            </div>
          );
        }

        // Goals
        if (Array.isArray(stat.goals)) {
          const goalsCount = stat.goals[0] as number;
          for (let i = 0; i < goalsCount; i++) {
            icons.push(
              <SportsSoccerIcon
                className="text-neutral-100 bg-green-600 rounded-full"
                fontSize="small"
                key={`goal-${matchWeek}-${i}`}
              />
            );
          }
        }

        // Assists
        if (Array.isArray(stat.goal_assist)) {
          const goalAssistCount = stat.goal_assist[0] as number;
          for (let i = 0; i < goalAssistCount; i++) {
            icons.push(
              <FontDownloadRoundedIcon
                color="primary"
                fontSize="small"
                key={`assist-${matchWeek}-${i}`}
              />
            );
          }
        }

        // Yellow Cards
        if (Array.isArray(stat.yellow_card)) {
          const yellowCardCount = stat.yellow_card[0] as number;
          for (let i = 0; i < yellowCardCount; i++) {
            icons.push(
              <RectangleRoundedIcon
                className="text-yellow-400 -rotate-90"
                color="inherit"
                fontSize="small"
                key={`yellow-${matchWeek}-${i}`}
              />
            );
          }
        }

        // Red Cards
        if (Array.isArray(stat.red_card)) {
          const redCardCount = stat.red_card[0] as number;
          for (let i = 0; i < redCardCount; i++) {
            icons.push(
              <RectangleRoundedIcon
                className="text-red-600 -rotate-90"
                color="inherit"
                fontSize="small"
                key={`redcard-${matchWeek}-${i}`}
              />
            );
          }
        }

        // Penalty Saves (if applicable, e.g., for goalkeepers)
        if (Array.isArray(stat.penalty_save)) {
          const penaltySaveCount = stat.penalty_save[0] as number;
          for (let i = 0; i < penaltySaveCount; i++) {
            icons.push(
              <div
                key={`penalty-save-${matchWeek}-${i}`}
                className="flex justify-center items-center text-sm border px-1"
              >
                <span className="w-3">
                  <span className="font-semibold text-xs ">
                    {String(stat.penalty_save[0])}
                  </span>
                  <span className="text-[11px] text-neutral-500">-</span>
                </span>
                <PhonelinkEraseRoundedIcon
                  className="-rotate-90"
                  color="action"
                  fontSize="small"
                />
              </div>
            );
          }
        }

        // Saves (again, if applicable for goalkeepers)
        if (Array.isArray(stat.saves) && playerData.positionID === 1) {
          icons.push(
            <div
              key={`saves-${matchWeek}`}
              className="flex justify-center items-center text-sm border px-1"
            >
              <span className="mx-1 w-2">
                <span className="font-semibold text-xs ">
                  {String(stat.saves[0])}
                </span>
                <span className="text-[11px] text-neutral-500"></span>
              </span>
              <SportsHandballIcon color="action" fontSize="small" />
            </div>
          );
        }

        // Separator and total points for players
        icons.push(
          <div
            key={`separator2-${matchWeek}`}
            className="mx-2 h-5 border-l border-neutral-400"
          ></div>,
          <div
            key={`total-points-${matchWeek}`}
            className={`text-center border-[0.5px] w-5 h-5 border-neutral-700 rounded-xs flex justify-center items-center ${getColor(
              stat.totalPoints
            )}`}
          >
            <p className={`text-[12px] items-center align-middle`}>
              {stat.totalPoints}
            </p>
          </div>
        );
      }
    }

    return (
      <div className="flex justify-end items-center w-full gap-1">{icons}</div>
    );
  };

  return (
    <Card className="flex flex-col justify-start items-start p-2 w-full">
      <h3 className="font-bold text-xl mx-auto">Partidos</h3>
      {/* <pre>{JSON.stringify(playerStat, null, 2)}</pre> */}
      <ul className="list-none w-full flex flex-col justify-start items-start">
        {matchesData.map((match) => (
          <div className="w-full" key={match.matchID}>
            <li className="w-full flex flex-row justify-start items-center">
              <div className="flex flex-col">
                <p className="text-[10px] uppercase font-semibold text-center whitespace-nowrap	w-8">
                  J-{match.week}
                </p>
                <span className="text-[8px] uppercase font-medium text-center">
                  {match.matchDate
                    ? new Date(match.matchDate).toLocaleDateString("es-EU", {
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>

              <div className="flex flex-col justify-between items-center w-[80px] py-[6px] text-center rounded-md mx-1">
                <div className="flex flex-row justify-between items-center text-center w-full ">
                  <div className="w-5 flex justify-center items-center">
                    <Image
                      src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                      alt="home"
                      width={20}
                      height={20}
                      style={{ objectFit: "contain" }}
                      className="h-5 "
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-xs w-2">
                      {match.localScore}
                    </p>
                    <p className="mx-1 text-xs w-1">-</p>
                    <p className="font-semibold text-xs w-2">
                      {match.visitorScore}
                    </p>
                  </div>

                  <div className="w-5 flex justify-center items-center">
                    <Image
                      src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                      alt="visitor"
                      width={20}
                      height={20}
                      style={{ objectFit: "contain" }}
                      className="h-5 "
                    />
                  </div>
                </div>
              </div>
              <div className="mx-1 h-5 border-l border-neutral-400"></div>
              <div className="flex items-center justify-end flex-grow">
                {renderPerformanceIcons(match.week, match.matchState)}
              </div>
            </li>
            {match.week < matchesData.length && (
              <Separator className="w-full" />
            )}
          </div>
        ))}
      </ul>
    </Card>
  );
}
