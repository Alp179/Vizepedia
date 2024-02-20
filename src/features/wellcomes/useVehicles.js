import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../../services/apiVehicles";

export function useVehicles() {
  const { isLoading: isLoadingVehicles, data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  return {
    isLoading: isLoadingVehicles,
    vehiclesData,
  };
}
