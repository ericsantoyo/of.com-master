import { useQuery } from "@tanstack/react-query";
import { getAllArticleBySlug } from "@/actions/articlesActions";

async function fetchDocumentBySlug(slug: string) {
  try {
    const response = await getAllArticleBySlug(slug);

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["get-article-slug", slug],
    queryFn: () => fetchDocumentBySlug(slug),
  });
};
