"use client";
import React, { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import useSWR from "swr";
import { getAllPlayers } from "@/utils/supabase/functions";
import Image from "next/image";
import { slugById } from "@/utils/utils";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export type SearchProps = {
  divClassName?: string;
};

export default function SearchBox(props: SearchProps) {
  const { data: players, error } = useSWR(["getAllPlayers"], async () => {
    const { allPlayers: players } = (await getAllPlayers()) as {
      allPlayers: players[];
    };
    return players;
  });

  // Define state variables for search term and modal open state
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  // Event handler for input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter players based on search term
  const filteredPlayers = players
    ?.filter((player) =>
      player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, searchTerm ? undefined : 9);

  return (
    <div className={`${props.divClassName}`}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group flex flex-col justify-center items-center transition-all w-10">
            <p className="transition-all text-transparent text-center text-[8px] p-0 m-0 hidden md:flex">
              _______
            </p>
            <Button
              variant="navbar"
              size={"icon"}
              aria-label="search"
              className={`group transition-all group-hover:bg-sky-600 outline-none focus:outline-none group-hover:border-none my-1.5`}
            >
              <SearchIcon className=" transition-all group-hover:text-neutral-100" />
            </Button>
            <p className="transition-all group-hover:text-inherit text-transparent text-center text-xs hidden md:flex">
              Buscar
            </p>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[280px] h-[425px] overflow-auto">
          {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
          <div className="transition-all outline-none  flex flex-col justify-start  ">
            <Input
              autoFocus
              placeholder="Buscar jugador..."
              onChange={(event) => handleInputChange(event)}
              value={searchTerm}
              className="w-[180px] mb-4 text-base"
            />

            {/* Display search results */}
            <div className="flex flex-col w-full overflow-auto">
              {filteredPlayers &&
                filteredPlayers.map((player, index) => (
                  <div key={player.playerID} className=" w-full">
                    <Link
                      href={`/player/${player.playerID}`}
                      className="flex justify-between items-center space-x-2 w-full px-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex justify-center items-center w-8">
                        <Image
                          src={player.image}
                          alt={player.nickname}
                          width={32}
                          height={32}
                          className="h-8 w-auto"
                        />
                      </div>
                      <span className="text-sm">{player.nickname}</span>
                      <span className="text-sm">{player.playerID}</span>
                      <div className="flex justify-center items-center w-6">
                        <Image
                          src={`/teamLogos/${slugById(player.teamID)}.png`}
                          alt={player.teamName}
                          width={28}
                          height={28}
                          className="h-6 w-auto"
                        />
                      </div>
                    </Link>
                    <Separator className="mt-0.5" />
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
