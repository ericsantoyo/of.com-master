import { createClient } from "@/utils/supabase/server";
import {
  getAllPlayersBasicInfo,
  getAllTeams,
} from "@/utils/supabase/functions";
import { redirect, useParams } from "next/navigation";
import EditSquadForm from "@/app/myteams/(components)/EditSquadForm";
import { UserCog } from "lucide-react";
import { getMySquadById } from "@/actions/get-my-squad-by-id";

export default async function EditSquadPage({
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
  const mysquad = await getMySquadById(squadID);

  const { allPlayers } = await getAllPlayersBasicInfo();
  const { allTeams } = await getAllTeams();

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-2 mx-auto w-full">
        <UserCog size={24} />
        <h1 className="text-2xl font-bold text-center">Edita tu Equipo</h1>
      </div>
        {/* <pre>{JSON.stringify(mysquad, null, 2)}</pre> */}
      <EditSquadForm
        allPlayers={allPlayers}
        allTeams={allTeams}
        userEmail={user.email ?? ""}
        squad={mysquad}
      />
    </div>
  );
}
