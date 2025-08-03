/* eslint-disable no-unused-vars */
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { HiDocument, HiPlus } from "react-icons/hi2";
import { MdClose, MdDelete } from "react-icons/md";
import AllDocs from "./AllDocs";
import { useContext, useEffect, useState } from "react";
import { useDocuments } from "../context/DocumentsContext";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserSelectionsNav,
  fetchUserSelectionsDash,
} from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import { useVisaApplications } from "../context/VisaApplicationContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions"; // ← EKLENDI
import { AnonymousDataService } from "../utils/anonymousDataService"; // ← EKLENDI

import toast, { Toaster } from "react-hot-toast";
import { deleteVisaApplication } from "../services/apiDeleteVisaApp";
import ModalDocs from "./ModalDocs";
import { useUser } from "../features/authentication/useUser";
// NEW: Import MultiStepOnboardingModal
import { AnonymousDataService } from "../utils/anonymousDataService";
import MultiStepOnboardingModal from "../ui/MultiStepOnboardingModal";

// PRESERVED: All existing keyframes
const glowing = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// PRESERVED: All existing styled components
const GlowButton = styled.button`
  width: 220px;
  height: 50px;
  border: none;
  outline: none;
  font-weight: bold;
  color: var(--color-grey-913);
  background: var(--color-grey-914);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;

  &:before {
    content: "";
    background: linear-gradient(
      -45deg,
      #004466,
      #004466,
      #87f9cd,
      #87f9cd,
      #87f9cd,
      #004466,
      #004466
    );
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    animation: ${glowing} 20s linear infinite;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    border-radius: 10px;
  }

  &:after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--color-grey-914);
    left: 0;
    top: 0;
    border-radius: 10px;
  }

  &:hover {
    color: #004466;
  }

  &:hover:after {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    color: #000;
  }

  &:active:after {
    background: transparent;
  }

  @media (max-width: 1300px) {
    width: 180px;
  }

  @media (max-width: 1050px) {
    width: 150px;
    font-size: 14px;
  }
`;

// NEW: Welcome button for new visitors - Updated with better styling
const WelcomeButton = styled.button`
  width: 220px;
  height: 50px;
  border: 2px solid #00ffa2;
  outline: none;
  font-weight: bold;
  color: var(--color-grey-913);
  background: linear-gradient(135deg, #004466, #0066aa);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #00ffa2;
    color: #004466;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 162, 0.3);
  }

  @media (max-width: 1300px) {
    width: 180px;
  }

  @media (max-width: 1050px) {
    width: 150px;
    font-size: 14px;
  }
`;

const NavList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
  @media (max-width: 710px) {
    display: none;
  }
`;

// PRESERVED: All existing styled components
const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: absolute;
  right: 16px;
  margin-left: auto;
  opacity: 0;
  transform: scale(0.8);

  & svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    transform: scale(1.1);
  }

  @media (max-width: 1300px) {
    width: 28px;
    height: 28px;
    right: 8px;
    & svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  min-height: 65px;
  width: 90%;
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 50px;

  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    background-color: transparent;
    position: relative;
    @media (max-width: 1300px) {
      gap: 0.6rem;
      font-size: 14px;
      width: 150px;
      padding-right: 40px;
    }
    @media (max-width: 1050px) {
      width: 130px;
      gap: 8px;
      font-size: 13px;
      padding-right: 36px;
    }
  }

  &.active:visited,
  &.active:link {
    width: 100%;
    background: var(--color-grey-905);
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }

  &:hover ${ActionButton} {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
`;

