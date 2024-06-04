import { Card } from "@/components/ui/card";
import {
  getColor,
  getCurrentWeek,
  getWeeksTotalPointsFromSinglePlayer,
  slugById,
} from "@/utils/utils";
import Image from "next/image";

export default function PlayerPreviousMatches({
  matchesData,
  playerWithStats,
  fetchedPlayer,

  howMany,
}: {
  matchesData: matches[];
  fetchedPlayer: players;
  howMany: number;
  playerWithStats: {
    playerData: players;
    stats: stats[];
  };
}) {
  const teamMatches = matchesData;
  const currentWeek = getCurrentWeek(teamMatches);

  return (
    <Card className="flex flex-row justify-between items-center h-full  md:gap-2 backdrop-blur-sm bg-white/30 px-1 py-1.5">
      {playerWithStats &&
        getWeeksTotalPointsFromSinglePlayer(playerWithStats, howMany).map(
          (point) => {
            const match = matchesData?.find(
              (match) => match.week === point.week
            );

            return (
              <Card
                className="flex flex-col w-7 md:w-8 justify-between items-center border-none shadow-none h-full text-xs text-center rounded gap-1 bg-transparent "
                key={point.week}
              >
                <div className="flex flex-col justify-center items-center gap-1">
                  {match && match.localTeamID !== fetchedPlayer.teamID && (
                    <Image
                      src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                      alt="opponent"
                      width={20}
                      height={20}
                      style={{ objectFit: "contain" }}
                      className="h-5 md:h-6"
                    />
                  )}

                  {match && match.visitorTeamID !== fetchedPlayer.teamID && (
                    <Image
                      src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                      alt="opponent"
                      width={20}
                      height={20}
                      style={{ objectFit: "contain" }}
                      className="h-5 md:h-6 "
                    />
                  )}

                  <div
                    className={`text-center border-[0.5px] w-5 h-5 border-neutral-700 rounded-xs flex justify-center items-center ${getColor(
                      point.points
                    )}`}
                  >
                    <p className={`text-[12px] items-center align-middle`}>
                      {point.points}
                    </p>
                  </div>
                  <div className="text-center text-[11px] md:order-first font-bold md:text-[12px]	">
                    J{point.week}
                  </div>
                </div>
              </Card>
            );
          }
        )}
    </Card>
  );
}
