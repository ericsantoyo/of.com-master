'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSquads(email: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('squads')
    .select('*')
    .eq('email', email);

  return data || [];
}

export async function deleteSquad(formData : FormData) {
  try {
    const id = formData.get('id');
    const supabase = createClient();
    await supabase
      .from('squads')
      .delete()
      .eq('squadID' , id);

    // Revalidate the path after deleting a squad
    revalidatePath('/myteams');
  } catch (error) {
    console.error('Error deleting squad:', error);
  }
}


export async function createSquad(formData: FormData) {
  const supabase = createClient();
  const squadName = formData.get('squadName') as string;
  const playerIDs = formData.getAll('playerIDs') as string[];
  const email = formData.get('email') as string;

  const newSquad = {
    squadName,
    playersIDS: playerIDs.map((id) => ({ playerID: id })),
    email,
  };

  await supabase.from('squads').insert(newSquad);

  // Revalidate the path after creating a squad
  revalidatePath('/myteams');
}