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
import { AnonymousDataService } from "../utils/anonymousDataService";
import { useUser } from "../features/authentication/useUser";

// Demo documents for "planla" stage - bot/new visitor data
const DEMO_PLANNED_DOCUMENTS = [
  {
    id: 74,
    docName: "SGK İşe Giriş Belgesi",
    docDescription:
      "Başvuru sahibinin mevcut işine başlangıç tarihini gösteren resmi belge.",
    docImage:
      "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/isegiris.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by9pc2VnaXJpcy5wbmciLCJpYXQiOjE3NDg3ODY1MzAsImV4cCI6MTEzNDg3NzY5MzB9.AlAkGwYLH7zk3pnr82A-3foI2-ZuYf6P3b6mUadbKyc",
    docType: "İş Belgesi",
    docStage: "planla",
    docSource: "e-Devlet / SGK",
    docSourceLink:
      "https://www.turkiye.gov.tr/sgk-esgkuyg-esgksifre-ise-giris-isten-ayrilis",
    referenceLinks: "https://www.turkiye.gov.tr/sgk-ise-giris-bildirgesi",
    referenceName: "e-Devlet – SGK İşe Giriş Bildirgesi",
    docImportant:
      "\n- İşe giriş tarihi açıkça görünmeli.\n- Başvuru sahibine ait olmalı.\n- Barkodlu olmalı.",
    docWhere: "e-Devlet üzerinden alınabilir.",
    is_required: true,
    order_index: 4,
    estimatedCompletionTime: "1-2 gün",
  },
  {
    id: 92,
    docName: "Son 3 Aylık Maaş Bordrosu",
    docDescription:
      "Başvuru sahibinin çalıştığı kuruma ait, son 3 aya dair maaş bilgilerini içeren resmi belgedir.",
    docImage:
      "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/maasbordro.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by9tYWFzYm9yZHJvLnBuZyIsImlhdCI6MTc0ODc4OTI0NSwiZXhwIjo3NDQ4MjEyMzY0NX0.6Fc1J8frp5xoX1YYqXgkY0wXtbrj5W7iJZEEsq-GRxU",
    docType: "Mali Belge",
    docStage: "planla",
    docSource: "İşveren",
    docSourceLink: null,
    referenceLinks: "https://idata.com.tr/tr/",
    referenceName: "iDATA – Çalışanlar İçin Gerekli Belgeler",
    docImportant:
      "\n- Bordroda tarih, net maaş, işveren imzası ve kaşe bulunmalı.\n- PDF veya fiziksel çıktı kabul edilir.\n- Güncel ve işverence onaylı olmalı.",
    docWhere: "İşverenin insan kaynakları veya muhasebe biriminden alınır.",
    is_required: true,
    order_index: 12,
    estimatedCompletionTime: "2-3 gün",
  },
  {
    id: 85,
    docName: "İş Yeri Belgesi",
    docDescription:
      "Çalışılan şirketin faaliyetlerini ve çalışan bilgilerini gösteren resmi belge.",
    docImage:
      "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/isyeri.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by9pc3llcmkucG5nIiwiaWF0IjoxNzQ4Nzg5MjkzLCJleHAiOjc0NDgyMTIzOTMzfQ.Lhj1V5f5Qd6LQrA5WmW5c_-1J4K8B7qYx3A9gG5jX4E",
    docType: "İş Belgesi",
    docStage: "planla",
    docSource: "İşveren / SGK",
    docSourceLink:
      "https://www.turkiye.gov.tr/sgk-sigorta-hizmet-bilgi-sistemi",
    referenceLinks: "https://www.turkiye.gov.tr/sgk-isyeri-bilgileri",
    referenceName: "e-Devlet – SGK İşyeri Bilgileri",
    docImportant:
      "\n- İşyeri sicil numarası görünmeli.\n- Çalışan bilgileri güncel olmalı.\n- İşveren onayı bulunmalı.",
    docWhere: "İşverenden veya SGK'dan alınabilir.",
    is_required: true,
    order_index: 5,
    estimatedCompletionTime: "1-3 gün",
  },
];

// Demo user data for bot/new visitors
const DEMO_USER_DATA = {
  id: 405,
  name: "Demo User",
  email: "demo@vizepedia.com",
};

