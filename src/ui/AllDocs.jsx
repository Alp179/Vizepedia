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

// SIMPLIFIED: Main container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 3000;
`;

// SIMPLIFIED: Document item - only names
const DocumentItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.isCompleted 
      ? "#00ffa2" 
      : "rgba(255, 255, 255, 0.85)"};
  color: ${(props) => props.isCompleted ? "#374151" : "black"};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid
    ${(props) =>
      props.isCompleted
        ? "#2ecc71"
        : "transparent"};
  font-size: 16px;
  margin: 0;

  &:hover {
    background-color: ${(props) => 
      props.isCompleted 
        ? "#cde0d9" 
        : "#f0f0f0"};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 970px) {
    font-size: 18px;
  }
`;

// SIMPLIFIED: Document name only
const DocumentName = styled.div`
  font-weight: 500;
  flex: 1;
`;

// SIMPLIFIED: Status indicator
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

// Empty state
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

  const { user, userType } = useUser();
  
  // FIXED: Get current application ID from URL params (most important fix)
  const currentApplicationId = propApplicationId || paramsApplicationId;
  
  // UPDATED: Use sessionStorage instead of localStorage for anonymous check
  const isAnonymous = propIsAnonymous !== undefined 
    ? propIsAnonymous 
    : (userType === 'anonymous' || sessionStorage.getItem("isAnonymous") === "true" || (!user && currentApplicationId?.startsWith('anonymous-')));

  console.log("🔍 AllDocs Debug:");
  console.log("currentApplicationId:", currentApplicationId);
  console.log("propDocuments:", propDocuments?.length || 0);
  console.log("userType:", propUserType || userType);
  console.log("isAnonymous:", isAnonymous);
  console.log("user:", user);

  useEffect(() => {
    if (isAnonymous) {
      console.log("Setting anonymous user");
      setUserId('anonymous-user');
    } else {
      console.log("Getting authenticated user...");
      getCurrentUser()
        .then((user) => {
          console.log("getCurrentUser result:", user);
          if (user) {
            setUserId(user.id);
            console.log("Set userId to:", user.id);
          } else {
            console.log("No user found from getCurrentUser");
          }
        })
        .catch((error) => {
          console.error("Error in getCurrentUser:", error);
        });
    }
  }, [isAnonymous]);

  // FIXED: Query for current application's data specifically
  const {
    data: userSelections,
    isLoading: isLoadingSelections,
    isError: isErrorSelections,
    error: selectionsError,
  } = useQuery({
    queryKey: ["userSelectionsAllDocs", userId, currentApplicationId, userType],
    queryFn: () => {
      console.log("🔄 Fetching user selections for current application...");
      console.log("isAnonymous:", isAnonymous);
      console.log("userId:", userId);
      console.log("currentApplicationId:", currentApplicationId);
      
      if (isAnonymous) {
        console.log("Using AnonymousDataService");
        const result = AnonymousDataService.convertToSupabaseFormat();
        console.log("Anonymous result:", result);
        return result;
      } else if (userId && currentApplicationId) {
        console.log("Using fetchUserSelectionsDash for specific application");
        // FIXED: Pass the specific application ID to get only that application's data
        const result = fetchUserSelectionsDash(userId, currentApplicationId);
        console.log("Authenticated fetch started with userId:", userId, "applicationId:", currentApplicationId);
        return result;
      } else {
        console.log("Missing userId or currentApplicationId");
        return null;
      }
    },
    // FIXED: Only enable when we have the necessary data
    enabled: !propUserSelections && ((isAnonymous && AnonymousDataService.hasCompletedOnboarding()) || (!!userId && !!currentApplicationId)),
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      console.log("✅ User selections query success:", data);
    },
    onError: (error) => {
      console.error("❌ User selections query error:", error);
    },
  });

  const finalUserSelections = propUserSelections || userSelections;
  console.log("Final user selections:", finalUserSelections);
  
  const documentNames = finalUserSelections
    ? getDocumentsForSelections(finalUserSelections)
    : [];
  console.log("Document names from selections:", documentNames);

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
    error: documentsError,
  } = useQuery({
    queryKey: ["documentDetailsAllDocs", documentNames],
    queryFn: () => {
      console.log("🔄 Fetching document details for:", documentNames);
      return fetchDocumentDetails(documentNames);
    },
    enabled: !propDocuments && !!documentNames.length,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      console.log("✅ Document details query success:", data);
    },
    onError: (error) => {
      console.error("❌ Document details query error:", error);
    },
  });

  // FIXED: Fetch completed documents for the specific current application
  useEffect(() => {
    if (!propCompletedDocuments && userId && currentApplicationId && !isAnonymous) {
      console.log("🔄 Fetching completed documents for current application:", userId, currentApplicationId);
      fetchCompletedDocuments(userId, currentApplicationId)
        .then((data) => {
          console.log("✅ Fetched completed documents for current app:", data);
          if (data && data.length > 0) {
            const completedDocsMap = data.reduce((acc, doc) => {
              if (!acc[currentApplicationId]) {
                acc[currentApplicationId] = {};
              }
              acc[currentApplicationId][doc.document_name] = true;
              return acc;
            }, {});
            dispatch({
              type: "SET_COMPLETED_DOCUMENTS",
              payload: { ...contextCompletedDocuments, ...completedDocsMap },
            });
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching completed documents for current app:", error);
        });
    } else if (isAnonymous && currentApplicationId) {
      // FIXED: For anonymous users, get completed documents for current application
      const anonymousCompletedDocs = AnonymousDataService.fetchCompletedDocuments(currentApplicationId);
      const completedDocsMap = anonymousCompletedDocs.reduce((acc, doc) => {
        if (!acc[currentApplicationId]) {
          acc[currentApplicationId] = {};
        }
        acc[currentApplicationId][doc.document_name] = true;
        return acc;
      }, {});
      
      if (Object.keys(completedDocsMap).length > 0) {
        dispatch({
          type: "SET_COMPLETED_DOCUMENTS",
          payload: { ...contextCompletedDocuments, ...completedDocsMap },
        });
      }
    }
  }, [userId, currentApplicationId, isAnonymous, propCompletedDocuments, dispatch, contextCompletedDocuments]);

  const finalDocuments = propDocuments || documents || [];
  const finalCompletedDocuments = propCompletedDocuments || contextCompletedDocuments || {};

  console.log("Final documents count:", finalDocuments.length);
  console.log("Final completed documents:", finalCompletedDocuments);

  // FIXED: Use current application ID for completion checks
  const getRealApplicationId = () => {
    if (isAnonymous) {
      return currentApplicationId || AnonymousDataService.getConsistentApplicationId();
    } else {
      // For authenticated users, use the current application ID or the first selection's ID
      return currentApplicationId || finalUserSelections?.[0]?.id;
    }
  };

  const realApplicationId = getRealApplicationId();
  console.log("🔑 AllDocs Real application ID for completion check:", realApplicationId);
  console.log("🔑 AllDocs Completed documents keys:", Object.keys(finalCompletedDocuments));
  console.log("🔑 AllDocs Completed documents for realApplicationId:", finalCompletedDocuments[realApplicationId]);

  if (!propDocuments && (isLoadingSelections || isLoadingDocuments)) {
    console.log("Loading state:", { isLoadingSelections, isLoadingDocuments });
    return (
      <Container>
        <HeadingBig>Tüm Belgeler</HeadingBig>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px' }}>
          <Spinner />
          <span>
            {isLoadingSelections ? "Kullanıcı seçimleri yükleniyor..." : "Belgeler yükleniyor..."}
          </span>
        </div>
      </Container>
    );
  }

  if (!propDocuments && (isErrorSelections || isErrorDocuments)) {
    console.error("Error state:", { isErrorSelections, isErrorDocuments, selectionsError, documentsError });
    return (
      <Container>
        <HeadingBig>Tüm Belgeler</HeadingBig>
        <div style={{ padding: '20px', color: 'red' }}>
          <p>Belgeler yüklenirken hata oluştu:</p>
          {isErrorSelections && (
            <p>Kullanıcı seçimleri hatası: {selectionsError?.message}</p>
          )}
          {isErrorDocuments && (
            <p>Belge detayları hatası: {documentsError?.message}</p>
          )}
        </div>
      </Container>
    );
  }

  // Handle document click with stage-based routing
  const handleDocumentClick = (document) => {
    console.log("📄 AllDocs - Document clicked:", document.docName, "stage:", document.docStage);
    
    setSelectedDocument(document);
    
    if (onCloseModal) {
      onCloseModal();
    }

    // Navigate based on document stage using current application ID
    const urlApplicationId = realApplicationId;
    
    // Map document stages to their corresponding routes
    const stageRoutes = {
      'hazir': 'ready-documents',
      'planla': 'planned-documents', 
      'bizimle': 'withus-documents'
    };
    
    const route = stageRoutes[document.docStage] || 'ready-documents';
    
    console.log("🔗 AllDocs - Navigating to:", `/${route}/${urlApplicationId}`);
    navigate(`/${route}/${urlApplicationId}`);
  };

  if (!finalDocuments || finalDocuments.length === 0) {
    return (
      <Container>
        <HeadingBig>Tüm Belgeler</HeadingBig>
        <EmptyState>
          <EmptyStateIcon>📄</EmptyStateIcon>
          <EmptyStateText>Henüz belge bulunamadı</EmptyStateText>
          <EmptyStateSubtext>
            {!currentApplicationId
              ? "Bir başvuru seçin veya yeni başvuru oluşturun"
              : "Bu başvuru için belge bilgisi yüklenemedi"
            }
          </EmptyStateSubtext>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <HeadingBig>
        Tüm Belgeler ({finalDocuments.length})
      </HeadingBig>
      <HeadingSmall>
        Bu başvurunuzda gerekli olan tüm belgeleri aşağıda görebilirsiniz
      </HeadingSmall>

      <ScrollableDiv>
        {finalDocuments.map((document, index) => {
          // Use realApplicationId for consistency
          const isCompleted = finalCompletedDocuments[realApplicationId]?.[document.docName];
          
          console.log(`📄 Document "${document.docName}" completion check:`, {
            realApplicationId,
            isCompleted,
            completedDocsForApp: finalCompletedDocuments[realApplicationId]
          });

          return (
            <div key={document.id}>
              <DocumentItem
                isCompleted={isCompleted}
                onClick={() => handleDocumentClick(document)}
              >
                <DocumentName>{document.docName}</DocumentName>
                <DocumentStatus isCompleted={isCompleted}>
                  {isCompleted ? "Tamamlandı" : "Bekliyor"}
                </DocumentStatus>
              </DocumentItem>
              {index < finalDocuments.length - 1 && <Bracket />}
            </div>
          );
        })}
      </ScrollableDiv>
    </Container>
  );
}

export default AllDocs;