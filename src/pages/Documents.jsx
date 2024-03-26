import styled from "styled-components";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { useDocuments } from "../context/DocumentsContext"; // Context'i kullanma
import Spinner from "../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { completeDocument } from "../utils/supabaseActions";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
`;

const Header = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
`;

const DocumentContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const DocumentInfo = styled.div`
  flex: 1;
  padding: 20px;
`;

const DocumentImage = styled.img`
  max-width: 50%;
  height: auto;
`;

const RelatedSteps = styled.div`
  background-color: #e0e0e0;
  padding: 10px;
  margin-top: 20px;
`;

const CompleteButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
`;

const DocumentDetail = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { selectedDocument, setSelectedDocument } = useSelectedDocument();
  const { dispatch } = useDocuments(); // useContext yerine useDocuments hook'unu kullan

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const handleComplete = async () => {
    if (userId && selectedDocument) {
      try {
        await completeDocument(userId, selectedDocument.docName); // Parametre sırasını doğru kullanın
        dispatch({
          type: "COMPLETE_DOCUMENT",
          payload: selectedDocument.docName,
        });
        setSelectedDocument(null);
        navigate("/dashboard");
      } catch (error) {
        console.error("Error completing document:", error);
      }
    }
  };

  if (!selectedDocument) {
    return <Spinner />;
  }

  const {
    docName,
    docType,
    estimatedCompletionTime,
    docDescription,
    docSource,
    relatedSteps,
    docImage,
    docSourceLink,
  } = selectedDocument;

  return (
    <PageContainer>
      <Header>
        <h1>{docName}</h1>
        <p>{docType}</p>
        <p>Estimated Completion Time: {estimatedCompletionTime}</p>
      </Header>
      <DocumentContainer>
        <DocumentInfo>
          <p>{docDescription}</p>
          <p>Source: {docSource}</p>
          {docSourceLink && (
            <a href={docSourceLink} target="_blank" rel="noopener noreferrer">
              Source Link
            </a>
          )}
        </DocumentInfo>
        <DocumentImage src={docImage} alt={docName} />
      </DocumentContainer>
      <RelatedSteps>
        <h3>Related Steps</h3>
        <ul>
          {relatedSteps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </RelatedSteps>
      <CompleteButton onClick={handleComplete}>Tamamla</CompleteButton>
    </PageContainer>
  );
};

export default DocumentDetail;
