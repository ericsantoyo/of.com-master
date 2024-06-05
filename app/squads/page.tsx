import { createClient } from "@/utils/supabase/server";
import { getAllPlayersBasicInfo, getAllTeams } from "@/utils/supabase/functions";
import { redirect } from "next/navigation";
import SquadForm from "@/components/myTeam/SquadForm";
import { Blocks } from "lucide-react";

export default async function CreateSquadPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { allPlayers } = await getAllPlayersBasicInfo();
  const { allTeams } = await getAllTeams();

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-2 mx-auto w-full">
        <Blocks size={24} />
        <h1 className="text-2xl font-bold text-center">Crea tu Equipo</h1>
      </div>
      <SquadForm
        allPlayers={allPlayers}
        allTeams={allTeams}
        userEmail={user.email ?? ""}
      />
    </div>
  );
}
