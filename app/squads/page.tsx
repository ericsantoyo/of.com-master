import { createClient } from '@/utils/supabase/server';
import { getAllPlayers, getAllTeams } from '@/utils/supabase/functions';
import { redirect } from 'next/navigation';
import SquadForm from '@/components/myTeam/SquadForm';

export default async function CreateSquadPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { allPlayers } = await getAllPlayers();
  const { allTeams } = await getAllTeams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Create a Squad</h1>
      <SquadForm allPlayers={allPlayers} allTeams={allTeams} userEmail={user.email} />
    </div>
  );
}
