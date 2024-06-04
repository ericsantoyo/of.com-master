
import { getColor, getCurrentWeek, getWeeksTotalPointsFromSinglePlayer, slugById } from "@/utils/utils";
import Image from "next/image";



const LastMatches = ({
  matchesData,
  playerWithStats,
  fetchedPlayer
}: {
  matchesData: matches[];
  fetchedPlayer: players;
  playerWithStats: {
    playerData: players;
    stats: stats[];
  };
}) => {

  const teamMatches = matchesData;
  const currentWeek = getCurrentWeek(teamMatches);


  return (
    <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row justify-center items-center gap-2 md:gap-x-4 w-full">
                {playerWithStats &&
                  getWeeksTotalPointsFromSinglePlayer(playerWithStats, 3).map(
                    (point) => {
                      const match = matchesData?.find(
                        (match) => match.week === point.week
                      );

                      return (
                        <div
                          className="flex flex-col justify-center items-center "
                          key={point.week}
                        >
                          <div className="flex flex-col justify-center items-center gap-1">
                            {match &&
                              match.localTeamID !== fetchedPlayer.teamID && (
                                <Image
                                  src={`/teamLogos/${slugById(
                                    match.localTeamID
                                  )}.png`}
                                  alt="opponent"
                                  width={20}
                                  height={20}
                                  style={{ objectFit: "contain" }}
                                  className="h-5 mb-1"
                                />
                              )}

                            {match &&
                              match.visitorTeamID !== fetchedPlayer.teamID && (
                                <Image
                                  src={`/teamLogos/${slugById(
                                    match.visitorTeamID
                                  )}.png`}
                                  alt="opponent"
                                  width={20}
                                  height={20}
                                  style={{ objectFit: "contain" }}
                                  className="h-5 mb-1 "
                                />
                              )}

                            <div
                              className={`text-center border-[0.5px] w-5 h-5 border-neutral-700 rounded-xs flex justify-center items-center ${getColor(
                                point.points
                              )}`}
                            >
                              <p
                                className={`text-[12px] items-center align-middle`}
                              >
                                {point.points}
                              </p>
                            </div>
                            <div className="text-center text-[11px] md:order-first	">
                              J{point.week}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
  );
};

export default LastMatches;
