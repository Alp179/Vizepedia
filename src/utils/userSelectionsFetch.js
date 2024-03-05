import supabase from "../services/supabase";

// Kullanıcının seçimlerini çeken fonksiyon
export async function fetchUserSelections(userId) {
  const { data, error } = await supabase
    .from("userAnswers")
    .select("*")
    .eq("userId", userId)
    .single(); // Varsayılan olarak bir kullanıcının tek bir seçim seti olduğunu varsayıyoruz

  if (error) {
    console.error("Error fetching user selections:", error);
    return null;
  }

  return data;
}
