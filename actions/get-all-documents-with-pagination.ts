"use server";

import { createClient } from "@/utils/supabase/server";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAllDocumentsWithPagination = async (searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const supabase = createClient();

  // Fetch total pages
  const { count, error: countError } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(`Error fetching count: ${countError.message}`);
  }

  // Handle case with no news entries
  if (count === 0) {
    return { data: [], totalPages: 0, page: 1 };
  }

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

    // Artificial delay for testing loading state
  // await delay(3000); // 3 seconds delay

  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!data || error || !data.length) {
      throw new Error("No data found");
    }

    return { data, totalPages, page };
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    return error;
  }
};
