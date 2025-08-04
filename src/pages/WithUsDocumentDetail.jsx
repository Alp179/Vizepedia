/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useContext, useEffect, useState, useMemo } from "react";
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

// All styled components remain the same as original file...
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

// ... (diğer styled components orijinal dosyadan aynı)

const WithUsDocumentDetail = () => {
  const { id: paramApplicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const navigate = useNavigate();
  const { selectedDocument, setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

  // DEMO MODE DETECTION
  const isDemoMode = !paramApplicationId;
  console.log("🎭 WithUs Demo mode:", isDemoMode);

  // Demo için sabit veriler
  const demoUserSelections = useMemo(() => [
    {
      id: "demo-application",
      created_at: new Date().toISOString(),
      ans_country: "Almanya",
      ans_purpose: "Turistik",
      ans_profession: "Öğrenci", 
      ans_vehicle: "Uçak",
      ans_kid: "Hayir",
      ans_accommodation: "Otel",
      ans_hassponsor: true,
      ans_sponsor_profession: "Çalışan",
      has_appointment: false,
      has_filled_form: false
    }
  ], []);

  // User type detection
  const { user, userType } = useUser();
  const isAnonymous = !isDemoMode && (
    userType === "anonymous" ||
    (!user && paramApplicationId?.startsWith("anonymous-"))
  );

  const applicationId = isDemoMode ? "demo-application" : (paramApplicationId || `anonymous-${Date.now()}`);

  console.log("🔍 WithUsDocumentDetail Debug:");
  console.log("isDemoMode:", isDemoMode);
  console.log("paramApplicationId:", paramApplicationId);
  console.log("applicationId:", applicationId);

  // Query for user selections
  const { data: userSelections } = useQuery({
    queryKey: ["userSelections", userId, applicationId, userType, isDemoMode],
    queryFn: () => {
      if (isDemoMode) {
        return demoUserSelections;
      }
      if (isAnonymous) {
        return AnonymousDataService.convertToSupabaseFormat();
      }
      return fetchUserSelectionsDash(userId, applicationId);
    },
    enabled: isDemoMode || isAnonymous || (!!userId && !!applicationId),
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

  // User detection
  useEffect(() => {
    if (isDemoMode) {
      setUserId("demo-user");
    } else if (isAnonymous) {
      setUserId("anonymous-user");
    } else {
      getCurrentUser().then((user) => {
        if (user) {
          setUserId(user.id);
        }
      });
    }
  }, [isDemoMode, isAnonymous]);

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

  const isCompleted = isDemoMode 
    ? false // Demo modunda hiçbir belge tamamlanmamış
    : isAnonymous
      ? completedDocuments[applicationId]?.[selectedDocument?.docName]
      : userSelections?.length > 0
        ? completedDocuments[userSelections[0].id]?.[selectedDocument?.docName]
        : false;

  const handleAction = async () => {
    if (!selectedDocument) return;
  
    try {
      if (isDemoMode) {
        // Demo modunda sadece navigate
        console.log("🎭 WithUs Demo mode - navigating to dashboard");
        navigate("/dashboard");
        return;
      }

      if (isAnonymous) {
        // Anonymous user logic
        const correctApplicationId = AnonymousDataService.getConsistentApplicationId();
        
        if (isCompleted) {
          AnonymousDataService.uncompleteDocument(correctApplicationId, selectedDocument.docName);
          dispatch({
            type: "UNCOMPLETE_DOCUMENT",
            payload: { 
              documentName: selectedDocument.docName, 
              applicationId: correctApplicationId
            },
          });
        } else {
          AnonymousDataService.completeDocument(correctApplicationId, selectedDocument.docName);
          dispatch({
            type: "COMPLETE_DOCUMENT",
            payload: { 
              documentName: selectedDocument.docName, 
              applicationId: correctApplicationId
            },
          });
        }
      } else {
        // Authenticated user logic
        if (!userId || !userSelections || userSelections.length === 0) return;
        
        const realApplicationId = userSelections[0].id;
        
        if (isCompleted) {
          await uncompleteDocument(userId, selectedDocument.docName, realApplicationId);
          dispatch({
            type: "UNCOMPLETE_DOCUMENT",
            payload: { 
              documentName: selectedDocument.docName, 
              applicationId: realApplicationId
            },
          });
        } else {
          await completeDocument(userId, selectedDocument.docName, realApplicationId);
          dispatch({
            type: "COMPLETE_DOCUMENT",
            payload: { 
              documentName: selectedDocument.docName, 
              applicationId: realApplicationId
            },
          });
        }
      }
  
      // Navigation logic
      if (user && userType === "authenticated") {
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

    // Sadece "bizimle" kategorisindeki belgeleri filtrele
    const withusDocuments = documents.filter(
      (doc) => doc.docStage === "bizimle"
    );

    if (direction === "prev" && currentDocumentIndex > 0) {
      const nextDoc = withusDocuments[currentDocumentIndex - 1];
      setSelectedDocument(nextDoc);
    } else if (
      direction === "next" &&
      currentDocumentIndex < withusDocuments.length - 1
    ) {
      const nextDoc = withusDocuments[currentDocumentIndex + 1];
      setSelectedDocument(nextDoc);
    }
  };

  const handleReferenceClick = () => {
    if (selectedDocument && selectedDocument.referenceLinks) {
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
        />
        
        {/* Progress dots */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.2)",
          padding: "10px",
          borderRadius: "30px",
          margin: "0 auto 10px",
          width: "fit-content"
        }}>
          {withusDocuments.map((_, index) => (
            <div 
              key={index} 
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: index === currentDocumentIndex ? "#004466" : "#cbd5e0",
                margin: "0 5px",
                transition: "all 0.3s ease",
                transform: index === currentDocumentIndex ? "scale(1.4)" : "scale(1)",
                boxShadow: index === currentDocumentIndex ? "0 0 6px rgba(0, 68, 102, 0.5)" : "none"
              }}
            />
          ))}
        </div>
        
        {/* Document title */}
        <div style={{ margin: "0 0 20px 32px", textAlign: "center" }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "var(--color-grey-52)",
            marginBottom: "10px"
          }}>
            {selectedDocument.docName}
          </h1>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "15px",
            justifyContent: "center"
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#00ffa2",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600"
            }}>
              {selectedDocument.estimatedCompletionTime}
            </span>
            {selectedDocument.docType && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#00ffa2",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                {selectedDocument.docType}
              </span>
            )}
            {isDemoMode && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                color: "#ff8c00",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                DEMO
              </span>
            )}
          </div>
        </div>
        
        {/* Ana içerik benzer şekilde düzenlenecek... */}
        <div style={{
          flex: 1,
          padding: "16px",
          borderRadius: "20px",
          display: "flex",
          maxWidth: "1000px",
          margin: "0 auto",
          justifyContent: "space-between",
          color: "#333"
        }}>
          {/* WithUs içerik yapısı burada devam edecek... */}
          <div style={{
            marginTop: "20px",
            color: "var(--color-grey-53)",
            fontSize: "18px",
            lineHeight: "1.6",
            padding: "16px",
            borderRadius: "12px",
            display: "flex",
            gap: "25px",
            flexDirection: "row-reverse"
          }}>
            <div style={{ display: "flex", width: "40%", flexDirection: "column", gap: "20px" }}>
              <ImageViewer
                imageSrc={selectedDocument.docImage}
                altText={selectedDocument.docName}
                readyDocuments={withusDocuments}
                currentIndex={currentDocumentIndex}
              />
              
              {selectedDocument.referenceName && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "18px",
                    borderRadius: "14px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(5px)",
                    marginBottom: "20px",
                    cursor: selectedDocument.referenceLinks ? "pointer" : "default"
                  }}
                  onClick={selectedDocument.referenceLinks ? handleReferenceClick : undefined}
                >
                  <h3 style={{
                    fontSize: "20px",
                    color: "var(--color-grey-52)",
                    marginBottom: "12px",
                    fontWeight: "600",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center"
                  }}>
                    Kaynak
                    {selectedDocument.referenceLinks && (
                      <span style={{
                        fontSize: "12px",
                        backgroundColor: "rgba(142, 68, 173, 0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        color: "#8e44ad"
                      }}>
                        Bağlantıya git
                      </span>
                    )}
                  </h3>
                  <div style={{
                    color: "var(--color-grey-53)",
                    fontSize: "16px",
                    lineHeight: "1.6"
                  }}>
                    {selectedDocument.referenceName}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "18px" }}>
              <div style={{
                padding: "18px",
                borderRadius: "14px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(5px)"
              }}>
                {selectedDocument.docDescription}
              </div>
              
              {selectedDocument.docImportant && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "18px",
                  borderRadius: "14px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(5px)",
                  marginTop: "0"
                }}>
                  <h3 style={{
                    fontSize: "20px",
                    color: "var(--color-grey-52)",
                    marginBottom: "12px",
                    fontWeight: "600"
                  }}>
                    Dikkat
                  </h3>
                  <div style={{
                    color: "var(--color-grey-53)",
                    fontSize: "16px",
                    lineHeight: "1.6"
                  }}>
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
                  </div>
                </div>
              )}

              {selectedDocument.docWhere && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "18px",
                  borderRadius: "14px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(5px)",
                  marginTop: "18px"
                }}>
                  <h3 style={{
                    fontSize: "20px",
                    color: "var(--color-grey-52)",
                    marginBottom: "12px",
                    fontWeight: "600"
                  }}>
                    Temin yeri
                  </h3>
                  <div style={{
                    color: "var(--color-grey-53)",
                    fontSize: "16px",
                    lineHeight: "1.6"
                  }}>
                    {selectedDocument.docWhere}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
                {selectedDocument.docSourceLink && (
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      padding: "15px 20px",
                      backgroundColor: "#004466",
                      color: "white",
                      border: "2px solid #00ffa2",
                      borderRadius: "16px",
                      minWidth: "150px",
                      fontSize: "18px",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      window.open(
                        selectedDocument.docSourceLink,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <span>Bağlantı</span>
                  </button>
                )}

                <button 
                  onClick={handleAction}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "15px 25px",
                    backgroundColor: isCompleted ? "#e74c3c" : "#2ecc71",
                    color: "white",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    minWidth: "200px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {isDemoMode ? "Dashboard'a Dön" : (isCompleted ? "Tamamlandı" : "Tamamla")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default WithUsDocumentDetail;