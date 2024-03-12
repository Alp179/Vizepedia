import styled from "styled-components";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import Spinner from "../ui/Spinner";

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

const DocumentDetail = () => {
  const { selectedDocument } = useSelectedDocument();

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
    </PageContainer>
  );
};

export default DocumentDetail;
