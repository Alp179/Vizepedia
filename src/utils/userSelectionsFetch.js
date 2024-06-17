import supabase from "../services/supabase";

export async function fetchUserSelectionsNav(userId) {
  const { data, error } = await supabase
    .from("userAnswers")
    .select("*") // Tüm sütunları seç
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching user selections:", error);
    return [];
  }

  return data;
}

export async function fetchUserSelectionsDash(userId, applicationId) {
  const { data, error } = await supabase
    .from("userAnswers")
    .select("*") // Tüm sütunları seç
    .eq("userId", userId)
    .eq("id", applicationId);
  if (error) {
    console.error("Error fetching user selections:", error);
    return [];
  }

  return data;
}

export async function fetchLatestApplication(userId) {
  const { data, error } = await supabase
    .from("userAnswers")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest application:", error);
    return null;
  }

  return data.length > 0 ? data[0] : null;
}
