/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import styled from "styled-components";
import { useDocuments } from "../context/DocumentsContext";
import Spinner from "./Spinner";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import { AnonymousDataService } from "../utils/anonymousDataService";
import { useUser } from "../features/authentication/useUser";

// Category colors and metadata
const categoryColors = {
  hazir: {
    background: "#e6fff2",
    border: "#00cc66",
    text: "#00703a",
    title: "Hemen Hazır",
    route: "ready-documents"
  },
  planla: {
    background: "#fff5e6",
    border: "#ffaa33",
    text: "#cc7700",
    title: "Planla ve Topla",
    route: "planned-documents"
  },
  bizimle: {
    background: "#e6f0ff",
    border: "#3377ff",
    text: "#004de6",
    title: "Bizimle Kolay",
    route: "withus-documents"
  },
};

// ENHANCED: Main container with better styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 3000;
`;

// ENHANCED: Category section for organized display
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${(props) => props.color?.background || "rgba(255, 255, 255, 0.5)"};
  border-left: 4px solid ${(props) => props.color?.border || "#004466"};
  margin-bottom: 8px;
`;

const CategoryTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.color?.text || "#333"};
`;

const CategoryProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div`
  height: 6px;
  width: 60px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => `${props.progress}%`};
  background-color: ${(props) => props.color || "#004466"};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
`;

// ENHANCED: Document item with better design
const DocumentItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.isCompleted 
      ? "#00ffa2" 
      : props.isSponsor 
        ? "rgba(245, 240, 255, 0.9)" 
        : "rgba(255, 255, 255, 0.85)"};
  color: ${(props) => props.isCompleted ? "#374151" : "var(--color-grey-700)"};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid
    ${(props) =>
      props.isCompleted
        ? "#2ecc71"
        : props.isSponsor
        ? "#8533ff"
        : "transparent"};
  font-size: 16px;
  margin: 0;

  &:hover {
    background-color: ${(props) => 
      props.isCompleted 
        ? "#cde0d9" 
        : props.isSponsor
          ? "rgba(245, 240, 255, 0.95)"
          : "#f0f0f0"};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 970px) {
    font-size: 18px;
  }
`;

// ENHANCED: Document info section
const DocumentInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const DocumentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DocumentType = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
`;

const SponsorBadge = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #5a00e6;
  background-color: #f0e6ff;
  border: 1px solid #8533ff;
  padding: 2px 6px;
  border-radius: 4px;
`;

const DocumentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.isCompleted ? "#2ecc71" : "rgba(0, 0, 0, 0.5)")};

  &:before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.isCompleted ? "#2ecc71" : "rgba(0, 0, 0, 0.2)"};
  }
`;

// PRESERVED: Original styling elements
const Bracket = styled.div`
  background-color: var(--color-grey-300);
  height: 1px;
  width: 100%;
  margin: 8px 0;
`;

const ScrollableDiv = styled.div`
  padding: 8px 0;
  overflow-y: auto;
  width: 100%;
  margin: 0 auto;
  max-height: calc(100vh - 200px);
  
  @media (max-width: 710px) {
    max-height: calc(100vh - 400px);
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
`;

const HeadingBig = styled.div`
  font-size: 22px;
  font-weight: bold;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--color-grey-920);
  
  @media (max-width: 970px) {
    font-size: 24px;
  }
  @media (max-width: 450px) {
    font-size: 20px;
  }
`;

const HeadingSmall = styled.p`
  hyphens: none;
  font-size: 16px;
  margin-bottom: 16px;
  color: var(--color-grey-600);
  line-height: 1.4;
  
  @media (max-width: 970px) {
    font-size: 18px;
  }
