import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/apiAuth";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { DocumentsContext } from "../context/DocumentsContext";

import { completeDocument, uncompleteDocument } from "../utils/supabaseActions";
import Spinner from "../ui/Spinner";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
  height: 100vh;
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

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  position: relative;
  transition: background-color 0.3s ease;

  & span {
    transition: opacity 0.15s ease;
  }

  &:hover {
    background-color: #43a047;
  }

  &:hover span {
    opacity: ${(props) => (props.isCompleted ? 0 : 1)};
  }

  &:hover::after {
    content: "${(props) => (props.isCompleted ? "Geri al" : "")}";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: ${(props) => (props.isCompleted ? 1 : 0)};
    transition: opacity 0.3s ease 0.9s;
  }
`;

const DocumentDetail = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { selectedDocument } = useSelectedDocument();
  const { state: completedDocuments, dispatch } = useContext(DocumentsContext);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const isCompleted = completedDocuments[selectedDocument?.docName];

  const handleAction = async () => {
    if (!userId || !selectedDocument) return;

    try {
      if (isCompleted) {
        await uncompleteDocument(userId, selectedDocument.docName);
        dispatch({
          type: "UNCOMPLETE_DOCUMENT",
          payload: selectedDocument.docName,
        });
      } else {
        await completeDocument(userId, selectedDocument.docName);
        dispatch({
          type: "COMPLETE_DOCUMENT",
          payload: selectedDocument.docName,
        });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  if (!selectedDocument) {
    return <Spinner />;
  }

  return (
    <PageContainer>
      <Header>
        <h1>{selectedDocument.docName}</h1>
        <p>{selectedDocument.docType}</p>
        <p>
          Estimated Completion Time: {selectedDocument.estimatedCompletionTime}
        </p>
      </Header>
      <DocumentContainer>
        <DocumentInfo>
          <p>{selectedDocument.docDescription}</p>
          <p>Source: {selectedDocument.docSource}</p>
        </DocumentInfo>
        <DocumentImage
          src={selectedDocument.docImage}
          alt={selectedDocument.docName}
        />
      </DocumentContainer>
      <RelatedSteps>
        <h3>Related Steps</h3>
        <ul>
          {selectedDocument.relatedSteps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </RelatedSteps>
      <ActionButton onClick={handleAction} isCompleted={isCompleted}>
        <span>{isCompleted ? "Tamamlandı" : "Tamamla"}</span>
      </ActionButton>
    </PageContainer>
  );
};

export default DocumentDetail;
