import supabase from "../services/supabase";

export async function fetchVisaFirmLocations(countryName) {
  const { data, error } = await supabase
    .from("visa_firm_locations")
    .select("firm_latitude, firm_longitude, firm_name")
    .eq("country", countryName);

  if (error) {
    console.error("Error fetching visa firm locations:", error);
    return null;
  }

  return data;
}
