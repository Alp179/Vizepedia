import styled from "styled-components";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import Spinner from "../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DocumentsContext } from "../context/DocumentsContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
`;

const Header = styled.div`
  background-color: #f5f5f5; /* Header arka plan rengi */
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
  background-color: #e0e0e0; /* İlgili adımların arka plan rengi */
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
  const navigate = useNavigate(); // Hook for navigating
  const { selectedDocument, setSelectedDocument } = useSelectedDocument();
  const { dispatch } = useContext(DocumentsContext); // Assuming you dispatch actions to your context

  if (!selectedDocument) {
    return <Spinner />;
  }

  const handleComplete = () => {
    // Seçili belgeyi tamamlanmış olarak işaretle
    dispatch({ type: "COMPLETE_DOCUMENT", payload: selectedDocument.docName });
    // Seçili belgeyi temizle
    setSelectedDocument(null);
    // Kullanıcıyı dashboard'a yönlendir
    navigate("/dashboard");
  };

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
