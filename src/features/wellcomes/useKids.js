import { useQuery } from "@tanstack/react-query";
import { getKids } from "../../services/apiKids";
export function useKids() {
  const { isLoading: isLoadingKids, data: kidsData } = useQuery({
    queryKey: ["kids"],
    queryFn: getKids,
  });

  return {
    isLoading: isLoadingKids,
    kidsData,
  };
}
