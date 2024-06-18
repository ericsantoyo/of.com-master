"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

//CREATE getArticleBySlugApi
export const getArticleBySlugApi = async (slug: string, userId: string) => {
  const supabase = createClient();
  try {
    // const result = await Client.users.getUser(userId!);

    const { data, error } = await supabase
      .from("blog")
      .select(
        `*,
      author (*),
      category (*)
      `
      )
      .eq("slug", slug)
      .eq("published", true);
    // .eq("user_id", result?.id);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//CREATE getAllArticlesApi
export const getAllArticlesApi = async (userId: string) => {
  const supabase = createClient();
  try {
    // const result = await clerkClient.users.getUser(userId!);

    const { data, error } = await supabase
      .from("blog")
      .select("*, category(*), author(*)")
      // .eq("user_id", result?.id)
      .eq("published", true);

    if (error?.code)
      return {
        error,
      };

    return data;
  } catch (error: any) {
    return error;
  }
};

//CREATE getArticlesSlugApi
export const getArticlesSlugApi = async (userId: string) => {
  const supabase = createClient();
  try {
    // const result = await clerkClient.users.getUser(userId!);

    const { data, error } = await supabase
      .from("blog")
      .select("slug")
      // .eq("user_id", result?.id)
      .eq("published", true);

    if (error?.code)
      return {
        error,
      };

    return data;
  } catch (error: any) {
    return error;
  }
};
