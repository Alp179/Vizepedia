import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { getUserAnswers } from "../../services/apiCheckAnswers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: async (user) => {
      queryClient.setQueryData(["user"], user.user);

      // getUserAnswers fonksiyonunu çağırarak güncel yanıtları al
      try {
        const answers = await getUserAnswers(user.user.id);
        // Yönlendirmeyi güncellenmiş yanıtlara göre yap
        answers?.length > 0 ? navigate("/dashboard") : navigate("/wellcome");
      } catch (error) {
        console.error("Error fetching user answers:", error);
        // Hata durumunda kullanıcıyı bir hata sayfasına yönlendirebilirsiniz.
      }
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error("Provider email or password are incorrect");
    },
  });

  return { login, isLoading };
}
