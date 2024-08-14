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
  margin-top: auto;
  padding: 12px 36px;
  justify-self: self-end;
  background-color: #004466;
  color: #87f9cd;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
  @media (max-width: 450px) {
    padding: 12px 24px;
  }
`;

const DocImage = styled.img`
  height: 45px;
  width: 36px;
`;

const VerifiedIcon = styled.img`
  margin-top: 10px;
  align-self: end;
  width: 50px;
  height: 50px;
`;

const DocumentCard = styled.div`
  background: ${(props) =>
    props.isCompleted ? "#87F9CD" : "rgba(255, 255, 255, 0.37)"};
  border-radius: 16px;
  -webkit-backdrop-filter: blur(6.3px);
  border: 1px solid rgba(255, 255, 255, 0.52);
  padding: 16px;
  margin-bottom: 10px;
  height: 180px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (max-width: 450px) {
    width: 100%;
  }
`;

const DocumentInner = styled.div`
  display: flex;
  justify-content: space-between;
  width: 95%;
  height: 100%;
  margin: 0 auto;
`;

const DocumentTitle = styled.h3`
  margin: 0;
  color: #004466;
  font-weight: bold;
  @media (max-width: 550px) {
    font-size: 16px;
  }
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
  @media (max-width: 450px) {
    gap: 2px;
  }
`;

const DocumentMeta = styled.p`
  color: black;
  margin: 0;
  @media (max-width: 550px) {
    font-size: 14px;
  }
  @media (max-width: 380px) {
    font-size: 12px;
  }
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
          <DocumentInner>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "90%",
                marginTop: "auto",
                gap: "12px"
              }}
            >
              <DocImage src="../public/Vector.png" />
              <MetaContainer>
                <DocumentTitle>{document.docName}</DocumentTitle>
                <DocumentMeta>
                  Tür: {document.docType || "Not specified"}
                </DocumentMeta>
                <DocumentMeta>
                  Tahmini Tamamlanma Süresi:{" "}
                  {document.estimatedCompletionTime || "Unknown"}
                </DocumentMeta>
              </MetaContainer>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                height: "100%",
              }}
            >
              {completedDocuments[applicationId]?.[document.docName] && (
                <VerifiedIcon
                  src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/patato/Untitled.png"
                  alt="Verified"
                />
              )}
              <ReviewButton onClick={() => handleReview(document)}>
                İncele
              </ReviewButton>
            </div>
          </DocumentInner>
        </DocumentCard>
      ))}
    </div>
  );
};

export default DocumentSummary;
