import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import { getUserAnswers } from "../../services/apiCheckAnswers";

export function useUser() {
  const { isLoading: isUserLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  // Kullanıcının yanıtlarını fetchleme
  const { isLoading: isAnswersLoading, data: answers } = useQuery({
    queryKey: ["userAnswers", user?.id],
    queryFn: () => getUserAnswers(user?.id),
    enabled: !!user?.id, // Yalnızca kullanıcı ID'si varsa sorguyu çalıştır
  });

  return {
    isLoading: isUserLoading || isAnswersLoading, // Herhangi bir sorgu yükleniyorsa
    user,
    answers,
    isAuthenticated: user?.role === "authenticated",
  };
}
