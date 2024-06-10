import { useQuery } from "@tanstack/react-query";
import { readSites } from "@/actions/sitesActions";


export const useGetAllSites = () => {
  return useQuery({
    queryKey: ["get-all-sites"],
    queryFn: () => readSites(),
  });
};
