import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tüm localStorage ve çerezleri temizleyen işlev
  const clearAllStorageAndCookies = () => {
    // Tüm localStorage temizle
    localStorage.clear();

    // Supabase oturum anahtarını özel olarak temizle
    const supabaseKey = Object.keys(localStorage).find((key) =>
      key.includes("-auth-token")
    );
    if (supabaseKey) {
      localStorage.removeItem(supabaseKey);
    }

    // Tüm çerezleri temizle
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // Tarayıcı özel oturum depolamasını temizle
    sessionStorage.clear();

    console.log("Oturum kapatıldı: Tüm veriler ve çerezler temizlendi");
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // React Query önbelleğini temizle
      queryClient.removeQueries();

      // Tüm localStorage ve çerezleri temizle
      clearAllStorageAndCookies();

      // Giriş sayfasına yönlendir
      navigate("/login", { replace: true });
    },
  });

  // Kullanım kolaylığı için wrapper fonksiyon
  const logout = () => {
    mutate();
  };

  return { logout, isLoading };
}
