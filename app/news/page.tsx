import NewsPageLoading from "@/components/news/NewsPageLoading";
import NewsPagination from "@/components/news/NewsPagination";
import PreviewRectangle from "@/components/news/PreviewRectangle";
import { fetchNewsData } from "@/utils/supabase/serverFunctions";
import { Suspense } from "react";
import { v4 } from "uuid";

export const revalidate = 0;

interface NewsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const NewsPageContent = async ({ searchParams }: NewsPageProps) => {
  const { data, totalPages, page } = await fetchNewsData(searchParams);

  return (
    <>
      <div className="p-2 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((news) => (
          <PreviewRectangle key={v4()} news={news} />
        ))}
      </div>
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
};

export default function NewsPage({ searchParams }: NewsPageProps) {
  return (
    <Suspense fallback={<NewsPageLoading />}>
      <NewsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
