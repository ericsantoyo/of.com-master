"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllPlayers, getSquadById } from "@/utils/supabase/functions";
import Formation from "@/app/components/formations/Formation";

const Lineup = () => {
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");
  const [squadPlayers, setSquadPlayers] = useState([]);
  const [lineup, setLineup] = useState({});
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const squadData = await getSquadById(id);
      const { allPlayers } = await getAllPlayers();
      if (squadData) {
        setSquadPlayers(squadData.playersIDS || []);
      }
      setPlayers(allPlayers);
    };
    fetchData();
  }, [id]);

  const handleSelectFormation = (e) => {
    setSelectedFormation(e.target.value);
    setLineup({});
  };

  const handlePlayerAdd = (updatedLineup) => {
    setLineup(updatedLineup);
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Football Squad Lineup</h1>
      <div className="flex justify-center">
        <div className="w-1/2 pr-4">
          <div className="mb-4">
            <select
              value={selectedFormation}
              onChange={handleSelectFormation}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="4-3-3">4-3-3</option>
              <option value="4-4-2">4-4-2</option>
              <option value="3-4-3">3-4-3</option>
              <option value="4-2-4">4-2-4</option>
            </select>
          </div>

          <Formation
            formationName={selectedFormation}
            onPlayerAdd={handlePlayerAdd}
            squadPlayers={squadPlayers}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            squadID={id}
          />
        </div>
      </div>
    </div>
  );
};

export default Lineup;
