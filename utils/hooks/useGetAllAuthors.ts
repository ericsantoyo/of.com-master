import { useQuery } from "@tanstack/react-query";
import { getAllAuthors } from "@/actions/articlesActions";

async function fetchAllAuthors() {
  try {
    const response = await getAllAuthors();

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetAllAuthors = () => {
  return useQuery({
    queryKey: ["get-all-authors"],
    queryFn: () => fetchAllAuthors(),
  });
};
