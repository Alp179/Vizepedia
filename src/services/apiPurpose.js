import supabase from "./supabase";

export async function getPurposeReg() {
  const { data: purposeRegulars, error } = await supabase
    .from("purposeRegulars")
    .select("purposeRegDescription, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return purposeRegulars;
}

export async function getPurposeEd() {
  const { data: purposeEducation, error } = await supabase
    .from("purposeEd")
    .select("purposeEdDescription, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return purposeEducation;
}

export async function getPurposeOth() {
  const { data: purposeOther, error } = await supabase
    .from("purposeOth")
    .select("purposeOthDescription, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return purposeOther;
}
