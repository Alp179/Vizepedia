import { useQuery } from "@tanstack/react-query";
import { getMainCountries, getSchCountries } from "../../services/apiCountries";

export function useCountries() {
  const { isLoading: isSchLoading, data: schCounData } = useQuery({
    queryKey: ["schNamesData"],
    queryFn: getSchCountries,
  });

  const { isLoading: isMainLoading, data: mainCounData } = useQuery({
    queryKey: ["mainNamesData"],
    queryFn: getMainCountries, // Bu satırda fonksiyonu çağırmanız gerekir
  });

  return {
    isLoading: isSchLoading || isMainLoading,
    schCounData,
    mainCounData,
  };
}
