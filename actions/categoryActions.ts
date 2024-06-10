"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

//CREATE CATEGORY
export const createCategory = async (category: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("User not authenticated");
  }
  const userEmail = user?.email;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", userEmail)
    .single();

  if (userError || !userData) {
    return { error: userError?.message || "User not found" };
  }

  try {
    const { data, error } = await supabase
      .from("category")
      .insert([
        {
          category,
          user_id: userData.user_id,
        },
      ])
      .select();

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};
