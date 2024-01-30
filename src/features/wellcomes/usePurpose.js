import { useQuery } from "@tanstack/react-query";
import {
  getPurposeEd,
  getPurposeOth,
  getPurposeReg,
} from "../../services/apiPurpose";

export function usePurpose() {
  const { isLoading: isPurposeRegLoading, data: purposeRegData } = useQuery({
    queryKey: ["purposeReg"],
    queryFn: getPurposeReg,
  });

  const { isLoading: isPurposeEdLoading, data: purposeEdData } = useQuery({
    queryKey: ["purposeEd"],
    queryFn: getPurposeEd, // Bu satırda fonksiyonu çağırmanız gerekir
  });

  const { isLoading: isPurposeOthLoading, data: purposeOthData } = useQuery({
    queryKey: ["purposeOth"],
    queryFn: getPurposeOth, // Bu satırda fonksiyonu çağırmanız gerekir
  });

  return {
    isLoading: isPurposeRegLoading || isPurposeEdLoading || isPurposeOthLoading,
    purposeRegData,
    purposeEdData,
    purposeOthData,
  };
}
