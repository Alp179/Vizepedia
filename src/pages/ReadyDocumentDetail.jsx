import styled, { keyframes } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser } from "../services/apiAuth";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { DocumentsContext } from "../context/DocumentsContext";
import { completeDocument, uncompleteDocument } from "../utils/supabaseActions";
import Spinner from "../ui/Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import NavigationButtons from "../ui/NavigationButtons";
import ImageViewer from "../ui/ImageViewer";

// Animasyon tanımlamaları
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Tekrar kullanılabilir stiller
const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 25px;
  background: var(--color-grey-51);
  border-radius: 24px;
  box-sizing: border-box;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 680px) {
    flex-direction: column;
    padding: 16px;
    height: 100%;
  }
  @media (max-width: 450px) {
    width: 95%;
    margin: 0 auto;
    padding: 12px;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  @media (max-width: 680px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const DocumentTitle = styled.h1`
  font-size: 35px;
  font-weight: bold;
  color: var(--color-grey-52);
  margin-bottom: 16px;
  text-align: left;
  border-bottom: 3px solid #00ffa2;
  padding-bottom: 8px;
  display: inline-block;

  @media (max-width: 1000px) {
    font-size: 24px;
  }

  @media (max-width: 680px) {
    font-size: 20px;
    text-align: center;
    display: block;
  }
`;

const DocumentDescription = styled.p`
  margin-top: 20px;
  color: var(--color-grey-53);
  font-size: 18px;
  line-height: 1.6;
  background: rgba(0, 68, 102, 0.03);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #004466;

  @media (max-width: 680px) {
    font-size: 16px;
    text-align: center;
    padding: 12px;
  }
`;

const MetaTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 68, 102, 0.1);
  color: #004466;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  svg {
    margin-right: 5px;
    color: #00ffa2;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 25px;
  background-color: ${(props) => (props.isCompleted ? "#e74c3c" : "#2ecc71")};
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 25px;
  transition: background-color 0.3s ease;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  min-width: 200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) => (props.isCompleted ? "#c0392b" : "#27ae60")};
  }

  @media (max-width: 680px) {
    width: 100%;
    max-width: 200px;
    padding: 14px;
    font-size: 16px;
    margin: 20px auto 0;
  }
`;

const SourceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-top: 25px;
  padding: 15px 20px;
  background-color: #004466;
  color: white;
  border: 2px solid #00ffa2;
  border-radius: 16px;
  width: auto;
  min-width: 150px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: #00ffa2;
    transition: all 0.3s ease;
    z-index: 0;
  }

  &:hover:before {
    width: 100%;
  }

  svg {
    margin-right: 8px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    color: #004466;
  }

  @media (max-width: 680px) {
    font-size: 16px;
    padding: 12px 15px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

const ReadyDocumentDetail = () => {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const navigate = useNavigate();
  const { selectedDocument, setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

  const { data: userSelections } = useQuery({
    queryKey: ["userSelections", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const { data: documents, isSuccess: isDocumentsSuccess } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (isDocumentsSuccess && documents && !selectedDocument) {
      // Sadece "hazir" kategorisindeki belgeleri filtrele
      const readyDocuments = documents.filter(
        (doc) => doc.docStage === "hazir"
      );
      const initialDocument = readyDocuments[0];

      if (initialDocument) {
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    }
  }, [isDocumentsSuccess, documents, selectedDocument, setSelectedDocument]);

  useEffect(() => {
    if (selectedDocument && documents) {
      // Sadece "hazir" kategorisindeki belgeleri filtrele
      const readyDocuments = documents.filter(
        (doc) => doc.docStage === "hazir"
      );
      const index = readyDocuments.findIndex(
        (doc) => doc.docName === selectedDocument.docName
      );
      setCurrentDocumentIndex(index);
    }
  }, [selectedDocument, documents]);

  if (!selectedDocument) {
    return <Spinner />;
  }

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

  const handleNavigation = (direction) => {
    if (!documents) return;

    // Sadece "hazir" kategorisindeki belgeleri filtrele
    const readyDocuments = documents.filter((doc) => doc.docStage === "hazir");

    if (direction === "prev" && currentDocumentIndex > 0) {
      setSelectedDocument(readyDocuments[currentDocumentIndex - 1]);
    } else if (
      direction === "next" &&
      currentDocumentIndex < readyDocuments.length - 1
    ) {
      setSelectedDocument(readyDocuments[currentDocumentIndex + 1]);
    }
  };

  // Filtrelenmiş "hazir" belgeleri
  const readyDocuments = documents
    ? documents.filter((doc) => doc.docStage === "hazir")
    : [];

  return (
    <>
      <PageContainer>
        <NavigationButtons 
          onPrevClick={() => handleNavigation("prev")}
          onNextClick={() => handleNavigation("next")}
          isPrevDisabled={currentDocumentIndex === 0}
          isNextDisabled={
            !readyDocuments ||
            currentDocumentIndex === readyDocuments.length - 1
          }
          targetButtonId="sourceButton"
        />

        <InfoContainer>
          <div>
            <DocumentTitle>{selectedDocument.docName}</DocumentTitle>

            <MetaInfo>
              {selectedDocument.docType && (
                <MetaTag>{selectedDocument.docType}</MetaTag>
              )}
            </MetaInfo>

            <DocumentDescription>
              {selectedDocument.docDescription}
            </DocumentDescription>

            {selectedDocument.docSourceLink && (
              <SourceButton
                id="sourceButton"
                onClick={() =>
                  window.open(
                    selectedDocument.docSourceLink,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <span>Bağlantı</span>
              </SourceButton>
            )}
          </div>

          <ActionButton onClick={handleAction} isCompleted={isCompleted}>
            <span>{isCompleted ? "Tamamlandı" : "Tamamla"}</span>
          </ActionButton>
        </InfoContainer>

        <ImageViewer 
          imageSrc={selectedDocument.docImage}
          altText={selectedDocument.docName}
          readyDocuments={readyDocuments}
          currentIndex={currentDocumentIndex}
        />
      </PageContainer>
    </>
  );
};

export default ReadyDocumentDetail;