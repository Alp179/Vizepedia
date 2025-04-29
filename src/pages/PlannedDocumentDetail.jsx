import styled from "styled-components";
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

// Tekrar kullanılabilir stiller
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  padding: 25px;
  position: relative;

  @media (max-width: 680px) {
    flex-direction: column;
    padding: 16px;
    height: 100%;
  }
  @media (max-width: 450px) {
    width: 100%;
    margin: 0 auto;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 16px;
  border-radius: 20px;
  display: flex;
  max-width: 1000px;
  justify-content: space-between;
  color: #333;
  transition: all 0.3s ease;

  @media (max-width: 680px) {
    padding: 0px;
    margin-bottom: 20px;
  }
  @media (max-width: 600px) {
    flex-flow: column;
  }
`;

const DocTitleCont = styled.div`
  margin: 0 0 0 32px;
  @media (max-width: 600px) {
    margin-left: 16px;
  }
`;

const DocumentTitle = styled.h1`
  font-size: 42px;
  display: inline-block;
  font-weight: bold;
  color: var(--color-grey-52);
  text-wrap: wrap;

  @media (max-width: 600px) {
    font-size: 32px;
    text-align: center;
  }
  @media (max-width: 300px) {
    font-size: 24px;
  }
`;
const DocumentDescription = styled.p`
  margin-top: 20px;
  color: var(--color-grey-53);
  font-size: 18px;
  line-height: 1.6;
  padding: 16px;
  border-radius: 12px;
  display: flex;

  @media (max-width: 800px) {
    flex-flow: column;
  }
`;

const DescriptionLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: #00ffa2;
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
  width: 120px;
  height: 60px;
  min-width: 150px;
  transition: all 0.3s ease;
  font-size: 18px;
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
    min-width: 100px;
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
  position: relative;
  z-index: 100;

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

  @media (max-width: 300px) {
    min-width: 100px !important;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: ${(props) => (props.isLink ? "pointer" : "default")};
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

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

const SourceSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  position: absolute;
  bottom: 40px;
  right: 30px;
  width: 300px;
  z-index: 10;

  @media (max-width: 1150px) {
    width: 250px;
  }

  @media (max-width: 1060px) {
    position: relative;
    width: 100%;
    right: 0;
    bottom: 0;
    margin-left: 12px;
  }

  @media (max-width: 800px) {
    margin-left: 0;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: rgba(142, 68, 173, 0.05);
  }
`;

const SectionHeading = styled.h3`
  font-size: 20px;
  color: var(--color-grey-52);
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const SectionContent = styled.div`
  color: var(--color-grey-53);
  font-size: 16px;
  line-height: 1.6;
`;

// DocProgress component moved from ImageViewer.jsx
const DocProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 30px;
  margin-top: 32px;
  width: fit-content;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  @media (max-width: 1300px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 4px;
  }

  @media (max-width: 680px) {
    position: static;
    transform: none;
    margin: 20px auto 10px;
  }
`;

const ProgressDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#004466" : "#cbd5e0")};
  margin: 0 5px;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 6px rgba(0, 68, 102, 0.5)" : "none"};

  ${(props) =>
    props.active &&
    `
      transform: scale(1.4);
    `}
`;

const MainText = styled.div`
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
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

const SideComponents = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const PlannedDocumentDetail = () => {
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
      // Sadece "planla" kategorisindeki belgeleri filtrele
      const plannedDocuments = documents.filter(
        (doc) => doc.docStage === "planla"
      );
      const initialDocument = plannedDocuments[0];

      if (initialDocument) {
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    }
  }, [isDocumentsSuccess, documents, selectedDocument, setSelectedDocument]);

  useEffect(() => {
    if (selectedDocument && documents) {
      // Sadece "planla" kategorisindeki belgeleri filtrele
      const plannedDocuments = documents.filter(
        (doc) => doc.docStage === "planla"
      );
      const index = plannedDocuments.findIndex(
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

    // Sadece "planla" kategorisindeki belgeleri filtrele
    const plannedDocuments = documents.filter(
      (doc) => doc.docStage === "planla"
    );

    if (direction === "prev" && currentDocumentIndex > 0) {
      setSelectedDocument(plannedDocuments[currentDocumentIndex - 1]);
    } else if (
      direction === "next" &&
      currentDocumentIndex < plannedDocuments.length - 1
    ) {
      setSelectedDocument(plannedDocuments[currentDocumentIndex + 1]);
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

  // Filtrelenmiş "planla" belgeleri
  const plannedDocuments = documents
    ? documents.filter((doc) => doc.docStage === "planla")
    : [];

  return (
    <>
      <PageContainer>
        <NavigationButtons
          onPrevClick={() => handleNavigation("prev")}
          onNextClick={() => handleNavigation("next")}
          isPrevDisabled={currentDocumentIndex === 0}
          isNextDisabled={
            !plannedDocuments ||
            currentDocumentIndex === plannedDocuments.length - 1
          }
        />
        <DocTitleCont>
          <DocumentTitle>{selectedDocument.docName}</DocumentTitle>
        </DocTitleCont>
        <InfoContainer>
          <div>
            <MetaInfo>
              <MetaTag>
                {selectedDocument.estimatedCompletionTime}taptap
              </MetaTag>
              {selectedDocument.docType && (
                <MetaTag>{selectedDocument.docType}</MetaTag>
              )}
            </MetaInfo>

            <DocumentDescription>
              <DescriptionLayout>
                <MainText>{selectedDocument.docDescription}</MainText>
                {selectedDocument.docImportant && (
                  <SectionContainer>
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

                <ActionButton 
                  onClick={handleAction} 
                  isCompleted={isCompleted}
                  className="action-button"
                >
                  {isCompleted ? "Tamamlandı" : "Tamamla"}
                </ActionButton>
              </DescriptionLayout>
              <SideComponents>
                <ImageViewer
                  imageSrc={selectedDocument.docImage}
                  altText={selectedDocument.docName}
                  readyDocuments={plannedDocuments}
                  currentIndex={currentDocumentIndex}
                />
                {selectedDocument.referenceName && (
                  <SourceSectionContainer
                    color="#8e44ad"
                    isLink={!!selectedDocument.referenceLinks}
                    onClick={
                      selectedDocument.referenceLinks
                        ? handleReferenceClick
                        : undefined
                    }
                   
                  >
                    <SectionHeading>
                      Kaynak
                      {selectedDocument.referenceLinks && (
                        <span
                          style={{
                            fontSize: "12px",
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
                    <SectionContent>
                      {selectedDocument.referenceName}
                    </SectionContent>
                  </SourceSectionContainer>
                )}
              </SideComponents>
            </DocumentDescription>
          </div>
        </InfoContainer>

        {/* DocProgress component moved here from ImageViewer.jsx */}
        <DocProgress>
          {plannedDocuments.map((_, index) => (
            <ProgressDot key={index} active={index === currentDocumentIndex} />
          ))}
        </DocProgress>
      </PageContainer>
    </>
  );
};

export default PlannedDocumentDetail;