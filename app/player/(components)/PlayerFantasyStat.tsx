"use client";
import { getColor, slugById, getCurrentWeek } from "@/utils/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

interface PlayerFantasyStatProps {
  matchesData: matches[];
  playerData: players;
  playerStat: stats[];
}

export default function PlayerFantasyStat({
  matchesData,
  playerData,
  playerStat,
}: PlayerFantasyStatProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const weekContainerRef = useRef<HTMLDivElement | null>(null);

  const finishedMatches = matchesData
    .filter((match) => match.matchState === 7)
    .sort(
      (a, b) =>
        (a.matchDate ? new Date(a.matchDate).getTime() : 0) -
        (b.matchDate ? new Date(b.matchDate).getTime() : 0)
    );

  // Set the default week and scroll to it
  useEffect(() => {
    const maxWeek = Math.max(...finishedMatches.map((match) => match.week));
    setSelectedWeek(maxWeek);
  }, [playerStat]);

  // Scroll to the selected week button
  useEffect(() => {
    if (weekContainerRef.current && selectedWeek !== null) {
      const selectedButton = (
        weekContainerRef.current as HTMLElement
      ).querySelector(`button[data-week='${selectedWeek}']`);
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: "smooth",
          inline: "end",
          block: "nearest",
        });
      }
    }
  }, [selectedWeek]);

  const isStatHighlighted = (statValue: number | number[]): boolean => {
    if (Array.isArray(statValue)) {
      return statValue.some((value) => value > 0);
    } else {
      return statValue > 0;
    }
  };

  const scrollAmount = 100;

  // Function to scroll right
  const scrollRight = () => {
    if (weekContainerRef.current) {
      weekContainerRef.current.scrollLeft += scrollAmount;
    }
  };

  // Function to scroll left
  const scrollLeft = () => {
    if (weekContainerRef.current) {
      weekContainerRef.current.scrollLeft -= scrollAmount;
    }
  };

  const sumArray = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col justify-center items-center ">
      {/* <pre>{JSON.stringify(playerStat, null, 2)}</pre> */}

      <div className="flex justify-center items-center w-full md:max-w-xl">
        <button onClick={scrollLeft} className="">
          <ArrowLeftIcon fontSize="large" />
        </button>
        <div
          className="flex overflow-x-auto whitespace-nowrap py-1 mx-auto gap-3"
          ref={weekContainerRef}
        >
          {finishedMatches.map((match, index) => {
            const stats = playerStat.find((stat) => stat.week === match.week);
            const isMatchFinished = match.matchState === 7;
            const opponentTeamID =
              match.localTeamID === playerData.teamID
                ? match.visitorTeamID
                : match.localTeamID;

            // Determine display value for total points
            let totalPointsDisplay;
            if (
              isMatchFinished &&
              (!stats || sumArray(stats?.mins_played || [0]) === 0)
            ) {
              totalPointsDisplay = "-";
            } else {
              totalPointsDisplay = stats?.totalPoints ?? "-";
            }

            return (
              <button
                key={index}
                data-week={match.week}
                onClick={() => setSelectedWeek(match.week)}
                className={`p-1 ${
                  selectedWeek === match.week
                    ? "bg-neutral-300 text-neutral-900 font-bold border border-neutral-500 rounded-md"
                    : ""
                }`}
              >
                <div className="flex flex-col justify-center items-center">
                  <div className="text-center">J{match.week}</div>
                  <div
                    className={`text-center border-[0.5px] w-6 h-6 border-neutral-700 rounded-xs flex justify-center items-center ${getColor(
                      totalPointsDisplay === "-" ? 0 : stats?.totalPoints || 0
                    )}`}
                  >
                    <p className={`text-md items-center align-middle`}>
                      {/* Display total points or "-" */}
                      {isMatchFinished ? totalPointsDisplay : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center mt-1">
                  <Image
                    src={`/teamLogos/${slugById(opponentTeamID)}.png`}
                    alt="opponent"
                    width={20}
                    height={20}
                    style={{ objectFit: "contain" }}
                    className="h-5 mb-1"
                  />
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={scrollRight} className="">
          <ArrowRightIcon fontSize="large" />
        </button>
      </div>
      {selectedWeek && (
        <div className="flex flex-col max-w-xl text-center w-full px-2 mx-auto">
          <h2 className="text-lg font-bold my-2">Jornada {selectedWeek}</h2>
          <div className="border">
            {playerStat
              .filter((stats) => stats.week === selectedWeek)
              .map((stats) => (
                <div key={`stats-${stats.week}`}>
                  {" "}
                  {[
                    ["mins_played", "Minutos jugados"],
                    ["goals", "Goles"],
                    ["goal_assist", "Asistencias de gol"],
                    ["offtarget_att_assist", "Asistencias sin gol"],
                    ["pen_area_entries", "Balones al área"],
                    ["penalty_won", "Penaltis provocados"],
                    ["penalty_save", "Penaltis parados"],
                    ["saves", "Paradas"],
                    ["effective_clearance", "Despejes"],
                    ["penalty_failed", "Penaltis fallados"],
                    ["own_goals", "Goles en propia puerta"],
                    ["goals_conceded", "Goles en contra"],
                    ["yellow_card", "Tarjetas amarillas"],
                    ["second_yellow_card", "Segundas amarillas"],
                    ["red_card", "Red Cards"],
                    ["total_scoring_att", "Tiros a puerta"],
                    ["won_contest", "Regates"],
                    ["ball_recovery", "Balones recuperados"],
                    ["poss_lost_all", "Posesiones perdidas"],
                    ["penalty_conceded", "Penaltis cometidos"],
                  ].map(([statKey, label]) => {
                    const value = stats[statKey as keyof typeof stats] as
                      | number
                      | number[];
                    const isHighlighted = isStatHighlighted(value);
                    const uniqueKey = `week-${stats.week}-stat-${statKey}`;

                    return (
                      <div
                        key={uniqueKey}
                        className={`flex justify-between items-center border-b-2 px-2 py-1 max-w-xl mx-auto ${
                          isHighlighted ? "bg-gray-100" : ""
                        }`}
                      >
                        <p className="font-bold">
                          {Array.isArray(value) ? value[0] : value}
                        </p>
                        <h3>{label}</h3>
                        <p
                          className={`font-bold ${
                            Array.isArray(value)
                              ? value[1] > 0
                                ? "text-green-600"
                                : value[1] < 0
                                ? "text-red-600"
                                : ""
                              : ""
                          }`}
                        >
                          {Array.isArray(value) ? value[1] : ""}
                        </p>
                      </div>
                    );
                  })}
                  {/* Render marca_points and totalPoints separately */}
                  <div
                    key={`week-${stats.week}-marca_points`}
                    className={`flex justify-between items-center border-b-2 px-2 py-1 max-w-xl mx-auto ${
                      stats.marca_points &&
                      (stats.marca_points as number[])[1] > 0
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <p></p>
                    <h3>Puntos Relevo</h3>
                    <p
                      className={`font-bold ${
                        stats.marca_points &&
                        (stats.marca_points as number[])[1] > 0
                          ? "text-green-600"
                          : stats.marca_points &&
                            (stats.marca_points as number[])[1] < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {stats.marca_points
                        ? (stats.marca_points as number[])[1]
                        : ""}
                    </p>
                  </div>
                  <div
                    key={`week-${stats.week}-totalPoints`}
                    className={`flex justify-between items-center border-b-2 px-2 py-1 max-w-xl mx-auto ${
                      stats.totalPoints > 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    <p></p>
                    <h3>Points</h3>
                    <p
                      className={`font-bold ${
                        stats.totalPoints > 0
                          ? "text-green-600"
                          : stats.totalPoints < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {stats.totalPoints}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
