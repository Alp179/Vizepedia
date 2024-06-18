import { useEffect, useState, useContext } from "react";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import styled, { css } from "styled-components";
import { useDocuments } from "../context/DocumentsContext";
import Spinner from "./Spinner";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import { DarkModeContext } from "../context/DarkModeContext"; // DarkModeContext'i import et

const DocumentItem = styled.li`
  border-radius: 16px;
  background-color: ${(props) => (props.isCompleted ? "#00ffa2" : "none")};
  padding: 8px;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isCompleted ? "#cde0d9" : "#f0f0f0")};
  }

  ${({ darkMode }) =>
    darkMode &&
    css`
      background-color: ${(props) => (props.isCompleted ? "#005f2f" : "none")};
      &:hover {
        background-color: ${(props) =>
          props.isCompleted ? "#113322" : "#444444"};
      }
    `}
`;

const AllDocsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: ${({ darkMode }) => (darkMode ? "#222222" : "#ffffff")};
  color: ${({ darkMode }) => (darkMode ? "#ffffff" : "#000000")};
  padding: 20px;
  border-radius: 8px;
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
  const { isDarkMode } = useContext(DarkModeContext); // Dark mode bilgisini al

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
    <AllDocsContainer darkMode={isDarkMode}>
      <h2>Tüm Belgeler</h2>
      <div>Başvurunuzda gerekli olan tüm belgeler</div>
      <ul>
        {documents?.map((document) => (
          <DocumentItem
            key={document.id}
            isCompleted={completedDocuments[applicationId]?.[document.docName]}
            onClick={() => handleDocumentClick(document)}
            darkMode={isDarkMode}
          >
            {document.docName}
          </DocumentItem>
        ))}
      </ul>
    </AllDocsContainer>
  );
}

export default AllDocs;
