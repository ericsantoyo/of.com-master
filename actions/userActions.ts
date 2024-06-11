"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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


const fetchUserRoles = async (userId) => {
  const { data, error } = await supabase
    .from('roles')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
  return data.map(entry => entry.role);
};


export const getUserRole = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