const DEMO_COMPLETED_DOCUMENTS = {
  [DEMO_USER_DATA.id]: {
    "SGK İşe Giriş Belgesi": true,
    "Son 3 Aylık Maaş Bordrosu": false,
    "İş Yeri Belgesi": false,
    // Intentionally mixed completion status for demo
  },
};

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
  padding: 16px;
  border-radius: 20px;
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
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
  margin: 0 0 20px 32px;
  text-align: center;
  @media (max-width: 600px) {
    margin-left: 16px;
  }
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
  margin-top: 20px;
  color: var(--color-grey-53);
  font-size: 18px;
  line-height: 1.6;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  gap: 25px;
  flex-direction: row-reverse;

  @media (max-width: 800px) {
    flex-flow: column;
    gap: 15px;
    margin-top: 10px;
  }
`;

const DescriptionLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 18px;

  @media (max-width: 800px) {
    order: 1;
  }
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 5px;

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

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: rgba(142, 68, 173, 0.05);
  }

  @media (max-width: 800px) {
    order: 6;
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

const DocProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 30px;
  margin: 0 auto 10px;
  width: fit-content;
  z-index: 10;
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

  @media (max-width: 800px) {
    order: 1;
    margin-top: 0;
  }
`;

const SideComponents = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 800px) {
    width: 100%;
    order: 5;
  }
`;

// Dikkat ve Temin Yeri bölümleri için özel stilizasyonlar
const AttentionSection = styled(SectionContainer)`
  @media (max-width: 800px) {
    order: 2;
  }
`;

const LocationSection = styled(SectionContainer)`
  @media (max-width: 800px) {
    order: 3;
  }
`;

const StyledButtonsContainer = styled(ButtonsContainer)`
  @media (max-width: 800px) {
    order: 4;
  }