// PRESERVED: All modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  animation: ${fadeIn} 0.3s forwards;
`;

const ConfirmationModal = styled.div`
  background-color: var(--color-grey-914);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  animation: ${modalFadeIn} 0.3s ease;
  border: 1px solid var(--color-grey-920);

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: var(--color-grey-600);

  svg {
    margin-right: 12px;
    color: #e74c3c;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
`;

const ModalContent = styled.p`
  color: var(--color-grey-600);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--color-grey-920);
  color: var(--color-grey-600);

  &:hover {
    background-color: var(--color-grey-905);
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

const ScrollableDiv = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-grey-920);
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  width: 110%;
  margin: 0 auto;
  margin-left: -10px;
  @media (max-width: 1300px) {
    width: 112%;
  }
  @media (max-width: 1050px) {
    width: 117%;
    gap: 4px;
  }
  @media (max-height: 830px) {
    max-height: 250px;
  }
  @media (max-height: 700px) {
    max-height: 150px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-920);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
`;

const AllDocsButton = styled(NavLink)`
  flex-shrink: 0;
  min-height: 65px;
  width: 90%;
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    background-color: transparent !important;
    position: relative;
    @media (max-width: 1300px) {
      gap: 0.6rem;
      font-size: 14px;
      width: 150px;
    }
    @media (max-width: 1050px) {
      width: 200px !important;
      margin-left: -10px;
      gap: 8px;
      font-size: 13px;
    }
  }

  &:hover {
    transform: scale(1.05);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: #004466;
    transition: all 0.3s;
  }

  &:hover svg {
    color: #00ffa2;
  }
`;

// NEW: Simple button for new visitors (no link)
const SimpleButton = styled.button`
  flex-shrink: 0;
  min-height: 65px;
  width: 90%;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  transition: all 0.3s;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-align: left;

  @media (max-width: 1300px) {
    gap: 0.6rem;
    font-size: 14px;
    width: 150px;
  }
  @media (max-width: 1050px) {
    width: 200px;
    margin-left: -10px;
    gap: 8px;
    font-size: 13px;
  }

  &:hover {
    transform: scale(1.05);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: #004466;
    transition: all 0.3s;
  }

  &:hover svg {
    color: #00ffa2;
  }
`;

const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 120px;
  overflow: hidden;

  @media (max-width: 1300px) {
    max-width: 100px;
  }

  @media (max-width: 1050px) {
    max-width: 80px;
  }
`;

const AppTitle = styled.span`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AppSubtitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9em;
  opacity: 0.8;
`;

