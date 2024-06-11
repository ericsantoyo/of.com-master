"use server";

import { createClient } from "@/utils/supabase/server";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getAllNews(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const supabase = createClient();

  // Fetch total pages
  const { count } = await supabase
    .from("blog")
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

  // Artificial delay for testing loading state
  // await delay(3000); // 3 seconds delay

  // Fetch posts
  const { data, error } = await supabase
    .from("blog")
    .select("*, category(*), author(*)")
    .order("created_at", { ascending: false })
    .range(from, to)
    .returns<news[]>();

  if (!data || error || !data.length) {
    throw new Error("No data found");
  }

  return { data, totalPages, page };
}

export { getAllNews };
