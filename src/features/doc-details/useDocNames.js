import { useQuery } from "@tanstack/react-query";
import { getDocNames } from "../../services/apiDocNames";

export function useDocNames() {
  const {
    isLoading,
    data: docNames,
    error,
  } = useQuery({
    queryKey: ["docNames"],
    queryFn: getDocNames,
  });
  return { isLoading, error, docNames };
}
