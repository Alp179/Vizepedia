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

      try {
        const answers = await getUserAnswers(user.user.id);
        answers?.length > 0 ? navigate("/dashboard") : navigate("/wellcome");
      } catch (error) {
        console.error("Error fetching user answers:", error);
        toast.error("Yanıtlar yüklenirken hata oluştu.", { duration: 4000 });
      }
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error("E-posta veya şifre hatalı.", { duration: 4000 });
    },
  });

  return { login, isLoading };
}
