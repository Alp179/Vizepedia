import supabase from "./supabase";

export async function getAccommodations() {
  const { data: accommodationTypeNameData, error } = await supabase
    .from("accommodationType")
    .select("accommodationTypeName, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return accommodationTypeNameData;
}
