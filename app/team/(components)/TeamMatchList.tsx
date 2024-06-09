import { Card } from "@/components/ui/card";
import { slugById } from "@/utils/utils";
import Image from "next/image";
import React from "react";

export default function TeamMatchList({
  matchesData,

  teamselected,
}: {
  matchesData: matches[];

  teamselected: number;
}) {
  const playerTeam = teamselected;
  const finishedMatches = matchesData
    .filter((match) => match.matchState === 7)
    .sort(
      (a, b) =>
        (b.matchDate ? new Date(b.matchDate).getTime() : 0) -
        (a.matchDate ? new Date(a.matchDate).getTime() : 0)
    );

  const upcomingMatches = matchesData.filter((match) => match.matchState !== 7);

  // Function to determine the background color based on match outcome
  const getBackgroundColor = (
    match: {
      localScore: any;
      localTeamID: any;
      matchDate?: string | null;
      matchID?: number;
      matchState?: number;
      visitorScore: any;
      visitorTeamID: any;
      week?: number;
    },
    teamID: number
  ) => {
    const isLocalTeam = match.localTeamID === teamID;
    const isVisitorTeam = match.visitorTeamID === teamID;

    if (
      (isLocalTeam && match.localScore > match.visitorScore) ||
      (isVisitorTeam && match.visitorScore > match.localScore)
    ) {
      return "bg-green-200"; // Win
    } else if (
      (isLocalTeam && match.localScore < match.visitorScore) ||
      (isVisitorTeam && match.visitorScore < match.localScore)
    ) {
      return "bg-red-200"; // Loss
    } else {
      return "bg-yellow-200"; // Tie
    }
  };

  return (
    <div className="flex flex-row justify-center items-start gap-2 w-full">
      <div className="flex flex-col justify-start items-center gap-2 w-full">
        <h2 className="text-center text-sm font-medium ">Finalizados</h2>
        <div className="flex flex-col justify-start items-center gap-2 w-full  ">
          {finishedMatches.map((match) => (
            <div
              className="flex justify-center items-center w-full"
              key={match.matchID}
            >
              <Card
                className={`flex flex-col justify-between items-center w-full md:max-w-[196px] px-2 py-1 text-center shadow-none ${getBackgroundColor(
                  match,
                  teamselected
                )}`}
              >
                <div className="flex flex-row justify-between items-center w-full  text-center   ">
                  <Image
                    src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                    alt="home"
                    width={24}
                    height={24}
                    style={{ objectFit: "contain" }}
                    className="h-6 "
                  />

                  <div className="flex justify-between items-center mx-2 ">
                    <p className="font-bold text-base">{match.localScore}</p>
                    <div className="flex flex-col justify-center whitespace-nowrap px-2 w-[56px]">
                      <span className="font-bold text-[10px] uppercase text-center">
                        {match.matchDate &&
                          new Date(match.matchDate).toLocaleDateString(
                            "es-EU",
                            {
                              weekday: "short",
                            }
                          )}
                      </span>
                      <span className="text-[10px] uppercase font-medium text-center">
                        {match.matchDate &&
                          new Date(match.matchDate).toLocaleDateString(
                            "es-EU",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                      </span>
                    </div>
                    <p className="font-bold text-base">{match.visitorScore}</p>
                  </div>

                  <Image
                    src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                    alt="visitor"
                    width={24}
                    height={24}
                    style={{ objectFit: "contain" }}
                    className="h-6 "
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-start items-center gap-2 w-full">
        <h2 className="text-center text-sm font-medium">Proximos</h2>
        <div className="flex flex-col justify-start items-center gap-2 w-full ">
          {upcomingMatches.map((match) => (
            <div
              className="flex justify-center items-center w-full"
              key={match.matchID}
            >
              <Card className="flex flex-col justify-between items-center w-full md:max-w-[196px] px-2 py-1 text-center  shadow-none">
                <div className="flex flex-row justify-between items-center w-full text-center   ">
                  <Image
                    src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                    alt="home"
                    width={24}
                    height={24}
                    style={{ objectFit: "contain" }}
                    className="h-6 "
                  />
                  <div className="flex flex-col justify-center items-center mx-2">
                    <div className="flex justify-center px-2">
                      <span className="font-bold text-[10px] uppercase text-center">
                        {match.matchDate &&
                          new Date(match.matchDate).toLocaleDateString(
                            "es-EU",
                            {
                              weekday: "short",
                            }
                          )}
                      </span>
                      <span className="text-[10px] uppercase font-medium text-center">
                        {match.matchDate &&
                          new Date(match.matchDate).toLocaleDateString(
                            "es-EU",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                      </span>
                    </div>
                    {match.matchDate && (
                      <span className="text-[11px] uppercase font-medium text-center">
                        {new Date(match.matchDate).toLocaleTimeString("es-GB", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    )}
                  </div>
                  <Image
                    src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                    alt="visitor"
                    width={24}
                    height={24}
                    style={{ objectFit: "contain" }}
                    className="h-6 "
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
