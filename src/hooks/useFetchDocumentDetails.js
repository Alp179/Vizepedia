import { useQuery } from "@tanstack/react-query";
import { fetchDocumentDetails } from "../utils/documentFetch";

export function useFetchDocumentDetails(docName) {
  return useQuery({
    queryKey: ["documentDetails", docName],
    queryFn: () => fetchDocumentDetails(docName),
    enabled: !!docName && docName.length > 0,
    // enabled: documentNames.length > 0 şeklinde de kullanılabilir, documentNames'in her zaman tanımlı olduğundan emin olun.
  });
}
