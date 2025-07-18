import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import { getUserAnswers } from "../../services/apiCheckAnswers";
import { AnonymousDataService } from "../../utils/anonymousDataService";

export function useUser() {
  // Keep the original queries running, but add logic to handle different user types
  const {
    isLoading: isUserLoading,
    data: user,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    // Always run the query but handle results differently
  });

  const {
    isLoading: isAnswersLoading,
    data: answers,
    refetch: refetchAnswers,
  } = useQuery({
    queryKey: ["userAnswers", user?.id],
    queryFn: () => getUserAnswers(user?.id),
    enabled: !!user?.id, // Only run if user exists
  });

  // Determine user type based on current state
  const isBot = AnonymousDataService.isBotUser();
  const isAnonymous = AnonymousDataService.isAnonymousUser();

  // Handle different user types
  if (isBot) {
    return {
      isLoading: false,
      user: null,
      answers: null,
      isAuthenticated: false,
      userType: 'bot',
      refetchUser: () => Promise.resolve(),
      refetchAnswers: () => Promise.resolve(),
    };
  }

  if (isAnonymous && !user) {
    // For anonymous users, get data from localStorage
    const anonymousAnswers = AnonymousDataService.getUserAnswers();
    
    return {
      isLoading: false,
      user: null,
      answers: anonymousAnswers,
      isAuthenticated: false,
      userType: 'anonymous',
      refetchUser: () => Promise.resolve(),
      refetchAnswers: () => {
        // Refresh anonymous data from localStorage
        return Promise.resolve(AnonymousDataService.getUserAnswers());
      },
    };
  }

  // For authenticated users or users still loading
  return {
    isLoading: isUserLoading || isAnswersLoading,
    user,
    answers,
    isAuthenticated: user?.role === "authenticated",
    userType: user ? 'authenticated' : (isUserLoading ? 'loading' : 'new_visitor'),
    refetchUser,
    refetchAnswers,
  };
}