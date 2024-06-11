"use server";

import { createClient } from "@/utils/supabase/server";

export const getMySquads = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userID = user?.id;

  try {
    const { data, error } = await supabase
      .from("squads")
      .select("*")
      .eq("user_id", userID);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};
