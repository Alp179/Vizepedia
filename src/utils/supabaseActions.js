import supabase from "../services/supabase";

export async function completeDocument(userId, documentName, applicationId) {
  const { data, error } = await supabase.from("completed_documents").insert([
    {
      userId,
      document_name: documentName,
      completion_date: new Date(),
      status: true,
      application_id: applicationId,
    },
  ]);

  if (error) {
    console.error("Error completing document:", error);
    return { error };
  }

  return { data };
}

export async function fetchCompletedDocuments(userId, applicationId) {
  const { data, error } = await supabase
    .from("completed_documents")
    .select("*")
    .eq("userId", userId)
    .eq("application_id", applicationId); // Application ID'ye göre filtreleme

  if (error) {
    console.error("Error fetching completed documents:", error);
    return { error };
  }

  return data;
}

export async function uncompleteDocument(userId, documentName, applicationId) {
  const { data, error } = await supabase
    .from("completed_documents")
    .delete()
    .match({
      userId,
      document_name: documentName,
      application_id: applicationId,
    }); // Application ID ile eşleştirme

  if (error) {
    console.error("Error uncompleting document:", error);
    return { error };
  }

  return { data };
}