`;

const PlannedDocumentDetail = () => {
  const { id: paramApplicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const navigate = useNavigate();
  const { selectedDocument, setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

  // User type detection
  const { user, userType } = useUser();
  const isAnonymous =
    userType === "anonymous" ||
    (!user && paramApplicationId?.startsWith("anonymous-"));
  const isBotOrNewVisitor = userType === "bot" || userType === "new_visitor";

  const applicationId = paramApplicationId || `anonymous-${Date.now()}`;

  // Bot/new visitor URL handling - redirect to clean URL
  useEffect(() => {
    if (isBotOrNewVisitor && paramApplicationId) {
      // Redirect to clean URL without ID for bots/new visitors
      navigate("/planned-documents", { replace: true });
    }
  }, [isBotOrNewVisitor, paramApplicationId, navigate]);

  console.log("🔍 PlannedDocumentDetail Debug:");
  console.log("paramApplicationId:", paramApplicationId);
  console.log("applicationId:", applicationId);
  console.log("userType:", userType);
  console.log("user:", user ? "authenticated" : "none");
  console.log("isAnonymous:", isAnonymous);
  console.log("isBotOrNewVisitor:", isBotOrNewVisitor);

  // Query for real users (not bot/new visitors)
  const { data: userSelections } = useQuery({
    queryKey: ["userSelections", userId, applicationId, userType],
    queryFn: () => {
      if (isAnonymous) {
        return AnonymousDataService.convertToSupabaseFormat();
      }
      return fetchUserSelectionsDash(userId, applicationId);
    },
    enabled:
      !isBotOrNewVisitor && (isAnonymous || (!!userId && !!applicationId)),
    staleTime: 5 * 60 * 1000,
  });

  const documentNames =
    !isBotOrNewVisitor && userSelections
      ? getDocumentsForSelections(userSelections)
      : [];

  const { data: documents, isSuccess: isDocumentsSuccess } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !isBotOrNewVisitor && !!documentNames.length,
    staleTime: 5 * 60 * 1000,
  });

  // User detection
  useEffect(() => {
    if (isBotOrNewVisitor) {
      setUserId("demo-user");
      // Set demo completed documents for bot/new visitors
      dispatch({
        type: "SET_COMPLETED_DOCUMENTS",
        payload: DEMO_COMPLETED_DOCUMENTS,
      });
    } else if (isAnonymous) {
      setUserId("anonymous-user");
    } else {
      getCurrentUser().then((user) => {
        if (user) {
          setUserId(user.id);
        }
      });
    }
  }, [isBotOrNewVisitor, isAnonymous, dispatch]);

  // Document initialization - Force re-initialization when navigating
  useEffect(() => {
    if (isBotOrNewVisitor) {
      // Always reset for bot/new visitors to ensure fresh state
      setSelectedDocument(null);
      setCurrentDocumentIndex(0);

      // Set demo completed documents for bot/new visitors
      dispatch({
        type: "SET_COMPLETED_DOCUMENTS",
        payload: DEMO_COMPLETED_DOCUMENTS,
      });

      // Use demo documents for bot/new visitors
      const plannedDocuments = DEMO_PLANNED_DOCUMENTS.filter(
        (doc) => doc.docStage === "planla"
      );
      const initialDocument = plannedDocuments[0];

      if (initialDocument) {
        console.log(
          "🎯 Bot/New Visitor: Setting initial planned document:",
          initialDocument.docName
        );
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    } else if (isDocumentsSuccess && documents) {
      // Real documents for authenticated/anonymous users
      const plannedDocuments = documents.filter(
        (doc) => doc.docStage === "planla"
      );
      const initialDocument = plannedDocuments[0];

      if (initialDocument && !selectedDocument) {
        console.log(
          "🎯 Real User: Setting initial planned document:",
          initialDocument.docName
        );
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    }
  }, [
    isBotOrNewVisitor,
    isDocumentsSuccess,
    documents,
    dispatch,
    setSelectedDocument,
    selectedDocument,
  ]);

  useEffect(() => {
    if (selectedDocument) {
      const documentsToUse = isBotOrNewVisitor
        ? DEMO_PLANNED_DOCUMENTS
        : documents;
      if (documentsToUse) {
        const plannedDocuments = documentsToUse.filter(
          (doc) => doc.docStage === "planla"
        );
        const index = plannedDocuments.findIndex(
          (doc) => doc.docName === selectedDocument.docName
        );
        setCurrentDocumentIndex(index);
      }
    }
  }, [selectedDocument, documents, isBotOrNewVisitor]);

  if (!selectedDocument) {
    return <Spinner />;
  }

  // Get completion status
  const getCompletionStatus = () => {
    if (isBotOrNewVisitor) {
      return (
        DEMO_COMPLETED_DOCUMENTS[DEMO_USER_DATA.id]?.[
          selectedDocument?.docName
        ] || false
      );
    } else if (isAnonymous) {
      return (
        completedDocuments[applicationId]?.[selectedDocument?.docName] || false
      );
    } else if (userSelections?.length > 0) {
      return (
        completedDocuments[userSelections[0].id]?.[selectedDocument?.docName] ||
        false
      );
    }
    return false;
  };

  const isCompleted = getCompletionStatus();

  // Action handler
  const handleAction = async () => {
    if (!selectedDocument) return;

    try {
      if (isBotOrNewVisitor) {
        // Demo action for bot/new visitors
        const newStatus = !isCompleted;

        // Update demo completed documents in context
        const updatedDemoCompleted = {
          ...DEMO_COMPLETED_DOCUMENTS,
          [DEMO_USER_DATA.id]: {
            ...DEMO_COMPLETED_DOCUMENTS[DEMO_USER_DATA.id],
            [selectedDocument.docName]: newStatus,
          },
        };

        dispatch({
          type: "SET_COMPLETED_DOCUMENTS",
          payload: updatedDemoCompleted,
        });

        // Navigate back to demo dashboard
        navigate("/dashboard");
        return;
      }

      // Real action logic for authenticated/anonymous users
      if (isAnonymous) {
        const correctApplicationId =
          AnonymousDataService.getConsistentApplicationId();

        console.log("🎯 Anonymous user action:");
        console.log("URL applicationId:", applicationId);
        console.log("Correct applicationId:", correctApplicationId);

        if (isCompleted) {
          AnonymousDataService.uncompleteDocument(
            correctApplicationId,
            selectedDocument.docName
          );
          dispatch({
            type: "UNCOMPLETE_DOCUMENT",
            payload: {
              documentName: selectedDocument.docName,
              applicationId: correctApplicationId,
            },
          });
        } else {
          AnonymousDataService.completeDocument(
            correctApplicationId,
            selectedDocument.docName
          );
          dispatch({
            type: "COMPLETE_DOCUMENT",
            payload: {
              documentName: selectedDocument.docName,
              applicationId: correctApplicationId,
            },
          });
        }
      } else {
        // Authenticated user logic
        if (!userId || !userSelections || userSelections.length === 0) return;

        const realApplicationId = userSelections[0].id;

        console.log("🔄 Using real application ID for authenticated user:");
        console.log("URL applicationId:", applicationId);
        console.log("Real applicationId:", realApplicationId);

        if (isCompleted) {
          await uncompleteDocument(
            userId,
            selectedDocument.docName,
            realApplicationId
          );
          dispatch({
            type: "UNCOMPLETE_DOCUMENT",
            payload: {
              documentName: selectedDocument.docName,
              applicationId: realApplicationId,
            },
          });
          console.log(
            "✅ Document uncompleted and context updated with real ID"
          );
        } else {
          await completeDocument(
            userId,
            selectedDocument.docName,
            realApplicationId
          );
          dispatch({
            type: "COMPLETE_DOCUMENT",
            payload: {
              documentName: selectedDocument.docName,
              applicationId: realApplicationId,
            },
          });
          console.log("✅ Document completed and context updated with real ID");
        }
      }

      // Navigation logic
      console.log("🔄 Navigation after document action:");
      console.log("applicationId:", applicationId);
      console.log("user:", user);
      console.log("userType:", userType);

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
    const documentsToUse = isBotOrNewVisitor
      ? DEMO_PLANNED_DOCUMENTS
      : documents;
    if (!documentsToUse) return;

    const plannedDocuments = documentsToUse.filter(
      (doc) => doc.docStage === "planla"
    );

    console.log("🔄 Navigation Debug:");
    console.log("direction:", direction);
    console.log("currentIndex:", currentDocumentIndex);
    console.log("plannedDocuments length:", plannedDocuments.length);

    if (direction === "prev" && currentDocumentIndex > 0) {
      const nextDoc = plannedDocuments[currentDocumentIndex - 1];
      console.log("Going to previous:", nextDoc.docName);
      setSelectedDocument(nextDoc);
    } else if (
      direction === "next" &&
      currentDocumentIndex < plannedDocuments.length - 1
    ) {
      const nextDoc = plannedDocuments[currentDocumentIndex + 1];
      console.log("Going to next:", nextDoc.docName);
      setSelectedDocument(nextDoc);
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

  // Get planned documents
  const documentsToUse = isBotOrNewVisitor ? DEMO_PLANNED_DOCUMENTS : documents;
  const plannedDocuments = documentsToUse
    ? documentsToUse.filter((doc) => doc.docStage === "planla")
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

        <DocProgress>
          {plannedDocuments.map((_, index) => (
            <ProgressDot key={index} active={index === currentDocumentIndex} />
          ))}
        </DocProgress>

        <DocTitleCont>
          <DocumentTitle>{selectedDocument.docName}</DocumentTitle>
          <MetaInfo>
            <MetaTag>{selectedDocument.estimatedCompletionTime}</MetaTag>
            {selectedDocument.docType && (
              <MetaTag>{selectedDocument.docType}</MetaTag>
            )}
          </MetaInfo>
        </DocTitleCont>

        <InfoContainer>
          <DocumentDescription>
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

            <DescriptionLayout>
              <MainText>{selectedDocument.docDescription}</MainText>

              {selectedDocument.docImportant && (
                <AttentionSection>
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
                </AttentionSection>
              )}

              {selectedDocument.docWhere && (
                <LocationSection color="#3498db">
                  <SectionHeading>Temin yeri</SectionHeading>
                  <SectionContent>{selectedDocument.docWhere}</SectionContent>
                </LocationSection>
              )}

              <StyledButtonsContainer>
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
              </StyledButtonsContainer>
            </DescriptionLayout>
          </DocumentDescription>
        </InfoContainer>
      </PageContainer>
    </>
  );
};

export default PlannedDocumentDetail;
