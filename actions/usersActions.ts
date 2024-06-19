"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


export const getAllUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("users").select("*");

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


// export const isAdmin = async (userId: string) => {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from("user_roles")
//     .select("role")
//     .eq("user_id", userId)
//     .single();

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data.role === "admin";
// };



//CREATE USER
export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: {
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  user_id: string;
}) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("user")
      .insert([{ email, first_name, last_name, profile_image_url, user_id }])
      .select();

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//UPDATE USER
export const userUpdate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: {
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  user_id: string;
}) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("user")
      .update([{ email, first_name, last_name, profile_image_url, user_id }])
      .eq("user_id", user_id);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};


export const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  return user;
};