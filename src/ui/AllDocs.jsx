import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import styled from "styled-components";
import { useDocuments } from "../context/DocumentsContext";
import Spinner from "./Spinner";
import { fetchCompletedDocuments } from "../utils/supabaseActions";

const DocumentItem = styled.li`
  border-radius: 16px;
  background-color: ${(props) => (props.isCompleted ? "#00ffa2" : "none")};
  padding: 8px;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isCompleted ? "#cde0d9" : "#f0f0f0")};
  }
`;

const ScrollableDiv = styled.div`
  padding: 8px 0;
  overflow-y: auto;
  height: calc(100vh - 370px); /* You can adjust this height as needed */
  width: 100%;
  margin: 0 auto;
  @media (max-height: 770px) {
    height: 380px;
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-brand-600);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
`;

function AllDocs() {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useDocuments();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
        fetchCompletedDocuments(user.id, applicationId).then((data) => {
          const completedDocsMap = data.reduce((acc, doc) => {
            if (!acc[applicationId]) {
              acc[applicationId] = {};
            }
            acc[applicationId][doc.document_name] = true;
            return acc;
          }, {});
          dispatch({
            type: "SET_COMPLETED_DOCUMENTS",
            payload: completedDocsMap,
          });
        });
      }
    });
  }, [applicationId, dispatch]);

  const {
    data: userSelections,
    isLoading: isLoadingSelections,
    isError: isErrorSelections,
  } = useQuery({
    queryKey: ["userSelectionsAllDocs", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery({
    queryKey: ["documentDetailsAllDocs", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  if (isLoadingSelections || isLoadingDocuments) {
    return <Spinner />;
  }

  if (isErrorSelections || isErrorDocuments) {
    return <div>Error loading data.</div>;
  }

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    navigate(`/documents/${applicationId}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", zIndex: "3000" }}>
      <h2>Tüm Belgeler</h2>
      <div>Başvurunuzda gerekli olan tüm belgeler</div>

      <ScrollableDiv>
        {documents?.map((document) => (
          <DocumentItem
            key={document.id}
            isCompleted={
              completedDocuments[applicationId]?.[document.docName]
            }
            onClick={() => handleDocumentClick(document)}
          >
            {document.docName}
          </DocumentItem>
        ))}
      </ScrollableDiv>
    </div>
  );
}

export default AllDocs;
