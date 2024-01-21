import supabase from "./supabase";

export async function getSchCountries() {
  const { data: schCountries, error } = await supabase
    .from("schCountries")
    .select("schCountryNames, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return schCountries;
}

export async function getMainCountries() {
  const { data: mainCountries, error } = await supabase
    .from("mainCountries")
    .select("mainCountryNames, id"); // Sütun adları "mainCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return mainCountries;
}
