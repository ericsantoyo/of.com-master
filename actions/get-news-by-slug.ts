"use server";

import { createClient } from "@/utils/supabase/server";

export const getNewsBySlug = async (slug: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userID = user?.id;

  try {
    const { data, error } = await supabase
      .from("blog")
      .select(
        `*,
    author (*),
    category (*)
    `
      )
      .eq("slug", slug);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};
