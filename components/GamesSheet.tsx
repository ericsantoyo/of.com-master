"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { getAllMatches } from "@/utils/supabase/functions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentWeek, nicknameById, slugById } from "@/utils/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function GamesSheet() {
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

  if (error) {
    console.error("Error fetching matches:", error);
    return <div>Error fetching matches</div>;
  }

  const handleWeekChange = (value: string) => {
    setSelectedWeek(parseInt(value));
  };

  const handlePrevWeek = () => {
    setSelectedWeek((prevWeek) => Math.max(1, prevWeek - 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prevWeek) => Math.min(38, prevWeek + 1));
  };

  const selectedWeekMatchDate =
    matches &&
    matches.allMatches
      .filter((match) => match.week === selectedWeek)
      .sort((a, b) => {
        const dateA = a.matchDate ? new Date(a.matchDate).getTime() : 0;
        const dateB = b.matchDate ? new Date(b.matchDate).getTime() : 0;
        return dateA - dateB;
      })[0]?.matchDate;

  const selectedWeekday = selectedWeekMatchDate
    ? new Date(selectedWeekMatchDate).toLocaleDateString("es-EU", {
        weekday: "short",
      })
    : "";
  const selectedMonthDay = selectedWeekMatchDate
    ? new Date(selectedWeekMatchDate).toLocaleDateString("es-EU", {
        month: "short",
        day: "numeric",
      })
    : "";
  const selectedTime = selectedWeekMatchDate
    ? new Date(selectedWeekMatchDate).toLocaleTimeString("es-EU", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  const nextWeekMatchDate =
    matches &&
    matches.allMatches
      .filter((match) => match.week === selectedWeek + 1)
      .sort(
        (a, b) =>
          (a.matchDate ? new Date(a.matchDate).getTime() : 0) -
          (b.matchDate ? new Date(b.matchDate).getTime() : 0)
      )[0]?.matchDate;

  const nextWeekday = nextWeekMatchDate
    ? new Date(nextWeekMatchDate).toLocaleDateString("es-EU", {
        weekday: "short",
      })
    : "";
  const nextMonthDay = nextWeekMatchDate
    ? new Date(nextWeekMatchDate).toLocaleDateString("es-EU", {
        month: "short",
        day: "numeric",
      })
    : "";
  const nextTime = nextWeekMatchDate
    ? new Date(nextWeekMatchDate).toLocaleTimeString("es-EU", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  // Displaying matches
  return (
    <div className="flex flex-col justify-start items-center h-full overflow-y-auto mx-4">
      <div className="flex flex-row justify-center items-center w-full mt-5">
        <p className="text-xl font-semibold">PARTIDOS</p>
      </div>
      <Separator className=" my-2" />
      <div className="flex justify-between items-center my-2 gap-4">
        <Button variant="outline" onClick={handlePrevWeek}>
          <ChevronLeftIcon />
        </Button>

        <Select
          value={selectedWeek.toString()}
          onValueChange={handleWeekChange}
        >
          <SelectTrigger>
            <SelectValue>
              <div className="text-center text-base font-bold">
                {`Jornada ${selectedWeek}`}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[var(--radix-select-content-available-height)] ">
            {Array.from({ length: 38 }, (_, index) => (
              <SelectItem key={index + 1} value={(index + 1).toString()}>
                {" "}
                {`Jornada ${index + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleNextWeek}>
          <ChevronRightIcon />
        </Button>
      </div>
      {/* selectedWeek Date */}
      <div className="flex flex-row justify-center items-center w-full mb-2">
        <p className="capitalize text-xs font-semibold">
          {`${selectedWeekday} ${selectedMonthDay} - ${selectedTime}`}
        </p>
      </div>
      {/* <Separator className=" mb-4" /> */}
      <div className=" grid grid-cols-2 gap-x-3 gap-y-2 mx-auto w-full">
        {/* Display matches for the selected week */}
        {matches &&
          matches.allMatches
            .filter((match) => match.week === selectedWeek)
            .sort((a, b) => {
              const aDate = a.matchDate ? new Date(a.matchDate).getTime() : 0;
              const bDate = b.matchDate ? new Date(b.matchDate).getTime() : 0;
              return aDate - bDate;
            })
            .map((match) => {
              return (
                <div key={match.matchID}>
                  <Card className="flex flex-row justify-between items-center text-center w-full h-full">
                    {/* LOCAL TEAM */}
                    <Link
                      className="w-full flex justify-center items-center"
                      href={`/team/${match.localTeamID}`}
                    >
                      <div className="flex flex-col justify-center items-center h-10 w-10 shrink-0 py-2">
                        <Image
                          src={`/teamLogos/${slugById(match.localTeamID)}.png`}
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
                            <p className={`font-semibold text-base	`}>
                              {match.localScore}
                            </p>
                            <p className=" text-base font-bold ">-</p>
                            <p className={`font-semibold text-base	 `}>
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
                                  new Date(match.matchDate).toLocaleDateString(
                                    "es-EU",
                                    {
                                      weekday: "short",
                                    }
                                  )}
                              </p>
                              {match.matchDate && (
                                <p className="uppercase font-medium text-center w-full whitespace-nowrap">
                                  {new Date(match.matchDate).toLocaleDateString(
                                    "es-EU",
                                    {
                                      month: "numeric",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                              )}
                            </div>
                            <p className=" uppercase font-medium text-center w-full whitespace-nowrap">
                              {match.matchDate &&
                                new Date(match.matchDate).toLocaleTimeString(
                                  "es-EU",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
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
      <Separator className=" mt-4" />

      {/* Selected Week +1*/}

      <div className="flex flex-row justify-center items-center w-full my-2">
        <p className="text-base font-bold">{`Jornada ${selectedWeek + 1}`} </p>
        {/* DATE FOR FIRST MATCH OF THE WEEK */}
      </div>
      {/* selectedWeek Date */}
      <div className="flex flex-row justify-center items-center w-full mb-2">
        <p className="capitalize text-xs font-semibold">
          {`${nextWeekday} ${nextMonthDay} - ${nextTime}`}
        </p>
      </div>

      <div className=" grid grid-cols-2 gap-x-3 gap-y-2 mx-auto w-full">
        {/* Display matches for the selected week */}
        {matches &&
          matches.allMatches
            .filter((match) => match.week === selectedWeek + 1)
            .sort(
              (a, b) =>
                (a.matchDate ? new Date(a.matchDate).getTime() : 0) -
                (b.matchDate ? new Date(b.matchDate).getTime() : 0)
            )
            .map((match) => {
              return (
                <div key={match.matchID}>
                  <Card className="flex flex-row justify-between items-center text-center w-full h-full">
                    {/* LOCAL TEAM */}
                    <Link
                      className="w-full flex justify-center items-center"
                      href={`/team/${match.localTeamID}`}
                    >
                      <div className="flex flex-col justify-center items-center h-10 w-10 shrink-0 py-2">
                        <Image
                          src={`/teamLogos/${slugById(match.localTeamID)}.png`}
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
                            <p className={`font-semibold text-base	`}>
                              {match.localScore}
                            </p>
                            <p className=" text-base font-bold ">-</p>
                            <p className={`font-semibold text-base	 `}>
                              {match.visitorScore}
                            </p>
                          </div>
                        ) : (
                          <div
                            className={`flex flex-col justify-center items-center`}
                          >
                            <div className="flex justify-center items-center gap-1">
                              {match.matchDate && (
                                <p className=" uppercase font-bold text-center w-full whitespace-nowrap ">
                                  {new Date(match.matchDate).toLocaleDateString(
                                    "es-EU",
                                    {
                                      weekday: "short",
                                    }
                                  )}
                                </p>
                              )}
                              {match.matchDate && (
                                <p className="uppercase font-medium text-center w-full whitespace-nowrap">
                                  {new Date(match.matchDate).toLocaleDateString(
                                    "es-EU",
                                    {
                                      month: "numeric",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                              )}
                            </div>
                            <p className=" uppercase font-medium text-center w-full whitespace-nowrap">
                              {match.matchDate
                                ? new Date(match.matchDate).toLocaleTimeString(
                                    "es-EU",
                                    {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: false,
                                    }
                                  )
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
  );
}
