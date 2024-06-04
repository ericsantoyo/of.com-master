"use client";
import { getAllTeams } from "@/utils/supabase/functions";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "@/types";

type Props = {
  search?: string;
};

const SearchFilters = ({ search }: Props) => {
  const router = useRouter();
  const initialRender = useRef(true);

  const [playerName, setPlayerName] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("-1");

  const [query] = useDebounce(playerName, 1000);

  function getTeamsOptions(teams: Team[]) {
    const options = [{ teamID: -1, name: "All Teams" }];
    for (const team of teams) {
      options.push(team);
    }
    return options;
  }

  const updateURL = () => {
    const params = new URLSearchParams();

    if (query) params.set("search", query);
    if (
      selectedTeam &&
      selectedTeam !== "-1" &&
      typeof selectedTeam !== "undefined"
    )
      params.set("team", selectedTeam);

    router.push(`/stats?${params.toString()}`);
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    updateURL();
  }, [query, selectedTeam]);

  useEffect(() => {
    async function fetchTeams() {
      const { allTeams: fetchedTeams }: { allTeams: teams[] } =
        await getAllTeams();

      setTeams(fetchedTeams);
    }
    fetchTeams();
  }, []);

  const resetFilters = () => {
    setPlayerName("");
    setSelectedTeam("-1");
    // If you want to clear the URL as well, add the following:
    // router.push(`/stats`);
  };

  return (
    <div className="flex justify-center items-center py-4 gap-4 ">
      {/* <pre className="">{JSON.stringify(teams, null, 2)}</pre> */}
      <div
        className={`
        flex flex-row items-center justify-center  transition-all
        relative min-w-[90px] max-w-[170px] rounded-md
        
         `}
      >
        <Search className="absolute h-4 w-4 top-3 left-3 " />
        <Input
          className="pl-9 outline-none text-md"
          type="text"
          placeholder="Search..."
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
          }}
        />
      </div>

      {teams.length > 0 && (
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="min-w-[140px] max-w-[170px]">
            <SelectValue placeholder="Select a Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {getTeamsOptions(teams).map((team) => (
                <SelectItem value={team.teamID.toString()} key={team.teamID}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <Button
        variant="stardard"
        size="default"
        className={` transition-all `}
        onClick={resetFilters}
      >
        X
      </Button>
    </div>
  );
};

export default SearchFilters;
