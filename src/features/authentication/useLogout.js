import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Clear all localStorage, sessionStorage and cookies
  const clearAllStorageAndCookies = () => {
    // Clear all localStorage
    localStorage.clear();

    // Clear Supabase session key specifically
    const supabaseKey = Object.keys(localStorage).find((key) =>
      key.includes("-auth-token")
    );
    if (supabaseKey) {
      localStorage.removeItem(supabaseKey);
    }

    // Clear all cookies
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // UPDATED: Clear sessionStorage as well (for anonymous data)
    sessionStorage.clear();

    console.log("Logout completed: All data and cookies cleared");
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear React Query cache
      queryClient.removeQueries();

      // Clear all localStorage, sessionStorage and cookies
      clearAllStorageAndCookies();

      // Redirect to login page
      navigate("/login", { replace: true });
    },
  });

  // Wrapper function for ease of use
  const logout = () => {
    mutate();
  };

  return { logout, isLoading };
}