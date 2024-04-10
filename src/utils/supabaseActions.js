import supabase from "../services/supabase";

export async function completeDocument(userId, documentName) {
  const { data, error } = await supabase.from("completed_documents").insert([
    {
      userId: userId,
      document_name: documentName,
      completion_date: new Date(),
      status: true,
    },
  ]);

  if (error) {
    console.error("Error completing document:", error);
    return { error };
  }

  return { data };
}

export async function fetchCompletedDocuments(userId) {
  const { data, error } = await supabase
    .from("completed_documents")
    .select("*")
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching completed documents:", error);
    return { error };
  }

  return data;
}

// Belgeyi tamamlanmamış olarak işaretleme fonksiyonu
export async function uncompleteDocument(userId, documentName) {
  const { data, error } = await supabase
    .from("completed_documents")
    .delete()
    .match({ userId, document_name: documentName });

  if (error) {
    console.error("Error uncompleting document:", error);
    return { error };
  }

  return { data };
}
