import { Card } from "@/components/ui/card";
import { slugById } from "@/utils/utils";
import Image from "next/image";
import React from "react";

interface Match {
  id: number;
  date: string;
  status: "finished" | "upcoming";
  // Add other properties as needed
}

export default function MatchList({
  matchesData,

  fetchedPlayer,
}: {
  matchesData: matches[];

  fetchedPlayer: players;
}) {
  const playerTeam = fetchedPlayer.teamID;
  const finishedMatches = matchesData
    .filter((match) => match.matchState === 7)
    .sort(
      (a, b) =>
        new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
    );

  const upcomingMatches = matchesData.filter((match) => match.matchState !== 7);

  // Function to determine the background color based on match outcome
  const getBackgroundColor = (match, teamID) => {
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
    <div className="flex flex-row justify-center items-start gap-4 w-full">
      <div className="w-full">
        <h2 className="text-center text-sm pb-2">Finalizados</h2>
        <div className="flex flex-col justify-start items-center gap-1 w-full">
          {finishedMatches.map((match) => (
            <div key={match.matchID}>
              <Card
                className={`flex flex-col justify-between items-center min-w-[130px] p-3 h-12 py-2.5 text-center rounded-sm shadow-none ${getBackgroundColor(
                  match,
                  playerTeam
                )}`}
              >
                <div className="flex flex-row justify-between items-center text-center h-full w-full ">
                  <Image
                    src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                    alt="home"
                    width={20}
                    height={20}
                    style={{ objectFit: "contain" }}
                    className="h-5 "
                  />

                  <div className="flex justify-center items-center">
                    <p className="font-semibold text-xs">{match.localScore}</p>
                    <p className="mx-1 text-xs">-</p>
                    <p className="font-semibold text-xs">
                      {match.visitorScore}
                    </p>
                  </div>

                  <Image
                    src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                    alt="visitor"
                    width={20}
                    height={20}
                    style={{ objectFit: "contain" }}
                    className="h-5 "
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center items-start gap-4 w-full ">
        <div className="w-full">
          <h2 className="text-center text-sm pb-2">Proximos</h2>
          <div className="flex flex-col justify-start items-center gap-1 w-full">
            {upcomingMatches.map((match) => (
              <div key={match.matchID}>
                <Card className="flex flex-col justify-between items-center min-w-[130px]	h-12 p-3 py-2.5 text-center rounded-sm shadow-none">
                  <div className="flex flex-row justify-between items-center text-center h-full w-full ">
                    <Image
                      src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                      alt="home"
                      width={20}
                      height={20}
                      style={{ objectFit: "contain" }}
                      className="h-5 "
                    />

                    <div className="flex flex-col justify-center items-center">
                      <span className="font-bold text-[10px] uppercase text-center">
                        {new Date(match.matchDate).toLocaleDateString("es-EU", {
                          weekday: "short",
                        })}
                      </span>{" "}
                      <span className="text-[10px] uppercase font-medium text-center">
                        {new Date(match.matchDate).toLocaleDateString("es-EU", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <Image
                      src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                      alt="visitor"
                      width={20}
                      height={20}
                      style={{ objectFit: "contain" }}
                      className="h-5 "
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
