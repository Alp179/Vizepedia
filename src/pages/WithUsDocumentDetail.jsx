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
// Adding the required imports
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";

import {
  summarize,
  keywordize,
  toSlug,
  buildCanonical,
} from "../components/seoHelpers";

// Demo documents for "bizimle" stage - bot/new visitor data
const DEMO_WITHUS_DOCUMENTS = [
  {
    id: 73,
    docName: "Faaliyet Belgesi",
    docDescription:
      "Şirketin yasal olarak faal olduğunu gösteren resmi kayıt belgesi.",
    docImage:
      "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/faaliyet.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by9mYWFsaXlldC5wbmciLCJpYXQiOjE3NDg3ODkyMDUsImV4cCI6NjU0ODc0MTIwNX0.GKB9NBik-KIDZhIAuiYHTU5FEEdiaK5fDdBZnbj7ivk",
    docType: "Şirket Belgesi",
    docStage: "bizimle",
    docSource: "Ticaret Odası",
    docSourceLink: null,
    referenceLinks: "https://idata.com.tr/tr/",
    referenceName: "iDATA – Şirket Belgeleri",
    docImportant:
      "\n- Ticaret Odası tarafından düzenlenmiş olmalı.\n- Şirket adı, faaliyet alanı ve sicil numarası yer almalı.\n- Son 6 ay içinde alınmış olmalı.",
    docWhere: "İlgili Ticaret Odası'ndan alınabilir.",
    is_required: true,
    order_index: 8,
    estimatedCompletionTime: "Vizepedia ile",
  },
  {
    id: 90,
    docName: "Seyahat Sağlık Sigortası",
    docDescription:
      "Seyahat süresince yurt dışında geçerli, zorunlu seyahat sağlık sigortası poliçesi.",
    docImage:
      "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/sigorta.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by9zaWdvcnRhLnBuZyIsImlhdCI6MTc0ODc4OTM0NSwiZXhwIjo3NDQ4MjEyMzk0NX0.k2Bv8LtHWxQ9eRzA5nY3jG4fKpE6sT7bC8wX1uH2fDo",
    docType: "Sigorta Belgesi",
    docStage: "bizimle",
    docSource: "Sigorta Şirketi",
    docSourceLink: null,
    referenceLinks: "https://visa.vfsglobal.com/tur/tr/deu/what-to-submit",
    referenceName: "VFS Global – Seyahat Sağlık Sigortası",
    docImportant:
      "\n- En az 30.000 Euro teminatlı olmalı.\n- Tüm seyahat süresini kapsamalı.\n- Başvuru sahibinin adı yer almalı.",
    docWhere:
      "Bankalar, mobil bankacılık sistemleri, sigorta acenteleri veya online sigorta platformlarından alınabilir.",
    is_required: true,
    order_index: 4,
    estimatedCompletionTime: "Vizepedia ile",
  },
  {
    id: 95,
    docName: "Vize Başvuru Formu",
    docDescription:
      "Konsolosluk tarafından belirlenen resmi vize başvuru formu. Tüm bilgiler eksiksiz ve doğru olarak doldurulmalıdır.",
    docImage:
      "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/vizeform.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by92aXplZm9ybS5wbmciLCJpYXQiOjE3NDg3ODkzODUsImV4cCI6NzQ0ODIxMjM5ODV9.X3bY2eK5qT8vF9jR6pS4wL1nH7cA9tGmE6uV5iO3xJz",
    docType: "Başvuru Belgesi",
    docStage: "bizimle",
    docSource: "Konsolosluk",
    docSourceLink: "https://visa.vfsglobal.com/tur/tr/deu/apply-visa",
    referenceLinks: "https://visa.vfsglobal.com/tur/tr/deu/apply-visa",
    referenceName: "VFS Global – Vize Başvuru Formu",
    docImportant:
      "\n- Tüm alanlar doldurulmalı.\n- İmza ve tarih atılmalı.\n- Fotokopi değil orijinal form kullanılmalı.",
    docWhere:
      "Konsolosluk web sitesinden indirilebilir veya VFS merkezlerinden alınabilir.",
    is_required: true,
    order_index: 1,
    estimatedCompletionTime: "Vizepedia ile",
  },
  {
    id: 96,
    docName: "Davet Mektubu",
    docDescription:
      "Seyahat edilecek ülkede bulunan kişi, kurum veya şirket tarafından düzenlenen resmi davet mektubu.",
    docImage:
      "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/davet.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by9kYXZldC5wbmciLCJpYXQiOjE3NDg3ODk0MjUsImV4cCI6NzQ0ODIxMjQwMjV9.M9nP6bL5tR8aF2cX7jS3wK4hG1vQ9eY6uT5nI8rA3oZ",
    docType: "Destek Belgesi",
    docStage: "bizimle",
    docSource: "Davet Eden Taraf",
    docSourceLink: null,
    referenceLinks: "https://idata.com.tr/tr/",
    referenceName: "iDATA – Davet Mektubu Örnekleri",
    docImportant:
      "\n- Davet edenin kimlik bilgileri yer almalı.\n- Seyahat tarihleri ve amacı belirtilmeli.\n- İmza ve kaşe bulunmalı.",
    docWhere: "Seyahat edilecek ülkedeki davet eden tarafından hazırlanır.",
    is_required: false,
    order_index: 10,
    estimatedCompletionTime: "Vizepedia ile",
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
    "Faaliyet Belgesi": false,
    "Seyahat Sağlık Sigortası": true,
    "Vize Başvuru Formu": false,
    "Davet Mektubu": true,
    // Mixed completion status for realistic demo
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

  @media (max-width: 680px) {
    position: static;
    transform: none;
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
  margin-top: 0;
  @media (max-width: 800px) {
    order: 2;
  }
`;

const LocationSection = styled(SectionContainer)`
  margin-top: 18px;
  @media (max-width: 800px) {
    order: 3;
  }
`;

const StyledButtonsContainer = styled(ButtonsContainer)`
  @media (max-width: 800px) {
    order: 4;
  }
`;

const WithUsDocumentDetail = () => {
  // Tüm Hook'ları en üstte çağır
  const { id: paramApplicationId, slug: slugParam } = useParams();

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
      navigate("/withus-documents", { replace: true });
    }
  }, [isBotOrNewVisitor, paramApplicationId, navigate]);

  console.log("🔍 WithUsDocumentDetail Debug:");
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
      const withusDocuments = DEMO_WITHUS_DOCUMENTS.filter(
        (doc) => doc.docStage === "bizimle"
      );
      const initialDocument = withusDocuments[0];

      if (initialDocument) {
        console.log(
          "🎯 Bot/New Visitor: Setting initial withus document:",
          initialDocument.docName
        );
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    } else if (isDocumentsSuccess && documents) {
      // Real documents for authenticated/anonymous users
      const withusDocuments = documents.filter(
        (doc) => doc.docStage === "bizimle"
      );
      const initialDocument = withusDocuments[0];

      if (initialDocument && !selectedDocument) {
        console.log(
          "🎯 Real User: Setting initial withus document:",
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
        ? DEMO_WITHUS_DOCUMENTS
        : documents;
      if (documentsToUse) {
        const withusDocuments = documentsToUse.filter(
          (doc) => doc.docStage === "bizimle"
        );
        const index = withusDocuments.findIndex(
          (doc) => doc.docName === selectedDocument.docName
        );
        setCurrentDocumentIndex(index);
      }
    }
  }, [selectedDocument, documents, isBotOrNewVisitor]);

  if (!selectedDocument) {
    return <Spinner />;
  }

  // Calculate SEO metadata
  const base = "https://www.vizepedia.com";
  const docName = selectedDocument?.docName || "Belge Hizmeti";
  const slug = slugParam || toSlug(docName);
  const urlPath = `/withus-documents/${slug}`;
  const canonical = buildCanonical(base, urlPath);
  const description = selectedDocument?.docDescription
    ? summarize(selectedDocument.docDescription, 160)
    : selectedDocument?.benefits
    ? summarize(selectedDocument.benefits, 160)
    : "Belgenizi uzman ekibimizle hızlı ve eksiksiz hazırlayın.";
  const keywords = keywordize(
    selectedDocument?.tags,
    `${docName}, belge hizmeti, profesyonel destek, Vizepedia`
  );
  const image = selectedDocument?.docImage || "/vite.svg";
  const isModal = false; // Since this is a page component, not a modal

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
      ? DEMO_WITHUS_DOCUMENTS
      : documents;
    if (!documentsToUse) return;

    const withusDocuments = documentsToUse.filter(
      (doc) => doc.docStage === "bizimle"
    );

    console.log("🔄 Navigation Debug:");
    console.log("direction:", direction);
    console.log("currentIndex:", currentDocumentIndex);
    console.log("withusDocuments length:", withusDocuments.length);

    if (direction === "prev" && currentDocumentIndex > 0) {
      const nextDoc = withusDocuments[currentDocumentIndex - 1];
      console.log("Going to previous:", nextDoc.docName);
      setSelectedDocument(nextDoc);
    } else if (
      direction === "next" &&
      currentDocumentIndex < withusDocuments.length - 1
    ) {
      const nextDoc = withusDocuments[currentDocumentIndex + 1];
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

  // Get withus documents
  const documentsToUse = isBotOrNewVisitor ? DEMO_WITHUS_DOCUMENTS : documents;
  const withusDocuments = documentsToUse
    ? documentsToUse.filter((doc) => doc.docStage === "bizimle")
    : [];

  return (
    <>
      <SEO
        title={`${docName} – Profesyonel Belge Hizmeti | Vizepedia`}
        description={description}
        keywords={keywords}
        image={image}
        url={canonical}
        noindex={isModal}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${docName} – Belge Hizmeti`,
          description: description,
          provider: {
            "@type": "Organization",
            name: "Vizepedia",
            url: base,
          },
          areaServed: "TR",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Ana Sayfa",
              item: `${base}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Bizimle Belgeler",
              item: `${base}/withus-documents`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: docName,
              item: canonical,
            },
          ],
        }}
      />
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

        <DocProgress>
          {withusDocuments.map((_, index) => (
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
                readyDocuments={withusDocuments}
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

export default WithUsDocumentDetail;
