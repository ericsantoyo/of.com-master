"use client";
import { Card, CardFooter } from "@/components/ui/card";

import { formatDate, formatMoney } from "@/utils/utils";
import { ChevronsDown, ChevronsUp } from "lucide-react";

interface StatTotals {
  [key: string]: number;
}

interface StatAverages {
  [key: string]: number;
}

interface StatSummaries {
  [key: string]: {
    total: number;
    average: number;
  };
}

export default function PlayerStats({
  matchesData,
  playerStat,
  playerWithStats,
}: {
  matchesData: matches[];
  playerStat: stats[];
  playerWithStats: {
    playerData: players;
    stats: stats[];
  };
}) {
  const statTotals: StatTotals = {};
  const statAverages: StatAverages = {};
  const numberOfGames = playerStat.length;

  playerStat.forEach((stat) => {
    Object.keys(stat).forEach((key) => {
      // Ensure the stat value is a number before adding
      if (typeof stat[key] === "number") {
        statTotals[key] = (statTotals[key] || 0) + stat[key];
      }
      // If the value is an array, only take the first element (if it's a number)
      else if (Array.isArray(stat[key]) && typeof stat[key][0] === "number") {
        statTotals[key] = (statTotals[key] || 0) + stat[key][0];
      }
    });
  });

  // Calculate averages
  Object.keys(statTotals).forEach((key) => {
    statAverages[key] = statTotals[key] / numberOfGames;
  });

  // Set up stat summaries
  const statSummaries: StatSummaries = {};
  Object.keys(statTotals).forEach((key) => {
    statSummaries[key] = {
      total: statTotals[key],
      average: statAverages[key],
    };
  });

  const renderStat = (statKey: string, label: string) => {
    const stat = statSummaries[statKey];
    if (stat) {
      return (
        <div>
          <p>
            {label} Total: {stat.total}
          </p>
          <p>
            {label} Promedio: {stat.average.toFixed(2)}
          </p>
        </div>
      );
    }
    return <p>{label}: Data not available</p>;
  };

  let totalLocalPoints = 0;
  let totalVisitorPoints = 0;
  let localGames = 0;
  let visitorGames = 0;

  playerStat.forEach((stat) => {
    const match = matchesData.find((m) => m.week === stat.week);
    if (match) {
      if (match.localTeamID === playerWithStats.playerData.teamID) {
        localGames++;
        totalLocalPoints += stat.totalPoints;
      } else if (match.visitorTeamID === playerWithStats.playerData.teamID) {
        visitorGames++;
        totalVisitorPoints += stat.totalPoints;
      }
    }
  });

  const averageLocalPoints = localGames > 0 ? totalLocalPoints / localGames : 0;
  const averageVisitorPoints =
    visitorGames > 0 ? totalVisitorPoints / visitorGames : 0;

  // Use totalLocalPoints, totalVisitorPoints, averageLocalPoints, and averageVisitorPoints as needed

  return (
    <Card className="flex flex-col justify-center items-center py-2">
      <h3 className="text-lg font-semibold mb-4">Stats</h3>

      {/* <pre>{JSON.stringify(playerWithStats, null, 2)}</pre> */}
      {/* Example of how to render stats */}
      {renderStat("totalPoints", "Points")}
      {renderStat("mins_played", "Minutes Played")}
      {/* Add more as needed */}
      <p>Puntos como local: {totalLocalPoints}</p>
      <p>Puntos como local: {averageLocalPoints.toFixed(2)}</p>
      <p>Puntos como visitante: {totalVisitorPoints}</p>
      <p>Puntos como visitante: {averageVisitorPoints.toFixed(2)}</p>
    </Card>
  );
}
