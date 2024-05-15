// fetchUserSelections fonksiyonunu düzenleyin
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
