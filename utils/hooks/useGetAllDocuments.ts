import { useQuery } from "@tanstack/react-query";
import { getAllDocuments } from "@/actions/articlesActions";

async function fetchDocuments() {
  try {
    const response = await getAllDocuments();

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetAllDocuments = () => {
  return useQuery({
    queryKey: ["get-all-documents"],
    queryFn: () => fetchDocuments(),
  });
};
