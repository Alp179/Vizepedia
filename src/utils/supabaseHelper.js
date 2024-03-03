import { supabase } from "./supabaseClient"; // Supabase client'ınızın yolu farklı olabilir

export async function saveUserSelections(
  country,
  purpose,
  profession,
  vehicle,
  kid,
  accommodation
) {
  const user = supabase.auth.user();

  if (!user) {
    console.error("Kullanıcı girişi yapılmamış!");
    return;
  }

  const { error } = await supabase.from("userAnswers").upsert({
    id: user.id, // Supabase Auth ile ilişkilendirilmiş kullanıcı ID'si
    ans_country: country,
    ans_purpose: purpose,
    ans_profession: profession,
    ans_vehicle: vehicle,
    ans_kid: kid,
    ans_accommodation: accommodation,
  });

  if (error) {
    console.error("Seçimler kaydedilirken hata oluştu:", error);
  } else {
    console.log("Kullanıcı seçimleri başarıyla kaydedildi.");
  }
}
