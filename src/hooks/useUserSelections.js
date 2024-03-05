import { useQuery } from "@tanstack/react-query";
import { fetchUserSelections } from "../utils/userSelectionsFetch";

export function useUserSelections(userId) {
  return useQuery({
    queryKey: ["userSelections", userId],
    queryFn: () => fetchUserSelections(userId),
    enabled: !!userId, // Sadece userId değeri null değilse sorguyu çalıştır
  });
}
