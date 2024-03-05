import { useQuery } from "@tanstack/react-query";
import { fetchDocumentDetails } from "../utils/documentFetch";

export function useFetchDocumentDetails(documentNames) {
  return useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames && documentNames.length > 0,
    // enabled: documentNames.length > 0 şeklinde de kullanılabilir, documentNames'in her zaman tanımlı olduğundan emin olun.
  });
}
