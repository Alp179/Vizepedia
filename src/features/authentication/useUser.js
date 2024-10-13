import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import { getUserAnswers } from "../../services/apiCheckAnswers";

export function useUser() {
  // Kullanıcıyı fetch eden query
  const {
    isLoading: isUserLoading,
    data: user,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  // Kullanıcının yanıtlarını fetchleme query'si
  const {
    isLoading: isAnswersLoading,
    data: answers,
    refetch: refetchAnswers,
  } = useQuery({
    queryKey: ["userAnswers", user?.id],
    queryFn: () => getUserAnswers(user?.id),
    enabled: !!user?.id, // Yalnızca kullanıcı ID'si varsa sorguyu çalıştır
  });

  return {
    isLoading: isUserLoading || isAnswersLoading, // Herhangi bir sorgu yükleniyorsa
    user,
    answers,
    isAuthenticated: user?.role === "authenticated",
    refetchUser, // Kullanıcı sorgusunu tekrar çalıştırmak için refetch fonksiyonu
    refetchAnswers, // Cevaplar sorgusunu tekrar çalıştırmak için refetch fonksiyonu
  };
}
