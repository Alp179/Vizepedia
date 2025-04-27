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

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${(props) => props.color || "#004466"};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: ${(props) => (props.isLink ? "pointer" : "default")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    ${(props) =>
      props.isLink &&
      `
      background-color: rgba(142, 68, 173, 0.05);
    `}
  }
`;

const SectionHeading = styled.h3`
  font-size: 20px;
  color: var(--color-grey-52);
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const SectionContent = styled.div`
  color: var(--color-grey-53);
  font-size: 16px;
  line-height: 1.6;
`;

const WithUsDocumentDetail = () => {
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
      // Sadece "bizimle" kategorisindeki belgeleri filtrele
      const withusDocuments = documents.filter(
        (doc) => doc.docStage === "bizimle"
      );
      const initialDocument = withusDocuments[0];

      if (initialDocument) {
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    }
  }, [isDocumentsSuccess, documents, selectedDocument, setSelectedDocument]);

  useEffect(() => {
    if (selectedDocument && documents) {
      // Sadece "bizimle" kategorisindeki belgeleri filtrele
      const withusDocuments = documents.filter(
        (doc) => doc.docStage === "bizimle"
      );
      const index = withusDocuments.findIndex(
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

    // Sadece "bizimle" kategorisindeki belgeleri filtrele
    const withusDocuments = documents.filter(
      (doc) => doc.docStage === "bizimle"
    );

    if (direction === "prev" && currentDocumentIndex > 0) {
      setSelectedDocument(withusDocuments[currentDocumentIndex - 1]);
    } else if (
      direction === "next" &&
      currentDocumentIndex < withusDocuments.length - 1
    ) {
      setSelectedDocument(withusDocuments[currentDocumentIndex + 1]);
    }
  };

  const handleReferenceClick = () => {
    if (selectedDocument && selectedDocument.referenceLinks) {
      // Link açma işlemi
      window.open(
        selectedDocument.referenceLinks,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // Filtrelenmiş "bizimle" belgeleri
  const withusDocuments = documents
    ? documents.filter((doc) => doc.docStage === "bizimle")
    : [];

  return (
    <>
      <PageContainer>
        <NavigationButtons
          onPrevClick={() => handleNavigation("prev")}
          onNextClick={() => handleNavigation("next")}
          isPrevDisabled={currentDocumentIndex === 0}
          isNextDisabled={
            !withusDocuments ||
            currentDocumentIndex === withusDocuments.length - 1
          }
          targetButtonId="sourceButton"
        />

        <InfoContainer>
          <div>
            <DocumentTitle>{selectedDocument.docName}</DocumentTitle>

            <MetaInfo>
              <MetaTag>{selectedDocument.estimatedCompletionTime}</MetaTag>
              {selectedDocument.docType && (
                <MetaTag>{selectedDocument.docType}</MetaTag>
              )}
            </MetaInfo>

            <DocumentDescription>
              {selectedDocument.docDescription}
            </DocumentDescription>

            {selectedDocument.docImportant && (
              <SectionContainer color="#e74c3c">
                <SectionHeading>Dikkat</SectionHeading>
                <SectionContent>
                  {selectedDocument.docImportant
                    .split("\\n-")
                    .map((item, index) =>
                      index === 0 ? (
                        <p key={index}>{item}</p>
                      ) : (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginTop: "8px",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "#e74c3c",
                              marginRight: "8px",
                              marginTop: "8px",
                            }}
                          ></span>
                          <span>{item.trim()}</span>
                        </div>
                      )
                    )}
                </SectionContent>
              </SectionContainer>
            )}

            {selectedDocument.docWhere && (
              <SectionContainer color="#3498db">
                <SectionHeading>Temin yeri</SectionHeading>
                <SectionContent>{selectedDocument.docWhere}</SectionContent>
              </SectionContainer>
            )}

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
          readyDocuments={withusDocuments}
          currentIndex={currentDocumentIndex}
        />

        {selectedDocument.referenceName && (
          <SectionContainer
            color="#8e44ad"
            isLink={!!selectedDocument.referenceLinks}
            onClick={
              selectedDocument.referenceLinks ? handleReferenceClick : undefined
            }
            style={{
              position: "absolute",
              bottom: "20px",
              right: "30px",
              width: "300px",
              zIndex: 10,
            }}
          >
            <SectionHeading>
              Kaynak
              {selectedDocument.referenceLinks && (
                <span
                  style={{
                    fontSize: "12px",
                    marginLeft: "8px",
                    backgroundColor: "rgba(142, 68, 173, 0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    color: "#8e44ad",
                  }}
                >
                  Bağlantıya git
                </span>
              )}
            </SectionHeading>
            <SectionContent>{selectedDocument.referenceName}</SectionContent>
          </SectionContainer>
        )}
      </PageContainer>
    </>
  );
};

export default WithUsDocumentDetail;