`;

// ENHANCED: Empty state
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--color-grey-500);
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

function AllDocs({ 
  onCloseModal,
  // NEW: Props from MainNav for enhanced functionality
  documents: propDocuments,
  completedDocuments: propCompletedDocuments,
  applicationId: propApplicationId,
  userSelections: propUserSelections,
  userType: propUserType,
  isAnonymous: propIsAnonymous
}) {
  const { id: paramsApplicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments: contextCompletedDocuments },
    dispatch,
  } = useDocuments();

  // ENHANCED: User type detection
  const { user, userType } = useUser();
  
  // Use props if available (from MainNav), otherwise detect
  const applicationId = propApplicationId || paramsApplicationId;
  const isAnonymous = propIsAnonymous !== undefined 
    ? propIsAnonymous 
    : (userType === 'anonymous' || (!user && applicationId?.startsWith('anonymous-')));

  console.log("🔍 AllDocs Debug:");
  console.log("applicationId:", applicationId);
  console.log("propDocuments:", propDocuments?.length || 0);
  console.log("userType:", propUserType || userType);
  console.log("isAnonymous:", isAnonymous);

  // ENHANCED: User detection with anonymous support
  useEffect(() => {
    if (isAnonymous) {
      setUserId('anonymous-user');
    } else {
      getCurrentUser().then((user) => {
        if (user) {
          setUserId(user.id);
          // Only fetch completed documents if not using props
          if (!propCompletedDocuments && applicationId) {
            fetchCompletedDocuments(user.id, applicationId).then((data) => {
              const completedDocsMap = data.reduce((acc, doc) => {
                if (!acc[applicationId]) {
                  acc[applicationId] = {};
                }
                acc[applicationId][doc.document_name] = true;
                return acc;
              }, {});
              dispatch({
                type: "SET_COMPLETED_DOCUMENTS",
                payload: completedDocsMap,
              });
            });
          }
        }
      });
    }
  }, [isAnonymous, applicationId, propCompletedDocuments, dispatch]);

  // ENHANCED: Anonymous-aware queries (only if props not provided)
  const {
    data: userSelections,
    isLoading: isLoadingSelections,
    isError: isErrorSelections,
  } = useQuery({
    queryKey: ["userSelectionsAllDocs", userId, applicationId, userType],
    queryFn: () => {
      if (isAnonymous) {
        return AnonymousDataService.convertToSupabaseFormat();
      }
      return fetchUserSelectionsDash(userId, applicationId);
    },
    enabled: !propUserSelections && (isAnonymous || (!!userId && !!applicationId)),
    staleTime: 5 * 60 * 1000,
  });

  // Use props or query data
  const finalUserSelections = propUserSelections || userSelections;
  const documentNames = finalUserSelections
    ? getDocumentsForSelections(finalUserSelections)
    : [];

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery({
    queryKey: ["documentDetailsAllDocs", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !propDocuments && !!documentNames.length,
    staleTime: 5 * 60 * 1000,
  });

  // Use props or query data
  const finalDocuments = propDocuments || documents || [];
  const finalCompletedDocuments = propCompletedDocuments || contextCompletedDocuments || {};

  // Loading and error handling
  if (!propDocuments && (isLoadingSelections || isLoadingDocuments)) {
    return <Spinner />;
  }

  if (!propDocuments && (isErrorSelections || isErrorDocuments)) {
    return <div>Error loading data.</div>;
  }

  // ENHANCED: Get real application ID
  const getRealApplicationId = () => {
    if (!isAnonymous && finalUserSelections?.length > 0) {
      return finalUserSelections[0].id; // Real Supabase ID
    }
    return applicationId || `anonymous-${Date.now()}`;
  };

  const realApplicationId = getRealApplicationId();

  console.log("Real application ID for completion check:", realApplicationId);

  // ENHANCED: Handle document click with stage-based routing
  const handleDocumentClick = (document) => {
    console.log("📄 AllDocs - Document clicked:", document.docName, document.docStage);
    
    setSelectedDocument(document);
    
    // Close modal first
    if (onCloseModal) {
      onCloseModal();
    }

    // Navigate based on document stage
    const urlApplicationId = applicationId || realApplicationId;
    const categoryInfo = categoryColors[document.docStage];
    
    if (categoryInfo?.route) {
      console.log("🔗 Navigating to:", `/${categoryInfo.route}/${urlApplicationId}`);
      navigate(`/${categoryInfo.route}/${urlApplicationId}`);
    } else {
      // Fallback for unknown stages or old system
      navigate(`/documents/${urlApplicationId}`);
    }
  };

  // Check if we have any documents
  if (!finalDocuments || finalDocuments.length === 0) {
    return (
      <Container>
        <HeadingBig>Tüm Belgeler</HeadingBig>
        <EmptyState>
          <EmptyStateIcon>📄</EmptyStateIcon>
          <EmptyStateText>Henüz belge bulunamadı</EmptyStateText>
          <EmptyStateSubtext>
            {isAnonymous 
              ? "Başvuru oluşturun ve belgelerinizi görün"
              : "Bir başvuru seçin veya yeni başvuru oluşturun"
            }
          </EmptyStateSubtext>
        </EmptyState>
      </Container>
    );
  }

  // ENHANCED: Group documents by stage
  const groupedDocuments = finalDocuments.reduce((acc, doc, index) => {
    const stage = doc.docStage || "planla";
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push({ ...doc, index });
    return acc;
  }, {});

  const categoryOrder = ["hazir", "planla", "bizimle"];

  // ENHANCED: Calculate category progress with real application ID
  const calculateCategoryProgress = (docs) => {
    if (!docs || !docs.length) return 0;
    const completedCount = docs.filter(
      (doc) => finalCompletedDocuments[realApplicationId]?.[doc.docName]
    ).length;
    return Math.round((completedCount / docs.length) * 100);
  };

  // Check if we should use the new categorized view
  const hasDocStages = finalDocuments.some(doc => doc.docStage);

  return (
    <Container>
      <HeadingBig>
        Tüm Belgeler ({finalDocuments.length})
      </HeadingBig>
      <HeadingSmall>
        Başvurunuzda gerekli olan tüm belgeleri aşağıda görebilirsiniz
      </HeadingSmall>

      <ScrollableDiv>
        {hasDocStages ? (
          // NEW: Categorized view
          <>
            {categoryOrder.map((category) => {
              const docs = groupedDocuments[category];
              
              if (!docs || docs.length === 0) {
                return null;
              }

              const progress = calculateCategoryProgress(docs);
              const colorSet = categoryColors[category];

              return (
                <CategorySection key={category}>
                  <CategoryHeader color={colorSet}>
                    <CategoryTitle color={colorSet}>
                      {colorSet.title} ({docs.length})
                    </CategoryTitle>
                    <CategoryProgress>
                      <ProgressBar>
                        <ProgressFill progress={progress} color={colorSet.border} />
                      </ProgressBar>
                      <ProgressText>{progress}%</ProgressText>
                    </CategoryProgress>
                  </CategoryHeader>

                  {docs.map((doc, index) => {
                    const isCompleted = finalCompletedDocuments[realApplicationId]?.[doc.docName];
                    const isSponsor = doc.docName?.startsWith("Sponsor");

                    return (
                      <div key={doc.id}>
                        <DocumentItem
                          isCompleted={isCompleted}
                          isSponsor={isSponsor}
                          onClick={() => handleDocumentClick(doc)}
                        >
                          <DocumentInfo>
                            <DocumentName>{doc.docName}</DocumentName>
                            <DocumentMeta>
                              {doc.docType && (
                                <DocumentType>{doc.docType}</DocumentType>
                              )}
                              {doc.estimatedCompletionTime && (
                                <DocumentType>{doc.estimatedCompletionTime}</DocumentType>
                              )}
                              {isSponsor && <SponsorBadge>Sponsor</SponsorBadge>}
                            </DocumentMeta>
                          </DocumentInfo>
                          <DocumentStatus isCompleted={isCompleted}>
                            {isCompleted ? "Tamamlandı" : "Bekliyor"}
                          </DocumentStatus>
                        </DocumentItem>
                        {index < docs.length - 1 && <Bracket />}
                      </div>
                    );
                  })}
                </CategorySection>
              );
            })}
          </>
        ) : (
          // PRESERVED: Original flat view for backwards compatibility
          <>
            {finalDocuments.map((document, index) => {
              const isCompleted = finalCompletedDocuments[realApplicationId]?.[document.docName];
              const isSponsor = document.docName?.startsWith("Sponsor");

              return (
                <div key={document.id}>
                  <DocumentItem
                    isCompleted={isCompleted}
                    isSponsor={isSponsor}
                    onClick={() => handleDocumentClick(document)}
                  >
                    <DocumentInfo>
                      <DocumentName>{document.docName}</DocumentName>
                      {(document.docType || document.estimatedCompletionTime || isSponsor) && (
                        <DocumentMeta>
                          {document.docType && (
                            <DocumentType>{document.docType}</DocumentType>
                          )}
                          {document.estimatedCompletionTime && (
                            <DocumentType>{document.estimatedCompletionTime}</DocumentType>
                          )}
                          {isSponsor && <SponsorBadge>Sponsor</SponsorBadge>}
                        </DocumentMeta>
                      )}
                    </DocumentInfo>
                    <DocumentStatus isCompleted={isCompleted}>
                      {isCompleted ? "Tamamlandı" : "Bekliyor"}
                    </DocumentStatus>
                  </DocumentItem>
                  {index < finalDocuments.length - 1 && <Bracket />}
                </div>
              );
            })}
          </>
        )}
      </ScrollableDiv>
    </Container>
  );
}

export default AllDocs;