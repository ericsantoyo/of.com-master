"use server";

import { createClient } from "@/utils/supabase/server";

export const getMySquadById = async (squadID: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userID = user?.id;

  try {
    const { data, error } = await supabase
      .from("squads")
      .select("*")
      .eq("squadID", squadID)
      .eq("user_id", userID)
      .single();

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    console.error('Error fetching SquadById:', error.message);
    return error;
  }
};