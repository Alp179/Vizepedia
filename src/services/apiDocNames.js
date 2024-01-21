import supabase from "./supabase";

export async function getDocNames() {
  const { data: docNames, error } = await supabase
    .from("documents")
    .select("docName", "id");

  if (error) {
    throw new Error(error.message);
  }

  return docNames;
}
