import supabase from "./supabase";

export async function getProfessions() {
  const { data: professionName, error } = await supabase
    .from("profession")
    .select("professionName, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return professionName;
}