function MainNav() {
  // PRESERVED: All existing state
  const [userId, setUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  // NEW: Multi-step onboarding modal state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const navigate = useNavigate();
  const { id: applicationId } = useParams();
  const {
    state: { completedDocuments },
    dispatch: documentsDispatch,
  } = useDocuments();
  const { setSelectedDocument } = useSelectedDocument();
  const {
    applications,
    refreshApplications,
    dispatch: applicationsDispatch,
  } = useVisaApplications();

  // NEW: Additional user type detection (non-breaking)
  const { userType } = useUser();

  // PRESERVED: All existing useEffect hooks
  useEffect(() => {
    refreshApplications();
  }, [applicationId, refreshApplications]);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  // UPDATED: Use SAME query keys as Dashboard.jsx
  const userSelectionsQuery = useQuery({
    queryKey: ["userSelections", userId, applicationId, userType], // ← Dashboard ile aynı
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  const documentNames = userSelectionsQuery.data
    ? getDocumentsForSelections(userSelectionsQuery.data)
    : [];

  const documentsQuery = useQuery({
    queryKey: ["documentDetails", documentNames], // ← Dashboard ile aynı
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

<<<<<<< Updated upstream
  // PRESERVED: All existing functions
  // MainNav.jsx içinde continueToDocument fonksiyonunu şu şekilde değiştir:

// UPDATED: Enhanced continueToDocument function with proper application ID handling
const continueToDocument = () => {
  // DEBUG: Log all relevant data
  console.log("🚀 MainNav continueToDocument called");
  console.log("📊 documentsQuery.data:", documentsQuery.data);
  console.log("👤 userId:", userId);
  console.log("🆔 applicationId:", applicationId);
  console.log("📁 completedDocuments:", completedDocuments);
  
  if (!documentsQuery.data) {
    console.log("❌ No documentsQuery.data");
    return;
  }
  
  if (!userId) {
    console.log("❌ No userId");
    return;
  }
  
  if (!applicationId) {
    console.log("❌ No applicationId");
    return;
  }

  // Get user type to determine how to handle application ID
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";
  
  // Determine the correct application ID for completed documents lookup
  let lookupApplicationId;
  if (isAnonymous) {
    // For anonymous users, use consistent anonymous application ID
    lookupApplicationId = AnonymousDataService.getConsistentApplicationId();
  } else {
    // For authenticated users, use the real application ID from URL
    lookupApplicationId = applicationId;
  }

  console.log("🔍 MainNav continueToDocument Debug:");
  console.log("Original applicationId:", applicationId);
  console.log("isAnonymous:", isAnonymous);
  console.log("lookupApplicationId:", lookupApplicationId);
  console.log("completedDocuments:", completedDocuments);
  console.log("completedDocuments[lookupApplicationId]:", completedDocuments[lookupApplicationId]);

  // Find first incomplete document using the correct application ID
  const firstIncompleteIndex = documentsQuery.data.findIndex(
    (doc) => {
      const isCompleted = completedDocuments[lookupApplicationId] && 
                         completedDocuments[lookupApplicationId][doc.docName];
      console.log(`📄 Document ${doc.docName}: isCompleted = ${isCompleted}`);
      return !isCompleted;
    }
  );

  console.log("📄 firstIncompleteIndex:", firstIncompleteIndex);

  if (firstIncompleteIndex !== -1) {
    const selectedDocument = documentsQuery.data[firstIncompleteIndex];
    console.log("📄 selectedDocument:", selectedDocument);
    
    setSelectedDocument(selectedDocument);

    // Navigate based on document stage, using original applicationId for URL consistency
    const urlApplicationId = applicationId; // Keep original for URL
    
    if (selectedDocument.docStage === "hazir") {
      console.log("🔗 Navigate to ready-documents:", `/ready-documents/${urlApplicationId}`);
      navigate(`/ready-documents/${urlApplicationId}`);
    } else if (selectedDocument.docStage === "planla") {
      console.log("🔗 Navigate to planned-documents:", `/planned-documents/${urlApplicationId}`);
      navigate(`/planned-documents/${urlApplicationId}`);
    } else if (selectedDocument.docStage === "bizimle") {
      console.log("🔗 Navigate to withus-documents:", `/withus-documents/${urlApplicationId}`);
      navigate(`/withus-documents/${urlApplicationId}`);
    } else {
      // Fallback to documents route
      console.log("🔗 Navigate to documents (fallback):", `/documents/${selectedDocument.id}`);
      navigate(`/documents/${selectedDocument.id}`);
=======
  // ENHANCED: Dashboard ile aynı completedDocuments yükleme mekanizması
  useEffect(() => {
    console.log("🔄 MainNav - Loading completed documents...");
    console.log(
      "userType:",
      userType,
      "userId:",
      userId,
      "applicationId:",
      applicationId
    );
    console.log("userSelections:", userSelectionsQuery.data);

    if (
      userType === "authenticated" &&
      userId &&
      userSelectionsQuery.data?.length > 0
    ) {
      // Dashboard ile aynı: Real application ID kullan
      const realApplicationId = userSelectionsQuery.data[0].id;

      console.log(
        "🔄 Fetching completed documents with real ID:",
        realApplicationId
      );
      fetchCompletedDocuments(userId, realApplicationId)
        .then((data) => {
          console.log("📋 MainNav - Raw completed documents:", data);

          if (data && data.length > 0) {
            const completedDocsMap = data.reduce((acc, doc) => {
              if (!acc[realApplicationId]) {
                acc[realApplicationId] = {};
              }
              acc[realApplicationId][doc.document_name] = true;
              return acc;
            }, {});

            console.log(
              "✅ MainNav - Formatted completed documents:",
              completedDocsMap
            );

            documentsDispatch({
              type: "SET_COMPLETED_DOCUMENTS",
              payload: completedDocsMap,
            });
          }
        })
        .catch((error) => {
          console.error(
            "❌ MainNav - Error fetching completed documents:",
            error
          );
        });
    } else if (userType === "anonymous" && applicationId) {
      // Anonymous user logic
      const anonymousCompletedDocs =
        AnonymousDataService.fetchCompletedDocuments(applicationId);
      const completedDocsMap = anonymousCompletedDocs.reduce((acc, doc) => {
        if (!acc[applicationId]) {
          acc[applicationId] = {};
        }
        acc[applicationId][doc.document_name] = true;
        return acc;
      }, {});

      documentsDispatch({
        type: "SET_COMPLETED_DOCUMENTS",
        payload: completedDocsMap,
      });
    }
  }, [
    userType,
    userId,
    userSelectionsQuery.data,
    applicationId,
    documentsDispatch,
  ]);

  // ENHANCED: Real application ID ile tamamlanma kontrolü
  const continueToDocument = () => {
    const documents = documentsQuery.data;

    console.log("🔗 MainNav continueToDocument:");
    console.log("documents:", documents);
    console.log("applicationId:", applicationId);
    console.log("completedDocuments:", completedDocuments);

    if (!documents || documents.length === 0) {
      console.log("No documents found");
      return;
    }

    // Dashboard ile aynı: Real application ID kullan
    const realApplicationId =
      userSelectionsQuery.data?.[0]?.id || applicationId;
    console.log("Real application ID for completion check:", realApplicationId);
    console.log(
      "Completed docs for real ID:",
      completedDocuments[realApplicationId]
    );

    // StepIndicator ile AYNI MANTIK - Real ID ile kontrol
    const firstIncompleteIndex = documents.findIndex((doc) => {
      const isCompleted = completedDocuments[realApplicationId]?.[doc.docName];
      console.log(`Document ${doc.docName}: completed = ${isCompleted}`);
      return !isCompleted;
    });

    console.log("First incomplete index:", firstIncompleteIndex);

    if (firstIncompleteIndex !== -1) {
      const selectedDocument = documents[firstIncompleteIndex];
      setSelectedDocument(selectedDocument);

      console.log("Navigating with docStage:", selectedDocument.docStage);

      // StepIndicator ile AYNI YÖNLENDİRME - URL için original applicationId kullan
      if (selectedDocument.docStage === "hazir") {
        navigate(`/ready-documents/${applicationId}`);
      } else if (selectedDocument.docStage === "planla") {
        navigate(`/planned-documents/${applicationId}`);
      } else if (selectedDocument.docStage === "bizimle") {
        navigate(`/withus-documents/${applicationId}`);
      } else {
        navigate(`/documents/${selectedDocument.id}`);
      }
    } else {
      console.log("All documents completed!");
      toast.success("Tüm belgeler tamamlandı! 🎉", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        iconTheme: {
          primary: "#00ffa2",
          secondary: "#333",
        },
      });
>>>>>>> Stashed changes
    }
  } else {
    console.log("📋 All documents completed, staying on dashboard");
    // All documents are completed, optionally show a message or stay on dashboard
  }
};

  const openDeleteModal = (appId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAppId(appId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAppId(null);
  };

  const handleDelete = async () => {
    if (!selectedAppId) return;

    try {
      await deleteVisaApplication(selectedAppId);
      applicationsDispatch({
        type: "DELETE_APPLICATION",
        payload: selectedAppId,
      });
      toast.success("Vize başvurusu başarıyla silindi!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        iconTheme: {
          primary: "#00ffa2",
          secondary: "#333",
        },
      });
      navigate("/dashboard");
      closeDeleteModal();
    } catch (error) {
      toast.error("Vize başvurusu silinemedi.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      closeDeleteModal();
    }
  };

  // UPDATED: New handlers for new visitors - Open onboarding modal
  const handleGetStarted = () => {
    setShowOnboardingModal(true);
  };

  // NEW: Handle onboarding completion - same as Header.jsx
  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);

    // Force page refresh to update dashboard
    console.log("Onboarding completed, refreshing page to update dashboard");
    window.location.reload();
  };

  const handleShowDocs = () => {
    // Belgeler butonuna tıklama - sadece görsel
    console.log("Show docs button clicked");
  };

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  // NEW: Check for new visitors (ADDITIVE logic)
  const isNewVisitor = userType === "new_visitor";

  return (
    <>
      <nav className="navbar-dash">
        <Toaster />

        {/* UPDATED: Different button for new visitors - now opens onboarding modal */}
        {isNewVisitor ? (
          <WelcomeButton onClick={handleGetStarted}>Başlayın</WelcomeButton>
        ) : (
          <GlowButton onClick={continueToDocument}>Devam et</GlowButton>
        )}

        <NavList>
          {/* NEW: Simplified navigation for new visitors */}
          {isNewVisitor ? (
            <></>
          ) : (
            <>
              {/* PRESERVED: All existing navigation for other users */}
              <li>
                <ModalDocs>
                  <ModalDocs.Open opens="allDocs">
                    <AllDocsButton style={{ width: "100%" }}>
                      <HiDocument
                        className="mainnavicons"
                        style={{ color: "var(--color-grey-924)" }}
                      />
                      <span className="sidebartext">Tüm belgeler</span>
                    </AllDocsButton>
                  </ModalDocs.Open>
                  <ModalDocs.Window name="allDocs">
                    <AllDocs style={{ color: "var(--color-grey-924)" }} />
                  </ModalDocs.Window>
                </ModalDocs>
              </li>
              <ScrollableDiv>
                {applications
                  .sort((a, b) => b.id - a.id) // ← EN BÜYÜK ID EN ÜSTTE
                  .map((app) => (
                    <li className="mainnav-buzlucam" key={app.id}>
                      <StyledNavLink to={`/dashboard/${app.id}`}>
                        <AppInfo>
                          <AppTitle>{app.ans_country}</AppTitle>
                          <AppSubtitle>
                            {app.ans_purpose} - {app.ans_profession}
                          </AppSubtitle>
                        </AppInfo>
                        {applications.length > 1 && (
                          <ActionButton
                            onClick={(e) => openDeleteModal(app.id, e)}
                            aria-label="Vize başvurusunu sil"
                            title="Vize başvurusunu sil"
                          >
                            <MdDelete />
                          </ActionButton>
                        )}
                      </StyledNavLink>
                    </li>
                  ))}
              </ScrollableDiv>
              <li>
                <SimpleButton onClick={handleGetStarted}>
                  <HiPlus
                    className="mainnavicons"
                    style={{ color: "var(--color-grey-924)" }}
                  />
                  <span className="sidebartext">Yeni</span>
                </SimpleButton>
              </li>
            </>
          )}
        </NavList>

        {/* PRESERVED: Delete confirmation modal */}
        {showDeleteModal && (
          <ModalOverlay onClick={closeDeleteModal}>
            <ConfirmationModal onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <MdDelete size={24} />
                <h3>Vize Başvurusunu Sil</h3>
              </ModalHeader>
              <ModalContent>
                Bu vize başvurusunu silmek istediğinizden emin misiniz? Bu işlem
                geri alınamaz.
              </ModalContent>
              <ModalActions>
                <CancelButton onClick={closeDeleteModal}>İptal</CancelButton>
                <DeleteButton onClick={handleDelete}>Sil</DeleteButton>
              </ModalActions>
            </ConfirmationModal>
          </ModalOverlay>
        )}
      </nav>

      {/* NEW: Multi-step onboarding modal - same as Header.jsx */}
      <MultiStepOnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleOnboardingComplete}
      />
    </>
  );
}

export default MainNav;
