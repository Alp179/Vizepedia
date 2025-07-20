// utils/userSelectionsFetch.js - SAFE updates preserving existing functionality
import supabase from "../services/supabase";
import { AnonymousDataService } from "./anonymousDataService";

// Helper to detect if user is anonymous
function isAnonymousUser(userId) {
  return userId === "anonymous" || AnonymousDataService.isAnonymousUser();
}

// PRESERVED: Original functionality with minimal changes
export async function fetchUserSelectionsNav(userId) {
  // Handle anonymous users
  if (isAnonymousUser(userId)) {
    const answers = AnonymousDataService.getUserAnswers();
    return answers || [];
  }

  // PRESERVED: Original authenticated user logic
  const { data, error } = await supabase
    .from("userAnswers")
    .select(
      "id, created_at, ans_country, ans_purpose, ans_profession, ans_vehicle, ans_kid, ans_accommodation, ans_hassponsor, ans_sponsor_profession, has_appointment, has_filled_form"
    )
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching user selections:", error);
    return [];
  }

  return data.map((item) => ({
    ...item,
    created_at: item.created_at
      ? new Date(item.created_at).toISOString()
      : null,
  }));
}

// PRESERVED: Original functionality with enhanced logging
export async function fetchUserSelectionsDash(userId, applicationId) {
  console.log("📋 fetchUserSelectionsDash called:", { userId, applicationId });

  // Handle anonymous users
  if (
    isAnonymousUser(userId) ||
    applicationId?.startsWith("anonymous-") ||
    applicationId?.startsWith("demo-")
  ) {
    console.log("👤 Fetching anonymous user data");
    const answers = AnonymousDataService.convertToSupabaseFormat();
    console.log("Anonymous answers:", answers);
    return answers || [];
  }

  // PRESERVED: Original authenticated user logic with enhanced error handling
  try {
    console.log("🔍 Fetching authenticated user data from Supabase");
    const { data, error } = await supabase
      .from("userAnswers")
      .select(
        "id, created_at, ans_country, ans_purpose, ans_profession, ans_vehicle, ans_kid, ans_accommodation, ans_hassponsor, ans_sponsor_profession, has_appointment, has_filled_form"
      )
      .eq("userId", userId)
      .eq("id", applicationId);

    if (error) {
      console.error("Error fetching user selections:", error);
      return [];
    }

    const result = data.map((item) => ({
      ...item,
      created_at: item.created_at
        ? new Date(item.created_at).toISOString()
        : null,
    }));

    console.log("✅ Supabase data fetched:", result);
    return result;
  } catch (error) {
    console.error("Unexpected error in fetchUserSelectionsDash:", error);
    return [];
  }
}

// PRESERVED: Original functionality with enhanced logging
export async function fetchLatestApplication(userId) {
  console.log("🎯 fetchLatestApplication called for:", userId);

  // Handle anonymous users
  if (isAnonymousUser(userId)) {
    console.log("👤 Anonymous user - checking local data");
    const applicationId = AnonymousDataService.getApplicationId();
    const answers = AnonymousDataService.getUserAnswers(applicationId);
    return answers && answers.length > 0 ? answers[0] : null;
  }

  // PRESERVED: Original authenticated user logic
  try {
    console.log("🔍 Fetching latest application from Supabase");
    const { data, error } = await supabase
      .from("userAnswers")
      .select(
        "id, created_at, ans_country, ans_purpose, ans_profession, ans_vehicle, ans_kid, ans_accommodation, ans_hassponsor, ans_sponsor_profession, has_appointment, has_filled_form"
      )
      .eq("userId", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching latest application:", error);
      return null;
    }

    const result =
      data.length > 0
        ? {
            ...data[0],
            created_at: data[0].created_at
              ? new Date(data[0].created_at).toISOString()
              : null,
          }
        : null;

    console.log("✅ Latest application:", result);
    return result;
  } catch (error) {
    console.error("Unexpected error in fetchLatestApplication:", error);
    return null;
  }
}

// NEW: Helper functions for the new static dashboard feature (ADDITIVE, not replacing)
export function shouldShowStaticContent(userType, hasCompletedOnboarding) {
  // Show static content for: bots, new visitors, or users without completed onboarding
  return (
    userType === "bot" || userType === "new_visitor" || !hasCompletedOnboarding
  );
}

export function canAccessFullDashboard(userType, hasCompletedOnboarding) {
  // Full dashboard access for: authenticated users OR anonymous users with completed onboarding
  return (
    (userType === "authenticated" || userType === "anonymous") &&
    hasCompletedOnboarding
  );
}
