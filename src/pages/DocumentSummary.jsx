import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import { getCurrentUser } from "../services/apiAuth";

import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { DocumentsContext } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import { fetchUserSelections } from "../utils/userSelectionsFetch";

const ReviewButton = styled.button`
  padding: 10px 15px;
  margin-top: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const DocumentCard = styled.div`
  background: ${(props) => (props.isCompleted ? "#e0f2e9" : "#f9f9f9")};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DocumentTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const DocumentMeta = styled.p`
  margin: 5px 0;
`;

const DocumentSummary = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { setSelectedDocument } = useSelectedDocument();
  const { state: completedDocuments, dispatch } = useContext(DocumentsContext);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
        fetchCompletedDocuments(user.id).then((data) => {
          const completedDocsMap = data.reduce((acc, doc) => {
            acc[doc.document_name] = true;
            return acc;
          }, {});
          dispatch({
            type: "SET_COMPLETED_DOCUMENTS",
            payload: completedDocsMap,
          });
        });
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

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery({
    queryKey: ["documentDetails", userSelections],
    queryFn: () =>
      fetchDocumentDetails(getDocumentsForSelections(userSelections)),
    enabled: !!userSelections,
  });

  if (isLoadingSelections || isLoadingDocuments) {
    return <Spinner />;
  }

  if (isErrorSelections || isErrorDocuments) {
    return <div>Error loading data.</div>;
  }

  const handleReview = (document) => {
    setSelectedDocument(document);
    navigate("/documents");
  };

  return (
    <div>
      {documents?.map((document) => (
        <DocumentCard
          key={document.id}
          isCompleted={completedDocuments[document.docName]}
        >
          <DocumentTitle>{document.docName}</DocumentTitle>
          <DocumentMeta>
            Type: {document.docType || "Not specified"}
          </DocumentMeta>

          <DocumentMeta>
            Estimated Completion Time:{" "}
            {document.estimatedCompletionTime || "Unknown"}
          </DocumentMeta>
          <ReviewButton onClick={() => handleReview(document)}>
            İncele
          </ReviewButton>
        </DocumentCard>
      ))}
    </div>
  );
};

export default DocumentSummary;
