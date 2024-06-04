"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { getAllMatches } from "@/utils/supabase/functions";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getCurrentWeek, slugById } from "@/utils/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommingWeek() {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const { data: matches, error } = useSWR("/api/user", getAllMatches);

  useEffect(() => {
    if (matches && matches.allMatches) {
      const initialWeek = getCurrentWeek(matches.allMatches);
      setSelectedWeek(initialWeek);
    }
  }, [matches]);

  const handleWeekChange = (weekNumber: string) => {
    setSelectedWeek(parseInt(weekNumber));
  };

  const handlePrevWeek = () => {
    setSelectedWeek((prevWeek) => Math.max(1, prevWeek - 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prevWeek) => Math.min(38, prevWeek + 1));
  };

  if (error) return <div>Error fetching matches</div>;
  if (!matches || !matches.allMatches)
    return <Skeleton className="w-full h-10" />;

  const matchesForSelectedWeek =
    matches && matches.allMatches
      ? matches.allMatches
          .filter((match) => match.week === selectedWeek)
          .sort(
            (a, b) =>
              (a.matchDate ? new Date(a.matchDate).getTime() : 0) -
              (b.matchDate ? new Date(b.matchDate).getTime() : 0)
          )
      : [];

  const firstMatchDate =
    matchesForSelectedWeek.length > 0 && matchesForSelectedWeek[0].matchDate
      ? new Date(matchesForSelectedWeek[0].matchDate)
      : null;

  return (
    <div className="flex flex-col justify-start items-center w-full h-full overflow-y-auto grow">
      <div className="flex flex-row justify-center items-center gap-4 pb-2">
        <p className="text-base uppercase font-extrabold">
          {matches && `Jornada ${selectedWeek} `}
        </p>

        <p className="text-sm capitalize font-semibold">
          {firstMatchDate &&
            firstMatchDate.toLocaleString("es-EU", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
        </p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <Button variant="outline" onClick={handlePrevWeek} className="mr-3 ">
          <ChevronLeftIcon />
        </Button>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-2 mx-auto w-full">
          {matchesForSelectedWeek.map((match) => (
            <div key={match.matchID}>
              <Card className="flex flex-col justify-between items-center w-full h-full py-[6px] text-center">
                <div className="flex flex-row justify-between items-center text-center w-full ">
                  <Image
                    src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                    alt="home"
                    width={48}
                    height={48}
                    style={{ objectFit: "contain" }}
                    className="h-6"
                  />
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex">
                      <p className="font-semibold">{match.localScore}</p>
                      <p className="mx-1">-</p>
                      <p className="font-semibold">{match.visitorScore}</p>
                    </div>
                  </div>
                  <Image
                    src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                    alt="home"
                    width={48}
                    height={48}
                    style={{ objectFit: "contain" }}
                    className="h-6"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleNextWeek} className="ml-3">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
