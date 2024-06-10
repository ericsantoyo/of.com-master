"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


//READ SITES
export const readSites = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("sites")
      .select()
      // .eq("user_id", userId);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};
