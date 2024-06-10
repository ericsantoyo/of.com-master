"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


//DELETE BLOG
export const deleteBlog = async (slug: string) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("blog")
      .delete()
      .eq("slug", slug)
      // .eq("user_id", userId)
      .select();

    if (error?.code) return error;

    revalidatePath("/dashboard/documents");

    return data;
  } catch (error: any) {
    return error;
  }
};


//STATUS BLOG
export const statusBlogs = async (slug: string, published: boolean) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("blog")
      .update([
        {
          published,
        },
      ])
      // .eq("user_id", userId)
      .eq("slug", slug)
      .select();

    if (error?.code) return error;

    revalidatePath("/dashboard");

    return data;
  } catch (error: any) {
    return error;
  }
};
