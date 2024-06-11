"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getAllDocumentsWithPagination = async (searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const supabase = createClient();
  // Fetch total pages
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });

  // Pagination
  const limit = 12;
  const totalPages = count ? Math.ceil(count / limit) : 0;
  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    //all docs that are published
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to)
      .returns<news[]>();

    if (!data || error || !data.length) {
      throw new Error("No data found");
    }
    return { data, totalPages, page };
  } catch (error: any) {
    return error;
  }
};