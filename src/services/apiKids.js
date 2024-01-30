import supabase from "./supabase";

export async function getKids() {
  const { data: kidStateData, error } = await supabase
    .from("travelWithKid")
    .select("kidState, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return kidStateData;
}
