"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";

import { getAllMatches } from "@/utils/supabase/functions";

import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { getCurrentWeek, slugById } from "@/utils/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";

// Your component
export default function GamesPreview() {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const {
    data: matches,
    error,
    isLoading,
  } = useSWR("/api/user", getAllMatches);

  useEffect(() => {
    if (matches && Array.isArray(matches.allMatches)) {
      const initialWeek = getCurrentWeek(matches.allMatches);
      setSelectedWeek(initialWeek);
    }
  }, [matches]);

  // Handling errors
  if (error) {
    console.error("Error fetching matches:", error);
    return <div>Error fetching matches</div>;
  }

  const handleWeekChange = (value: string) => {
    // Fix 2: Change the type of value to string
    setSelectedWeek(parseInt(value)); // Fix 3: Parse the string value to number
  };

  const handlePrevWeek = () => {
    setSelectedWeek((prevWeek) => Math.max(1, prevWeek - 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prevWeek) => Math.min(38, prevWeek + 1));
  };
  const firstMatchDate =
    matches &&
    matches.allMatches
      .filter((match) => match.week === selectedWeek)
      .sort((a, b) => {
        const dateA = a.matchDate ? new Date(a.matchDate).getTime() : 0;
        const dateB = b.matchDate ? new Date(b.matchDate).getTime() : 0;
        return dateA - dateB;
      })[0]?.matchDate;

  const weekday = firstMatchDate
    ? new Date(firstMatchDate).toLocaleDateString("es-EU", { weekday: "short" })
    : "";
  const monthDay = firstMatchDate
    ? new Date(firstMatchDate).toLocaleDateString("es-EU", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="flex flex-col justify-start items-center w-full h-full overflow-y-auto grow">
      <div className="flex flex-row justify-center items-center gap-2 pb-2">
        <Button variant="outline" onClick={handlePrevWeek} className="mr-3 ">
          <ChevronLeftIcon />
        </Button>
        <p className="text-base	text-neutral-700 uppercase font-extrabold">
          Jornada
        </p>
        <p className="text-xl	text-red-700 uppercase font-extrabold">
          {matches && `${selectedWeek}  `}
        </p>
        <div className="mx-2 h-4 border-l border-neutral-300"></div>
        <p className="text-sm text-neutral-800 capitalize font-semibold">
          {matches && (
            <>
              <span className="font-bold uppercase">{weekday}</span> {monthDay}
            </>
          )}
        </p>

        <Button variant="outline" onClick={handleNextWeek} className="ml-3">
          <ChevronRightIcon />
        </Button>
        {/* <MatchCountdown matches={matches} selectedWeek={selectedWeek} /> */}
      </div>
      {/* <div className="mb-4 w-full border-t border-neutral-300"></div> */}
      {/* <Separator className=" mb-4" /> */}
      <div className="flex flex-row justify-between items-center w-full p-1 ">
        <div className=" grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-2 mx-auto w-full  ">
          {/* Display matches for the selected week */}
          {matches &&
            matches.allMatches
              .filter((match) => match.week === selectedWeek)
              .sort((a, b) => {
                const dateA = a.matchDate ? new Date(a.matchDate).getTime() : 0;
                const dateB = b.matchDate ? new Date(b.matchDate).getTime() : 0;
                return dateA - dateB;
              })
              .map((match) => {
                return (
                  <div className="" key={match.matchID}>
                    <Card className="flex flex-row justify-between items-center text-center w-full h-full">
                      {/* LOCAL TEAM */}
                      <Link
                        className="w-full flex justify-center items-center"
                        href={`/team/${match.localTeamID}`}
                      >
                        <div className="flex flex-col justify-center items-center h-10 w-10 shrink-0 py-2">
                          <Image
                            src={`/teamLogos/${slugById(
                              match.localTeamID
                            )}.png`}
                            alt="home team"
                            width={48}
                            height={48}
                            style={{
                              objectFit: "contain",
                              width: "auto",
                            }}
                            className="h-7  "
                            priority
                          />
                          {/* <p className="font-bold text-[11px] p-0 m-0 ">
                            {nicknameById(match.localTeamID)}
                          </p> */}
                        </div>
                      </Link>

                      {/* DATE & SCORE */}
                      <div className="flex flex-col justify-center items-center w-full h-full text-center text-[10px] ">
                        <div className="w-full	 ">
                          {match.matchState === 7 ? (
                            <div className="flex flex-row justify-between items-center px-1.5  ">
                              <p className={`font-bold text-base	`}>
                                {match.localScore}
                              </p>
                              <p className=" text-base font-bold ">-</p>
                              <p className={`font-bold text-base	 `}>
                                {match.visitorScore}
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`flex flex-col justify-center items-center`}
                            >
                              <div className="flex justify-center items-center gap-1">
                                <p className=" uppercase font-bold text-center w-full whitespace-nowrap ">
                                  {match.matchDate &&
                                    new Date(
                                      match.matchDate
                                    ).toLocaleDateString("es-EU", {
                                      weekday: "short",
                                    })}
                                </p>
                                <p className="uppercase font-medium text-center w-full whitespace-nowrap">
                                  {match.matchDate &&
                                    new Date(
                                      match.matchDate
                                    ).toLocaleDateString("es-EU", {
                                      month: "numeric",
                                      day: "numeric",
                                    })}
                                </p>
                              </div>
                              <p className=" uppercase font-medium text-center w-full whitespace-nowrap">
                                {match.matchDate
                                  ? new Date(
                                      match.matchDate
                                    ).toLocaleTimeString("es-EU", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                  : ""}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* VISITOR TEAM */}
                      <Link
                        className="w-full flex justify-center items-center"
                        href={`/team/${match.visitorTeamID}`}
                      >
                        <div className="flex flex-col justify-center items-center h-10 w-10 shrink-0 py-2">
                          <Image
                            src={`/teamLogos/${slugById(
                              match.visitorTeamID
                            )}.png`}
                            alt="visitor team"
                            width={48}
                            height={48}
                            style={{
                              objectFit: "contain",
                              width: "auto",
                            }}
                            className="h-7  "
                            priority
                          />
                          {/* <p className="font-bold text-[11px] p-0 m-0 ">
                            {nicknameById(match.visitorTeamID)}
                          </p> */}
                        </div>
                      </Link>
                    </Card>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
