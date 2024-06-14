"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


export const fetchAllUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchAllUserRoles = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("user_roles").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};



export const changeUserRole = async (userId: string, newRole: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_roles")
    .update({ role: newRole })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
};


export const isAdmin = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.role === "admin";
};