'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getUserEmail = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return user.email;
};

// export const getUserRole = async () => {
//   const supabase = createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return null;
//   }

//   return user;
// }

export const getUserRole = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated", role: null };
  }

  const { data, error } = await supabase
    .from("roles")
    .select("role")
    .eq("email", user.email)
    .single();

  if (error || !data) {
    return { error: error?.message || "Role not found", role: null };
  }

  return { error: null, role: data.role };
};

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
    playersIDS: playerIDs.map((id) => ({ playerID: Number(id) })), // Convert playerID to number
    email,
  };

  const { error } = await supabase.from('squads').insert(newSquad);
  if (error) {
    console.error('Error creating squad:', error);
  } else {
    // Revalidate the path after creating a squad
    revalidatePath('/myteams');
  }
}

// update squad
export async function updateSquad(formData: FormData) {
  const supabase = createClient();
  const squadName = formData.get('squadName') as string;
  const playerIDs = formData.getAll('playerIDs') as string[];
  const email = formData.get('email') as string;
  const squadID = formData.get('squadID') as string;

  const updatedSquad = {
    squadName,
    playersIDS: playerIDs.map((id) => ({ playerID: Number(id) })), // Convert playerID to number
    email,
  };

  const { error } = await supabase.from('squads').update(updatedSquad).eq('squadID', squadID);
  if (error) {
    console.error('Error updating squad:', error);
  } else {
    // Revalidate the path after updating a squad
    revalidatePath('/myteams');
  }
}