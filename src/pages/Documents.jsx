import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser } from "../services/apiAuth";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { DocumentsContext } from "../context/DocumentsContext";
import { completeDocument, uncompleteDocument } from "../utils/supabaseActions";
import Spinner from "../ui/Spinner";

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #71b7e6, #9b59b6);
  border-radius: 20px;
  box-sizing: border-box;

  @media (max-width: 680px) {
    flex-direction: column;
    padding: 10px;
    height: 100%;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 30px;
  background: white;
  border-radius: 15px;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 680px) {
    padding: 15px;
    margin-bottom: 20px;
  }
`;

const ImageContainer = styled.div`
  flex: 0.4;
  padding: 20px;
  background: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 680px) {
    margin-left: 0;
    padding: 15px;
  }
`;

const DocumentTitle = styled.h1`
  font-size: 24px;
  color: #333;

  @media (max-width: 680px) {
    font-size: 20px;
    text-align: center;
  }
`;

const DocumentDescription = styled.p`
  margin-top: 20px;
  color: #333;

  @media (max-width: 680px) {
    margin-top: 10px;
    text-align: center;
  }
`;

const DocumentMeta = styled.p`
  margin-top: 10px;
  color: #555;

  @media (max-width: 680px) {
    margin-top: 5px;
    text-align: center;
  }
`;

const ActionButton = styled.button`
  padding: 15px 25px;
  background-color: ${(props) => (props.isCompleted ? "#e74c3c" : "#2ecc71")};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isCompleted ? "#c0392b" : "#27ae60")};
  }

  @media (max-width: 680px) {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    margin-top: 15px;
  }
`;

const DocumentImage = styled.img`
  max-width: 100%;
  height: auto;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
`;

const RelatedSteps = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
  color: #333;

  @media (max-width: 680px) {
    padding: 15px;
  }
`;

const RelatedStepsTitle = styled.h3`
  margin-bottom: 10px;

  @media (max-width: 680px) {
    text-align: center;
  }
`;

const DocumentDetail = () => {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { selectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const isCompleted =
    completedDocuments[applicationId]?.[selectedDocument?.docName];

  const handleAction = async () => {
    if (!userId || !selectedDocument || !applicationId) return;

    try {
      if (isCompleted) {
        await uncompleteDocument(
          userId,
          selectedDocument.docName,
          applicationId
        );
        dispatch({
          type: "UNCOMPLETE_DOCUMENT",
          payload: { documentName: selectedDocument.docName, applicationId },
        });
      } else {
        await completeDocument(userId, selectedDocument.docName, applicationId);
        dispatch({
          type: "COMPLETE_DOCUMENT",
          payload: { documentName: selectedDocument.docName, applicationId },
        });
      }
      navigate(`/dashboard/${applicationId}`);
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  if (!selectedDocument) {
    return <Spinner />;
  }

  return (
    <PageContainer>
      <InfoContainer>
        <DocumentTitle>{selectedDocument.docName}</DocumentTitle>
        <DocumentDescription>{selectedDocument.docDescription}</DocumentDescription>
        <DocumentMeta>Source: {selectedDocument.docSource}</DocumentMeta>
        <ActionButton onClick={handleAction} isCompleted={isCompleted}>
          {isCompleted ? "Tamamlandı" : "Tamamla"}
        </ActionButton>
        <RelatedSteps>
          <RelatedStepsTitle>Bu Belge ile Bağlantılı İşlemler</RelatedStepsTitle>
          <ul>
            {selectedDocument.relatedSteps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </RelatedSteps>
      </InfoContainer>
      <ImageContainer>
        <DocumentImage src={selectedDocument.docImage} alt={selectedDocument.docName} />
        <DocumentMeta>Estimated Completion Time: {selectedDocument.estimatedCompletionTime}</DocumentMeta>
      </ImageContainer>
    </PageContainer>
  );
};

export default DocumentDetail;
