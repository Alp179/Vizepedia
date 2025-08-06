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

// Real demo data from your system
const DEMO_DOCUMENTS = [
  {
    id: 70,
    docName: "Biyometrik Fotoğraf",
    docDescription: "Uluslararası standartlara uygun, nötr yüz ifadesiyle çekilmiş ve arka fonu beyaz olan biyometrik fotoğraftır. Son 6 ay içinde çekilmiş olsa bile daha önceki bir Schengen vize başvurusunda kullanıldıysa yenisi gereklidir.",
    docImage: "https://i.imgur.com/JXQjue1.png",
    docType: "Kimlik Belgesi",
    docStage: "hazir",
    docSource: "Fotoğraf Stüdyosu",
    docSourceLink: null,
    referenceLinks: "https://tuerkei.diplo.de/tr-tr/service/05-VisaEinreise/merkblatt-foto/2458222",
    referenceName: "Almanya Konsolosluğu – Fotoğraf Kriterleri",
    docImportant: "\n- Son 6 ay içinde çekilmiş olmalı.\n- 35x45 mm ölçülerinde.\n- Gözlük, şapka, filtre kullanılmamalı.",
    docWhere: "Fotoğraf stüdyolarında çekilir.",
    is_required: true,
    order_index: 1
  },
  {
    id: 75,
    docName: "Kimlik Fotokopisi",
    docDescription: "Başvuru sahibinin kimliğini doğrulamak amacıyla kullanılan resmi bir belgedir. Nüfus cüzdanının veya yeni tip Türkiye Cumhuriyeti kimlik kartının önlü arkalı fotokopisi sunulmalıdır.",
    docImage: "https://cdn1.ntv.com.tr/gorsel/ASNCXnWfxUOSE9tPS9ti6Q.jpg?width=1000&mode=both&scale=both&v=1457001462520",
    docType: "Kimlik Belgesi",
    docStage: "hazir",
    docSource: "Başvuru Sahibi",
    docSourceLink: null,
    referenceLinks: "https://idata.com.tr/tr/",
    referenceName: "iDATA – Kimlik Belgeleri",
    docImportant: "\n- Bilgiler okunaklı ve tam olmalı.\n- Yeni tip çipli kimlik önerilir.\n- Tüm kenarları görünür şekilde taranmalı.",
    docWhere: "Kimlik kartınızdan veya fotokopi cihazından temin edilir.",
    is_required: true,
    order_index: 2
  },
  {
    id: 67,
    docName: "Pasaport",
    docDescription: "Geçerli, okunaklı ve yıpranmamış, uluslararası geçerliliği olan seyahat belgesi.",
    docImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Turkish_Passport.svg/1024px-Turkish_Passport.svg.png",
    docType: "Seyahat Belgesi",
    docStage: "hazir",
    docSource: "Nüfus Müdürlüğü",
    docSourceLink: null,
    referenceLinks: "https://visa.vfsglobal.com/tur/tr/deu/what-to-submit",
    referenceName: "VFS Global – Gerekli Evraklar",
    docImportant: "\n- Başvuru bitiş tarihinden sonra en az 6 ay geçerlilik süresi olmalı.\n- En az 2 boş vize sayfası bulunmalı.\n- Son 10 yıl içinde düzenlenmiş olmalı.",
    docWhere: "Nüfus ve Vatandaşlık İşleri Müdürlüklerinden alınır.",
    is_required: true,
    order_index: 6
  },
  {
    id: 77,
    docName: "Nüfus Kayıt Örneği",
    docDescription: "Nüfus kayıt örneği, başvuru sahibinin kendisiyle birlikte aile bireylerini de gösteren resmi belgedir. E-Devlet üzerinden vukuatlı (detaylı) olarak alınmalı ve belgenin alt kısmındaki Düşünceler bölümü mutlaka görünür olmalıdır.",
    docImage: "https://online.fliphtml5.com/qatuj/hzjy/files/large/1.webp?1616318917&1616318917",
    docType: "Kimlik Belgesi",
    docStage: "hazir",
    docSource: "e-Devlet",
    docSourceLink: "https://www.turkiye.gov.tr/nvi-nufus-kayit-ornegi-belgesi-sorgulama",
    referenceLinks: "https://www.turkiye.gov.tr/nvi-nufus-kayit-ornegi-belgesi-sorgulama",
    referenceName: "e-Devlet – Nüfus Kayıt Örneği Sorgulama",
    docImportant: "\n- Düşünceler bölümü görünür olmalı.\n- Başvuru sahibine ait olmalı.\n- Son 6 ay içinde alınmış olmalı.",
    docWhere: "e-Devlet üzerinden alınabilir.",
    is_required: true,
    order_index: 7
  },
  {
    id: 69,
    docName: "İkametgah Belgesi",
    docDescription: "İkamet edilen adresin resmi kayıtlardaki karşılığını gösteren belgedir. Başvuru sahibinin güncel ve e-Devlet üzerinden alınmış ikamet bilgilerini içermelidir.",
    docImage: "https://imgv2-2-f.scribdassets.com/img/document/674042573/original/98365b2eef/1?v=1",
    docType: "İkamet Belgesi",
    docStage: "hazir",
    docSource: "e-Devlet",
    docSourceLink: "https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama",
    referenceLinks: "https://idata.com.tr/tr/",
    referenceName: "iDATA – Belgeler Listesi",
    docImportant: "\n- Son 6 ay içinde alınmış olmalı.\n- Başvuru sahibine ait olmalı.",
    docWhere: "e-Devlet üzerinden alınabilir.",
    is_required: true,
    order_index: 9
  },
  {
    id: 88,
    docName: "Otel Rezervasyonu",
    docDescription: "Seyahat süresince konaklama yapılacak yerleri gösteren otel veya konaklama rezervasyonudur. Tüm konaklama tarihleri başvuru formundaki tarihlerle uyumlu olmalıdır.",
    docImage: "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/docphoto/otel%20rez.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzYwNGI3M2Y4LWUxMjEtNDU0ZS1iNTgyLWY3OWE0MGVhNzkyYyJ9.eyJ1cmwiOiJkb2NwaG90by9vdGVsIHJlei5wbmciLCJpYXQiOjE3NDg3ODM3MTIsImV4cCI6MjQyMDcxNjUxMn0.q3i2Cl3BAsfQbn7ULYcv3UNgvJq15b0TJLJboJvg1XA",
    docType: "Konaklama Belgesi",
    docStage: "hazir",
    docSource: "Otel / Online Platform",
    docSourceLink: null,
    referenceLinks: "https://visa.vfsglobal.com/tur/tr/deu/what-to-submit",
    referenceName: "VFS Global – Konaklama Belgeleri",
    docImportant: "\n- Konaklama tarihleri seyahati tam olarak kapsamalı.\n- Başvuru sahibinin adı rezervasyonda yer almalı.\n- Rezervasyon onaylı olmalı.",
    docWhere: "Otel web siteleri veya online platformlardan alınabilir.",
    is_required: true,
    order_index: 8
  }
];

