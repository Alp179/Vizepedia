/* eslint-disable react/prop-types */

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
import { AnonymousDataService } from "../utils/anonymousDataService";
import { useUser } from "../features/authentication/useUser";

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
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 30px;
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
  padding: 30px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  max-width: 1000px;
  margin: 0 auto;
  justify-content: space-between;
  color: #333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  @media (max-width: 800px) {
    flex-direction: column;
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const DocTitleCont = styled.div`
  margin: 0 0 20px 0;
  text-align: center;
`;

const DocumentTitle = styled.h1`
  font-size: 36px;
  display: inline-block;
  font-weight: bold;
  color: var(--color-grey-52);
  text-wrap: wrap;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    font-size: 28px;
    text-align: center;
  }
  @media (max-width: 300px) {
    font-size: 24px;
  }
`;

const DocumentDescription = styled.div`
  color: var(--color-grey-53);
  font-size: 18px;
  width: 60%;
  line-height: 1.6;
  padding: 16px;
  display: flex;
  flex-direction: column;

  @media (max-width: 800px) {
    width: 100%;
    order: 1;
    text-align: center;
    padding: 12px;
    margin-top: 0;
  }
`;

const MetaTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: #004466;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 12px;
  font-weight: 600;
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
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
  transition: background-color 0.3s ease;
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
  }

  @media (max-width: 300px) {
    min-width: 100px !important;
  }
`;

const SourceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
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

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const DocProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 30px;
  margin: 0 auto 15px;
  width: fit-content;
  z-index: 10;

  @media (max-width: 680px) {
    margin: 10px auto;
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

const DescriptionLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MainText = styled.div`
  flex: 1;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 800px) {
    width: 100%;
    order: 2;
    margin: 20px auto;
  }
