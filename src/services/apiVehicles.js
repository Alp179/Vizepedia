import supabase from "./supabase";

export async function getVehicles() {
  const { data: travelVehicleNameData, error } = await supabase
    .from("travelVehicle")
    .select("travelVehicleName, id"); // Sütun adları "schCountryNames, id" olarak düzeltilmeli

  if (error) {
    throw new Error(error.message);
  }

  return travelVehicleNameData;
}
