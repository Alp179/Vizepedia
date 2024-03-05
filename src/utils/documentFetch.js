// documentsFetch.js

import supabase from "../services/supabase";

export async function fetchDocumentDetails(documentNames) {
  // documentNames boş ise, boş bir liste döndür
  if (!documentNames || documentNames.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .in("docName", documentNames); // 'docName', belge isimlerini tuttuğunuz sütunun adı

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
