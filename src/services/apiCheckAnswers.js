import supabase from "./supabase";

export async function getUserAnswers(userId) {
  const { data: answers, error } = await supabase
    .from("userAnswers")
    .select("answer")
    .eq("userId", userId);

  if (error) {
    throw new Error(error.message);
  }

  return answers;
}
