import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelections } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "./Spinner";

function DocumentsPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const {
    data: userSelections,
    isLoading: isLoadingSelections,
    isError: isErrorSelections,
  } = useQuery({
    queryKey: ["userSelections", userId],
    queryFn: () => fetchUserSelections(userId),
    enabled: !!userId,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  if (isLoadingSelections || isLoadingDocuments) {
    return <Spinner />;
  }

  if (isErrorSelections || isErrorDocuments) {
    return <div>Error loading data.</div>;
  }

  return (
    <div>
      <h2>Tüm Belgeler</h2>
      <ul>
        {documents?.map((doc, index) => (
          <li key={index}>{doc.docName}</li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentsPage;
