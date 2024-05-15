import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import { getCurrentUser } from "../services/apiAuth";

import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { DocumentsContext } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";

const ReviewButton = styled.button`
  padding: 10px 15px;
  margin-top: 10px;
  background-color: #004466;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const VerifiedIcon = styled.img`
  width: 70px;
  height: 70px;
  position: absolute;
  top: 14px;
  right: 22px;
`;

const DocumentCard = styled.div`
  background: ${(props) => (props.isCompleted ? "#87F9CD" : "#fafafa")};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
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
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

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
    queryKey: ["userSelectionsSum", userId, applicationId],
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
    queryKey: ["documentDetailsSum", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  if (isLoadingSelections || isLoadingDocuments) {
    return <Spinner />;
  }

  if (isErrorSelections || isErrorDocuments) {
    return <div>Error loading data.</div>;
  }

  const handleReview = (document) => {
    setSelectedDocument(document);
    navigate(`/documents/${applicationId}`);
  };

  return (
    <div>
      {documents?.map((document) => (
        <DocumentCard
          key={document.id}
          isCompleted={completedDocuments[applicationId]?.[document.docName]}
        >
          {completedDocuments[applicationId]?.[document.docName] && (
            <VerifiedIcon
              src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/patato/Untitled.png"
              alt="Verified"
            />
          )}
          <DocumentTitle>{document.docName}</DocumentTitle>
          <DocumentMeta>
            Type: {document.docType || "Not specified"}
          </DocumentMeta>
          <DocumentMeta>
            Estimated Completion Time:
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
