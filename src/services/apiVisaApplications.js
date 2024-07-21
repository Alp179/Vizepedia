import supabase from "./supabase";

export const fetchFirmLocation = async (country) => {
  const { data, error } = await supabase
    .from("visa_firm_locations")
    .select("firm_name, firmAdress")
    .eq("country", country)
    .single();

  if (error) {
    console.error("Error fetching firm location:", error);
    return null;
  }

  return data;
};
