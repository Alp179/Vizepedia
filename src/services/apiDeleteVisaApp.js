import supabase from "./supabase";

export const deleteVisaApplication = async (id) => {
  const { error: deleteAppError } = await supabase
    .from("userAnswers")
    .delete()
    .eq("id", id);

  if (deleteAppError) {
    throw new Error("Failed to delete visa application");
  }

  return true;
};
