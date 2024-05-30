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
  background: var(--color-grey-51);
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
  background: var(--color-grey-51);
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
  gap: 16px;
  padding: 20px;
  background: var(--color-grey-51);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 680px) {
    margin-left: 0;
    padding: 15px;
  }
`;

const DocumentTitle = styled.h1`
  font-size: 35px;
  text-align: center;
  font-weight: bold;
  color: var(--color-grey-52);

  @media (max-width: 1000px) {
    font-size: 24px;
  }

  @media (max-width: 680px) {
    margin-top: 10px;
    font-size: 20px;
    text-align: center;
  }
`;

const DocumentDescription = styled.p`
  margin-top: 20px;
  color: var(--color-grey-53);
  font-size: 18px;

  @media (max-width: 1000px) {
    font-size: 16px;
  }

  @media (max-width: 680px) {
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
  }
`;

const DocumentMeta = styled.p`
  margin-top: 10px;
  color: var(--color-grey-53);

  @media (max-width: 680px) {
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
  }
`;

const ImageText = styled.p`
  color: var(--color-grey-52);
  font-weight: bold;
`;

const SourceButton = styled.button`
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
  padding: 15px 20px;
  background-color: #004466;
  color: #00ffa2;
  border: 5px solid #00ffa2;
  border-radius: 16px;
  width: 150px;
  &:hover {
    background-color: #00ffa2;
    color: #004466;
  }
  @media (max-width: 680px) {
    font-size: 14px;
    padding: 10px 15px;
    margin-left: auto;
    margin-right: auto;
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
  margin-left: auto;
  font-weight: bold;
  margin-right: auto;
  width: 200px;

  &:hover {
    background-color: ${(props) => (props.isCompleted ? "#c0392b" : "#27ae60")};
  }

  @media (max-width: 680px) {
    width: 200px;
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
  text-align: center;

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
        <DocumentMeta>
          Tahmini Tamamlama Süresi: {selectedDocument.estimatedCompletionTime}
        </DocumentMeta>
        <DocumentTitle>{selectedDocument.docName}</DocumentTitle>
        <DocumentDescription>
          {selectedDocument.docDescription}
        </DocumentDescription>
        <SourceButton>Bağlantı {selectedDocument.docSource}</SourceButton>

        <RelatedSteps>
          <RelatedStepsTitle>
            Bu Belge ile Bağlantılı İşlemler
          </RelatedStepsTitle>
          <ul>
            {selectedDocument.relatedSteps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </RelatedSteps>
        <ActionButton onClick={handleAction} isCompleted={isCompleted}>
          {isCompleted ? "Tamamlandı" : "Tamamla"}
        </ActionButton>
      </InfoContainer>
      <ImageContainer>
        <ImageText>Belge Örneği</ImageText>
        <DocumentImage
          src={selectedDocument.docImage}
          alt={selectedDocument.docName}
        />
        <ImageText>
          Temin Yeri:
        </ImageText>
        <ImageText>
          Tür: 
        </ImageText>
      </ImageContainer>
    </PageContainer>
  );
};

export default DocumentDetail;
