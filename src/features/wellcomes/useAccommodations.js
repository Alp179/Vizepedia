import { useQuery } from "@tanstack/react-query";
import { getAccommodations } from "../../services/apiAccomodations";

export function useAccommodations() {
  const { isLoading: isAccommodationsLoading, data: accommodationsData } =
    useQuery({
      queryKey: ["accommodations"],
      queryFn: getAccommodations,
    });

  return {
    isLoading: isAccommodationsLoading,
    accommodationsData,
  };
}
