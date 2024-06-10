import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/actions/articlesActions";

async function fetchAllCategories() {
  try {
    const response = await getAllCategories();

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["get-all-categories"],
    queryFn: () => fetchAllCategories(),
  });
};
