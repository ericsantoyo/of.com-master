import { createClient } from "@/utils/supabase/server";
import {
  getAllPlayersBasicInfo,
  getAllTeams,
  getSquadById,
} from "@/utils/supabase/functions";
import { redirect, useParams } from "next/navigation";
import EditSquadForm from "@/app/myteams/(components)/EditSquadForm";
import { UserCog } from "lucide-react";

export default async function CreateSquadPage({
  params,
}: {
  params: { squadID: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const squadID = params.squadID;
  const mysquad = await getSquadById(squadID);

  const { allPlayers } = await getAllPlayersBasicInfo();
  const { allTeams } = await getAllTeams();

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-2 mx-auto w-full">
        <UserCog size={24} />
        <h1 className="text-2xl font-bold text-center">Edita tu Equipo</h1>
      </div>
      <EditSquadForm
        allPlayers={allPlayers}
        allTeams={allTeams}
        userEmail={user.email ?? ""}
        squad={mysquad}
      />
    </div>
  );
}
