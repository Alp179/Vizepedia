import { useQuery } from "@tanstack/react-query";
import { getProfessions } from "../../services/apiProfessions";

export function useProfessions() {
  const { isLoading: isProfessionsLoading, data: professionsData } = useQuery({
    queryKey: ["professions"],
    queryFn: getProfessions,
  });

  return {
    isLoading: isProfessionsLoading,
    professionsData,
  };
}