// Demo user data for bot/new visitors
const DEMO_USER_DATA = {
  id: 405,
  name: "Demo User",
  email: "demo@vizepedia.com"
};

const DEMO_COMPLETED_DOCUMENTS = {
  [DEMO_USER_DATA.id]: {
    "Biyometrik Fotoğraf": true,
    "Kimlik Fotokopisi": true,
    "Pasaport": true,
    "Otel Rezervasyonu": true,
    "İkametgah Belgesi": true
    // Others intentionally left incomplete
  }
};

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
      navigate("/ready-documents", { replace: true });
    }
  }, [isBotOrNewVisitor, paramApplicationId, navigate]);

  console.log("🔍 ReadyDocumentDetail Debug:");
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
    enabled: !isBotOrNewVisitor && (isAnonymous || (!!userId && !!applicationId)),
    staleTime: 5 * 60 * 1000,
  });

  const documentNames = !isBotOrNewVisitor && userSelections
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
      const readyDocuments = DEMO_DOCUMENTS.filter(
        (doc) => doc.docStage === "hazir"
      );
      const initialDocument = readyDocuments[0];

      if (initialDocument) {
        console.log("🎯 Bot/New Visitor: Setting initial document:", initialDocument.docName);
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    } else if (isDocumentsSuccess && documents) {
      // Real documents for authenticated/anonymous users
      const readyDocuments = documents.filter(
        (doc) => doc.docStage === "hazir"
      );
      const initialDocument = readyDocuments[0];

      if (initialDocument && !selectedDocument) {
        console.log("🎯 Real User: Setting initial document:", initialDocument.docName);
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    }
  }, [isBotOrNewVisitor, isDocumentsSuccess, documents, dispatch, setSelectedDocument]);

  useEffect(() => {
    if (selectedDocument) {
      const documentsToUse = isBotOrNewVisitor ? DEMO_DOCUMENTS : documents;
      if (documentsToUse) {
        const readyDocuments = documentsToUse.filter(
          (doc) => doc.docStage === "hazir"
        );
        const index = readyDocuments.findIndex(
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
      return DEMO_COMPLETED_DOCUMENTS[DEMO_USER_DATA.id]?.[selectedDocument?.docName] || false;
    } else if (isAnonymous) {
      return completedDocuments[applicationId]?.[selectedDocument?.docName] || false;
    } else if (userSelections?.length > 0) {
      return completedDocuments[userSelections[0].id]?.[selectedDocument?.docName] || false;
    }
    return false;
  };

  const isCompleted = getCompletionStatus();

  // Action handler
  const handleAction = async () => {
    if (!selectedDocument) return;

    try {
      if (isBotOrNewVisitor) {
        // Demo action for bot/new visitors - just show toast
        const newStatus = !isCompleted;
        
        // Update demo completed documents in context
        const updatedDemoCompleted = {
          ...DEMO_COMPLETED_DOCUMENTS,
          [DEMO_USER_DATA.id]: {
            ...DEMO_COMPLETED_DOCUMENTS[DEMO_USER_DATA.id],
            [selectedDocument.docName]: newStatus
          }
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
        const correctApplicationId = AnonymousDataService.getConsistentApplicationId();
        
        console.log("🎯 Anonymous user action:");
        console.log("URL applicationId:", applicationId);
        console.log("Correct applicationId:", correctApplicationId);
        
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
        
        console.log("🔄 Using real application ID for authenticated user:");
        console.log("URL applicationId:", applicationId);
        console.log("Real applicationId:", realApplicationId);
        
        if (isCompleted) {
          await uncompleteDocument(userId, selectedDocument.docName, realApplicationId);
          dispatch({
            type: "UNCOMPLETE_DOCUMENT",
            payload: { 
              documentName: selectedDocument.docName, 
              applicationId: realApplicationId
            },
          });
          console.log("✅ Document uncompleted and context updated with real ID");
        } else {
          await completeDocument(userId, selectedDocument.docName, realApplicationId);
          dispatch({
            type: "COMPLETE_DOCUMENT",
            payload: { 
              documentName: selectedDocument.docName, 
              applicationId: realApplicationId
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
    const documentsToUse = isBotOrNewVisitor ? DEMO_DOCUMENTS : documents;
    if (!documentsToUse) return;

    const readyDocuments = documentsToUse.filter((doc) => doc.docStage === "hazir");

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

  // Get ready documents
  const documentsToUse = isBotOrNewVisitor ? DEMO_DOCUMENTS : documents;
  const readyDocuments = documentsToUse
    ? documentsToUse.filter((doc) => doc.docStage === "hazir")
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