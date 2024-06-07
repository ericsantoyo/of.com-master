import NewsPagination from "@/components/news/NewsPagination";
import MainNewsItem from "@/components/news/main-post-item";
import MainPostItemLoading from "@/components/news/main-post-item-loading";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { v4 } from "uuid";

export const revalidate = 0;

interface NewsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch total pages, only count published news
  const { count } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

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

  // Fetch posts
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to)
    .returns<news[]>();

  if (!data || error || !data.length) {
    notFound();
  }

  return (
    <>
      <div className="p-2 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((news) => (
          <Suspense key={v4()} fallback={<MainPostItemLoading />}>
            <MainNewsItem news={news} />
          </Suspense>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <NewsPagination
          page={page}
          totalPages={totalPages}
          baseUrl="/news"
          pageUrl="?page="
        />
      )}
    </>
  );
}
