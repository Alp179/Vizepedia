// utils/userSelectionsFetch.js - SAFE updates preserving existing functionality
import supabase from "../services/supabase";
import { AnonymousDataService } from "./anonymousDataService";

// Helper to detect if user is anonymous
function isAnonymousUser(userId) {
  return userId === 'anonymous' || AnonymousDataService.isAnonymousUser();
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
// userSelectionsFetch.js - fetchUserSelectionsDash fonksiyonunu değiştirin:

export const fetchUserSelectionsDash = async (userId, applicationId) => {
  console.log("📋 fetchUserSelectionsDash called:", { userId, applicationId });

  if (!userId) {
    console.log("❌ No userId provided");
    return [];
  }

  try {
    console.log("🔍 Fetching authenticated user data from Supabase");

    let query = supabase
      .from("userAnswers")
      .select(`
        id,
        created_at,
        ans_country,
        ans_purpose,
        ans_profession,
        ans_vehicle,
        ans_kid,
        ans_accommodation,
        ans_hassponsor,
        ans_sponsor_profession,
        has_appointment,
        has_filled_form
      `)
      .eq("userId", userId);

    // CRITICAL FIX: Never use anonymous applicationId for authenticated users
    if (applicationId && 
        applicationId !== "undefined" && 
        !applicationId.startsWith("anonymous-")) {
      console.log("🔍 Adding applicationId filter:", applicationId);
      query = query.eq("id", applicationId);
    } else if (applicationId && applicationId.startsWith("anonymous-")) {
      console.log("⚠️ Anonymous applicationId detected for authenticated user - fetching all applications");
      // Don't add applicationId filter, fetch all user applications
      query = query.order("created_at", { ascending: false });
    } else {
      console.log("⚠️ No valid applicationId provided, fetching all user applications");
      // Order by created_at to get the most recent application
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Supabase query error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.log("⚠️ No user selections found");
      return [];
    }

    console.log("✅ User selections found:", data.length, "applications");
    console.log("First application ID:", data[0]?.id);
    return data;

  } catch (error) {
    console.error("❌ Error in fetchUserSelectionsDash:", error);
    throw error;
  }
};

// PRESERVED: Original functionality with enhanced logging
export async function fetchLatestApplication(userId) {
  console.log('🎯 fetchLatestApplication called for:', userId);
  
  // Handle anonymous users
  if (isAnonymousUser(userId)) {
    console.log('👤 Anonymous user - checking local data');
    const applicationId = AnonymousDataService.getApplicationId();
    const answers = AnonymousDataService.getUserAnswers(applicationId);
    return answers && answers.length > 0 ? answers[0] : null;
  }

  // PRESERVED: Original authenticated user logic
  try {
    console.log('🔍 Fetching latest application from Supabase');
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

    const result = data.length > 0
      ? {
          ...data[0],
          created_at: data[0].created_at
            ? new Date(data[0].created_at).toISOString()
            : null,
        }
      : null;
    
    console.log('✅ Latest application:', result);
    return result;
  } catch (error) {
    console.error("Unexpected error in fetchLatestApplication:", error);
    return null;
  }
}

// NEW: Helper functions for the new static dashboard feature (ADDITIVE, not replacing)
export function shouldShowStaticContent(userType, hasCompletedOnboarding) {
  // Show static content for: bots, new visitors, or users without completed onboarding
  return userType === 'bot' || 
         userType === 'new_visitor' || 
         !hasCompletedOnboarding;
}

export function canAccessFullDashboard(userType, hasCompletedOnboarding) {
  // Full dashboard access for: authenticated users OR anonymous users with completed onboarding
  return (userType === 'authenticated' || userType === 'anonymous') && hasCompletedOnboarding;
}