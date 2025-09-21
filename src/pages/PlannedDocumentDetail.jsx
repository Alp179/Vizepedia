import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  buildPaginatedUrl,
  getPageFromSearch,
} from "../utils/seoHelpers";

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
  // Tüm Hook'ları en üstte çağır
  const params = useParams();
  const location = useLocation();

  // Param ayrıştırmayı sağlamlaştır
  const looksLikeId = (v) =>
    !!v && (/^\d+$/.test(v) || v.startsWith("anonymous-"));
  const paramApplicationId = looksLikeId(params.id) ? params.id : undefined;
  const slugParam =
    params.slug || (!paramApplicationId ? params.id : undefined);

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

  // SEO için URL ve sayfa bilgileri
  const base = "https://www.vizepedia.com";
  const page = getPageFromSearch(location.search);
  const path = "/planned-documents";
  const canonical = buildPaginatedUrl(base, path, page);

  // Toplam sayfa (elinizde varsa real pagination'dan okuyun; yoksa prev/next üretimini güvenli yapalım)
  const hasPrev = page > 1;
  const hasNext = false; // Gerçek toplam sayfa sayınız varsa: page < totalPages
  const prevUrl = hasPrev ? buildPaginatedUrl(base, path, page - 1) : undefined;
  const nextUrl = hasNext ? buildPaginatedUrl(base, path, page + 1) : undefined;

  // Sayfa özel başlık/açıklama/keywords
  const title =
    page > 1
      ? `Planlanacak Belgeler – Sayfa ${page} | Vizepedia`
      : "Planlanacak Belgeler | Vizepedia";
  const description =
    "Vize başvurunuz için planlanacak belgeleri adım adım sıraladık. Gereklilikler, ipuçları ve temin yolları.";

  // Bot/new visitor URL handling - redirect to clean URL
  useEffect(() => {
    // Sadece bot/new visitor için ID'yi gizle; gerçek kullanıcıda ID'yi KORU
    if (isBotOrNewVisitor && paramApplicationId) {
      if (slugParam)
        navigate(`/planned-documents/${slugParam}`, { replace: true });
      else navigate("/planned-documents", { replace: true });
    }
  }, [isBotOrNewVisitor, paramApplicationId, slugParam, navigate]);

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

  const { data: documents } = useQuery({
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

  // Mount/yeniden yükleme: slug varsa ona git
  useEffect(() => {
    const docs = isBotOrNewVisitor ? DEMO_PLANNED_DOCUMENTS : documents;
    if (!docs) return;

    const planned = docs.filter((d) => d.docStage === "planla");
    if (!planned.length) return;

    if (slugParam) {
      const match = planned.find((d) => toSlug(d.docName) === slugParam);
      if (match) {
        setSelectedDocument(match);
        setCurrentDocumentIndex(
          planned.findIndex((d) => d.docName === match.docName)
        );
        return;
      }
    }
    // slug yoksa/ eşleşmezse ilk elemana düş
    if (!selectedDocument) {
      const first = planned[0];
      setSelectedDocument(first);
      setCurrentDocumentIndex(0);
      // Yalnızca gerçek kullanıcı + id varsa URL'i slug'la güncelle
      if (paramApplicationId) {
        navigate(
          `/planned-documents/${paramApplicationId}/${toSlug(first.docName)}`,
          { replace: true }
        );
      }
    }
  }, [
    isBotOrNewVisitor,
    documents,
    slugParam,
    setSelectedDocument,
    selectedDocument,
    paramApplicationId,
    navigate,
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

  // Calculate SEO metadata

  const docName = selectedDocument?.docName || "Belge Detayı";
  const slug = slugParam || toSlug(docName);
  const urlPath = `/planned-documents/${slug}`;
  const docCanonical = buildCanonical(base, urlPath);
  const docDescription = selectedDocument?.docDescription
    ? summarize(selectedDocument.docDescription, 160)
    : "Bu belge için planlama, gereklilikler ve hazırlanış adımları.";
  const docKeywords = keywordize(
    selectedDocument?.tags || [], // Boş array fallback ekledik
    `${docName}, planlanan belge, vize belgesi, Vizepedia`
  );
  const image = selectedDocument?.docImage || "/assets/images/default-doc.jpg";

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
    const docsToUse = isBotOrNewVisitor ? DEMO_PLANNED_DOCUMENTS : documents;
    if (!docsToUse) return;

    const planned = docsToUse.filter((d) => d.docStage === "planla");
    let nextIndex = currentDocumentIndex;

    if (direction === "prev" && currentDocumentIndex > 0) nextIndex -= 1;
    if (direction === "next" && currentDocumentIndex < planned.length - 1)
      nextIndex += 1;

    if (nextIndex !== currentDocumentIndex) {
      const nextDoc = planned[nextIndex];
      setSelectedDocument(nextDoc);
      setCurrentDocumentIndex(nextIndex);
      const nextSlug = toSlug(nextDoc.docName);
      const nextUrl = paramApplicationId
        ? `/planned-documents/${paramApplicationId}/${nextSlug}`
        : `/planned-documents/${nextSlug}`;
      navigate(nextUrl, { replace: true });
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

  // Sayfalama için gerekli bilgiler
  const pageSize = 10; // Bir sayfada gösterilecek belge sayısı
  const currentPageDocs = plannedDocuments; // Tüm belgeleri göster (gerçek bir sayfalama yapısı kurmak için bu kısmı güncellemeniz gerekebilir)

  // SEO için detay/liste ayrımı
  const isDetail = !!selectedDocument;
  const seoTitle = isDetail
    ? `${docName} – Planlama Rehberi | Vizepedia`
    : title;
  const seoDesc = isDetail ? docDescription : description;
  const seoUrl = isDetail ? docCanonical : canonical;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={docKeywords}
        url={seoUrl}
        {...(!isDetail && { prevUrl })}
        {...(!isDetail && { nextUrl })}
      />

      {/* ItemList sadece liste görünümünde (slug yokken) */}
      {!slugParam && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: (currentPageDocs || []).map((doc, idx) => ({
              "@type": "ListItem",
              position: idx + 1 + (page - 1) * (pageSize || 0),
              name: doc.docName,
              url: `${base}${path}/${toSlug(doc.docName)}`,
            })),
          }}
        />
      )}

      {/* Breadcrumb sadece liste için */}
      {!selectedDocument && (
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
                name: "Planlanacak Belgeler",
                item: `${base}${path}`,
              },
              ...(page > 1
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: `Sayfa ${page}`,
                      item: canonical,
                    },
                  ]
                : []),
            ],
          }}
        />
      )}

      {/* Breadcrumb sadece detay için */}
      {selectedDocument && (
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
                name: "Planlanan Belgeler",
                item: `${base}/planned-documents`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: docName,
                item: docCanonical,
              },
            ],
          }}
        />
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": selectedDocument.steps?.length ? "HowTo" : "Article",
          headline: `${docName} – Planlama Rehberi`,
          name: docName,
          description: docDescription,
          image: image.startsWith("http") ? image : `${base}${image}`,
          mainEntityOfPage: docCanonical,
          ...(selectedDocument.steps?.length
            ? {
                step: selectedDocument.steps.map((s, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  name: s.title || `Adım ${i + 1}`,
                  text: summarize(s.text || s.content || "", 300),
                })),
              }
            : {}),
        }}
      />

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
                      .split("\n-")
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
                <LocationSection>
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
