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
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <h2>Tüm Belgeler</h2>
      <div>Başvurunuzda gerekli olan tüm belgeler</div>
      <ul>
        {documents?.map((document) => (
          <DocumentItem
            key={document.id}
            isCompleted={completedDocuments[applicationId]?.[document.docName]}
            onClick={() => handleDocumentClick(document)}
          >
            {document.docName}
          </DocumentItem>
        ))}
      </ul>
    </div>
  );
}

export default AllDocs;
