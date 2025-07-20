import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import { getUserAnswers } from "../../services/apiCheckAnswers";
import { AnonymousDataService } from "../../utils/anonymousDataService";

export function useUser() {
  // Check user type BEFORE making any API calls
  const isBot = AnonymousDataService.isBotUser();
  const isAnonymous = AnonymousDataService.isAnonymousUser();

  // HOOKS MUST BE CALLED UNCONDITIONALLY - but we can disable them
  const {
    isLoading: isUserLoading,
    data: user,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    // CONDITIONAL LOGIC IN enabled, not in hook call
    enabled: !isBot && !isAnonymous,
    retry: 1, // Reduce retries
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const {
    isLoading: isAnswersLoading,
    data: answers,
    refetch: refetchAnswers,
  } = useQuery({
    queryKey: ["userAnswers", user?.id],
    queryFn: () => getUserAnswers(user?.id),
    enabled: !!user?.id && !isBot && !isAnonymous,
    retry: 1, // Reduce retries
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // CONDITIONAL LOGIC AFTER hooks - this is safe
  if (isBot) {
    console.log("🤖 Bot detected - returning bot data");
    return {
      isLoading: false,
      user: null,
      answers: null,
      isAuthenticated: false,
      userType: "bot",
      refetchUser: () => Promise.resolve(),
      refetchAnswers: () => Promise.resolve(),
    };
  }

  if (isAnonymous) {
    console.log("👤 Anonymous user detected - using localStorage data");
    const anonymousAnswers = AnonymousDataService.getUserAnswers();

    return {
      isLoading: false,
      user: null,
      answers: anonymousAnswers,
      isAuthenticated: false,
      userType: "anonymous",
      refetchUser: () => Promise.resolve(),
      refetchAnswers: () => {
        return Promise.resolve(AnonymousDataService.getUserAnswers());
      },
    };
  }

  // Return loading state for potential authenticated users
  if (isUserLoading) {
    console.log("⏳ Loading user data...");
    return {
      isLoading: true,
      user: null,
      answers: null,
      isAuthenticated: false,
      userType: "loading",
      refetchUser,
      refetchAnswers: () => Promise.resolve(),
    };
  }

  // Return authenticated user data if found
  if (user) {
    console.log("✅ Authenticated user found:", user.email);
    return {
      isLoading: isAnswersLoading,
      user,
      answers,
      isAuthenticated: user?.role === "authenticated",
      userType: "authenticated",
      refetchUser,
      refetchAnswers,
    };
  }

  // Return new visitor if no user found and not loading
  console.log("👋 New visitor - no authentication");
  return {
    isLoading: false,
    user: null,
    answers: null,
    isAuthenticated: false,
    userType: "new_visitor",
    refetchUser,
    refetchAnswers: () => Promise.resolve(),
  };
}