`;

const ReadyDocumentDetail = () => {
  const { id: paramApplicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const navigate = useNavigate();
  const { selectedDocument, setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

  // FIXED: User type detection
  const { user, userType } = useUser();
  const isAnonymous =
    userType === "anonymous" ||
    (!user && paramApplicationId?.startsWith("anonymous-"));

  const applicationId = paramApplicationId || `anonymous-${Date.now()}`;

  console.log("🔍 ReadyDocumentDetail Debug:");
  console.log("paramApplicationId:", paramApplicationId);
  console.log("applicationId:", applicationId);
  console.log("userType:", userType);
  console.log("user:", user ? "authenticated" : "none");
  console.log("isAnonymous:", isAnonymous);

  // FIXED: Anonymous-aware query
  const { data: userSelections } = useQuery({
    queryKey: ["userSelections", userId, applicationId, userType],
    queryFn: () => {
      if (isAnonymous) {
        return AnonymousDataService.convertToSupabaseFormat();
      }
      return fetchUserSelectionsDash(userId, applicationId);
    },
    enabled: isAnonymous || (!!userId && !!applicationId),
    staleTime: 5 * 60 * 1000,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const { data: documents, isSuccess: isDocumentsSuccess } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
    staleTime: 5 * 60 * 1000,
  });

  // FIXED: User detection
  useEffect(() => {
    if (isAnonymous) {
      setUserId("anonymous-user");
    } else {
      getCurrentUser().then((user) => {
        if (user) {
          setUserId(user.id);
        }
      });
    }
  }, [isAnonymous]);

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

  const isCompleted = isAnonymous
  ? completedDocuments[applicationId]?.[selectedDocument?.docName]
  : userSelections?.length > 0
    ? completedDocuments[userSelections[0].id]?.[selectedDocument?.docName]
    : false;
  // FIXED: Anonymous-aware action handler
  // Her üç document detail dosyasında da handleAction fonksiyonunu bulun ve bu şekilde güncelleyin:

  // ReadyDocumentDetail.jsx, PlannedDocumentDetail.jsx, WithUsDocumentDetail.jsx'te handleAction fonksiyonunu değiştirin:

const handleAction = async () => {
  if (!selectedDocument) return;

  try {
    if (isAnonymous) {
      // Anonymous user - localStorage'da işlem yap
      if (isCompleted) {
        AnonymousDataService.uncompleteDocument(applicationId, selectedDocument.docName);
        dispatch({
          type: "UNCOMPLETE_DOCUMENT",
          payload: { documentName: selectedDocument.docName, applicationId },
        });
      } else {
        AnonymousDataService.completeDocument(applicationId, selectedDocument.docName);
        dispatch({
          type: "COMPLETE_DOCUMENT",
          payload: { documentName: selectedDocument.docName, applicationId },
        });
      }
    } else {
      // FIXED: Authenticated user - use real application ID consistently
      if (!userId || !userSelections || userSelections.length === 0) return;
      
      // Get the real application ID from userSelections
      const realApplicationId = userSelections[0].id;
      
      console.log("🔄 Using real application ID for authenticated user:");
      console.log("URL applicationId:", applicationId);
      console.log("Real applicationId:", realApplicationId);
      
      if (isCompleted) {
        await uncompleteDocument(userId, selectedDocument.docName, realApplicationId);
        // CRITICAL FIX: Use real application ID in dispatch too
        dispatch({
          type: "UNCOMPLETE_DOCUMENT",
          payload: { 
            documentName: selectedDocument.docName, 
            applicationId: realApplicationId  // ← Bu çok önemli!
          },
        });
        console.log("✅ Document uncompleted and context updated with real ID");
      } else {
        await completeDocument(userId, selectedDocument.docName, realApplicationId);
        // CRITICAL FIX: Use real application ID in dispatch too
        dispatch({
          type: "COMPLETE_DOCUMENT",
          payload: { 
            documentName: selectedDocument.docName, 
            applicationId: realApplicationId  // ← Bu çok önemli!
          },
        });
        console.log("✅ Document completed and context updated with real ID");
      }
    }

    console.log("🔄 Navigation after document action:");
    console.log("applicationId:", applicationId);
    console.log("user:", user);
    console.log("userType:", userType);

    if (user && userType === "authenticated") {
      // For authenticated users, redirect to dashboard without applicationId 
      // Dashboard will automatically use the real application ID
      navigate("/dashboard");
    } else if (applicationId && !applicationId.startsWith("anonymous-")) {
      navigate(`/dashboard/${applicationId}`);
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    console.error("Error updating document status:", error);
    navigate("/dashboard");
  }
};

  const handleNavigation = (direction) => {
    if (!documents) return;

    // Sadece "hazir" kategorisindeki belgeleri filtrele
    const readyDocuments = documents.filter((doc) => doc.docStage === "hazir");

    console.log("🔄 Navigation Debug:");
    console.log("direction:", direction);
    console.log("currentIndex:", currentDocumentIndex);
    console.log("readyDocuments length:", readyDocuments.length);

    if (direction === "prev" && currentDocumentIndex > 0) {
      const nextDoc = readyDocuments[currentDocumentIndex - 1];
      console.log("Going to previous:", nextDoc.docName);
      setSelectedDocument(nextDoc);
    } else if (
      direction === "next" &&
      currentDocumentIndex < readyDocuments.length - 1
    ) {
      const nextDoc = readyDocuments[currentDocumentIndex + 1];
      console.log("Going to next:", nextDoc.docName);
      setSelectedDocument(nextDoc);
    }
  };

  // Filtrelenmiş "hazir" belgeleri
  const readyDocuments = documents
    ? documents.filter((doc) => doc.docStage === "hazir")
    : [];

  return (
    <PageContainer>
      <NavigationButtons
        onPrevClick={() => handleNavigation("prev")}
        onNextClick={() => handleNavigation("next")}
        isPrevDisabled={currentDocumentIndex === 0}
        isNextDisabled={
          !readyDocuments || currentDocumentIndex === readyDocuments.length - 1
        }
      />

      <DocProgress>
        {readyDocuments.map((_, index) => (
          <ProgressDot key={index} active={index === currentDocumentIndex} />
        ))}
      </DocProgress>

      <DocTitleCont>
        <DocumentTitle>{selectedDocument.docName}</DocumentTitle>
        <MetaInfo>
          {selectedDocument.docType && (
            <MetaTag>{selectedDocument.docType}</MetaTag>
          )}
        </MetaInfo>
      </DocTitleCont>

      <InfoContainer>
        <DocumentDescription>
          <DescriptionLayout>
            <MainText>{selectedDocument.docDescription}</MainText>

            <ButtonsContainer>
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
            </ButtonsContainer>
          </DescriptionLayout>
        </DocumentDescription>

        <ImageContainer>
          <ImageViewer
            imageSrc={selectedDocument.docImage}
            altText={selectedDocument.docName}
            readyDocuments={readyDocuments}
            currentIndex={currentDocumentIndex}
          />
        </ImageContainer>
      </InfoContainer>
    </PageContainer>
  );
};

export default ReadyDocumentDetail;
