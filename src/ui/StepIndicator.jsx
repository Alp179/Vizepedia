/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import styled, { keyframes, css } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "./Spinner";
import { getCurrentUser } from "../services/apiAuth";
import { DocumentsContext } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";

// Icon Components
const IconRocket = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="100%"
    height="100%"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="100%"
    height="100%"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <circle cx="8" cy="14" r="1"></circle>
    <circle cx="16" cy="14" r="1"></circle>
    <circle cx="8" cy="18" r="1"></circle>
  </svg>
);

const IconPuzzle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="100%"
    height="100%"
  >
    <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925-.191-.482-.884-.850-1.471-.689l-1.514.345c-.906.212-1.538.991-1.538 1.916v2.91a.87.87 0 0 1-.876.865H10.32a.87.87 0 0 1-.876-.876v-3.369c0-.803-.509-1.587-1.228-1.909-.482-.21-1.187-.144-1.575.173-1.022.819-2.06.068-2.06-.911v-2.926c0-.89 1.116-1.639 2.063-.911.388.317 1.072.383 1.554.173.73-.317 1.246-1.113 1.246-1.916V4.484c0-.479.39-.83.87-.876h3.262a.87.87 0 0 1 .876.876v3.369c0 .803.507 1.587 1.228 1.909.482.21 1.187.144 1.575-.173.522-.425 1.154-.413 1.575.173.383.535.308 1.247.115 1.788z"></path>
  </svg>
);

// Kategorilere göre stil tanımlamaları
const categoryColors = {
  hazir: {
    background: "#e6fff2",
    border: "#00cc66",
    text: "#00703a",
    icon: <IconRocket />,
    title: "Hemen Hazır",
    description: "Bu belgeler hazır durumda ve incelenmeyi bekliyor.",
  },
  planla: {
    background: "#fff5e6",
    border: "#ffaa33",
    text: "#cc7700",
    icon: <IconCalendar />,
    title: "Planla ve Topla",
    description: "Bu belgeleri hazırlamak için planlama yapmanız gerekiyor.",
  },
  bizimle: {
    background: "#e6f0ff",
    border: "#3377ff",
    text: "#004de6",
    icon: <IconPuzzle />,
    title: "Bizimle Kolay",
    description: "Bu belgeler için bizimle iletişime geçmeniz gerekiyor.",
  },
};

// Ana konteyner
const StepAndContinueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 900px;
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 30px rgba(31, 38, 135, 0.15);

  @media (max-width: 1550px) {
    margin-left: -100px;
  }

  @media (max-width: 768px) {
    padding: 15px;
    gap: 16px;
  }
`;

// Kategori başlığı için konteyner
const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
  
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${props => props.color?.background || 'rgba(255, 255, 255, 0.5)'};
  border-left: 4px solid ${props => props.color?.border || '#004466'};
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    gap: 6px;
    flex-wrap: wrap;
  }
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 18px;
  flex-shrink: 0;
  color: ${props => props.color?.text || '#333'};
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
`;

const CategoryTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CategoryTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.color?.text || '#333'};
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CategoryDescription = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 12px;
    -webkit-line-clamp: 1;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-top: 2px;
  }
`;

const CategoryProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChevronIcon = styled.div`
  margin-left: 8px;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.5);
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
  width: ${props => `${props.progress}%`};
  background-color: ${props => props.color || '#004466'};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
`;

// Belge öğesi listesi konteyneri
const DocumentListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
  overflow: hidden;
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.3s ease-in-out, 
              visibility 0.2s ease-in-out;
  margin-top: ${props => props.isOpen ? '8px' : '0'};
`;

const DocsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  width: 100%;
  
  @media (max-width: 1300px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

// Belge öğesi
const DocumentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 8px;
  background-color: ${props => props.isSponsor 
    ? 'rgba(245, 240, 255, 0.9)' 
    : 'rgba(255, 255, 255, 0.85)'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid ${props => 
    props.isActive 
      ? '#3498db' 
      : props.isCompleted 
        ? '#2ecc71' 
        : props.isSponsor 
          ? '#8533ff' 
          : 'transparent'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    background-color: ${props => props.isSponsor 
      ? 'rgba(245, 240, 255, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)'};
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  ${props => props.isCompleted && css`
    background-color: ${props.isSponsor 
      ? 'rgba(46, 204, 113, 0.05)' 
      : 'rgba(46, 204, 113, 0.1)'};
    &:hover {
      background-color: ${props.isSponsor 
        ? 'rgba(46, 204, 113, 0.1)' 
        : 'rgba(46, 204, 113, 0.15)'};
    }
  `}

  ${props => props.isActive && css`
    background-color: ${props.isSponsor 
      ? 'rgba(52, 152, 219, 0.05)' 
      : 'rgba(52, 152, 219, 0.1)'};
    &:hover {
      background-color: ${props.isSponsor 
        ? 'rgba(52, 152, 219, 0.1)' 
        : 'rgba(52, 152, 219, 0.15)'};
    }
  `}
  
  @media (max-width: 768px) {
    padding: 12px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    gap: 4px;
  }
`;

const DocumentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const DocumentNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  background-color: ${props => 
    props.isActive 
      ? '#3498db' 
      : props.isCompleted 
        ? '#2ecc71' 
        : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => 
    props.isActive || props.isCompleted 
      ? 'white' 
      : 'rgba(0, 0, 0, 0.7)'};
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const DocumentTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    height: 32px;
  }
`;

const SponsorBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #f0e6ff;
  border: 1px solid #8533ff;
  color: #5a00e6;
  font-size: 10px;
  font-weight: 500;
  width: fit-content;
  position: absolute;
  bottom: 14px;
  right: 14px;
  
  @media (max-width: 768px) {
    padding: 1px 4px;
    font-size: 9px;
    bottom: 12px;
    right: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 1px 3px;
    font-size: 8px;
    bottom: 10px;
    right: 10px;
  }
`;

const DocumentStatus = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => 
    props.isCompleted 
      ? '#2ecc71' 
      : props.isActive 
        ? '#3498db' 
        : 'rgba(0, 0, 0, 0.5)'};
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  width: 100%;
  
  &:before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => 
      props.isCompleted 
        ? '#2ecc71' 
        : props.isActive 
          ? '#3498db' 
          : 'rgba(0, 0, 0, 0.2)'};
  }
  
  @media (max-width: 768px) {
    font-size: 11px;
    gap: 3px;
    
    &:before {
      width: 7px;
      height: 7px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    gap: 2px;
    
    &:before {
      width: 6px;
      height: 6px;
    }
  }
`;

const glowing = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
`;

const ContinueButton = styled.button`
  align-self: flex-end;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: #004466;
  cursor: pointer;
  border: none;
  border-radius: 12px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: all 0.3s ease;

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
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    
    &:before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 900px) {
    font-size: 13px;
    padding: 10px 20px;
  }

  @media (max-width: 768px) {
    align-self: center;
    width: 100%;
    max-width: 250px;
    font-size: 12px;
    padding: 10px 16px;
  }
  
  @media (max-width: 480px) {
    max-width: 200px;
    font-size: 11px;
    padding: 8px 16px;
  }
`;

const StepPageCont = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  @media (max-width: 710px) {
    align-items: center;
  }
`;

const StepIndicator = () => {
  const [userId, setUserId] = useState(null);
  const { id: applicationId } = useParams();
  const navigate = useNavigate();
  const { setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);
  const [currentStep, setCurrentStep] = useState(null);
  
  // Kategori açılıp kapanma durumu - başlangıçta tüm kategoriler kapalı
  const [openCategories, setOpenCategories] = useState({
    hazir: false,
    planla: false,
    bizimle: false
  });

  // Kategoriyi açıp kapatan fonksiyon
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
        fetchCompletedDocuments(user.id, applicationId).then((data) => {
          const completedDocsMap = data.reduce((acc, doc) => {
            if (!acc[applicationId]) acc[applicationId] = {};
            acc[applicationId][doc.document_name] = true;
            return acc;
          }, {});
          dispatch({
            type: "SET_COMPLETED_DOCUMENTS",
            payload: completedDocsMap,
          });
        });
      }
    });
  }, [applicationId, dispatch]);

  const {
    data: userSelections,
    isLoading: isLoadingUserSelections,
    isError: isErrorUserSelections,
  } = useQuery({
    queryKey: ["userSelectionsStep", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery({
    queryKey: ["documentDetailsStep", documentNames],
    queryFn: () =>
      fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  useEffect(() => {
    if (documents && documents.length > 0) {
      const firstIncompleteIndex = documents.findIndex(
        (doc) => !completedDocuments[applicationId]?.[doc.docName]
      );
      setCurrentStep(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
    }
  }, [documents, completedDocuments, applicationId]);

  if (isLoadingUserSelections || isLoadingDocuments) return <Spinner />;
  if (isErrorUserSelections || isErrorDocuments || !documents)
    return <div>Error loading data.</div>;

  const handleContinue = () => {
    if (!documents || documents.length === 0 || currentStep === -1) return;
    const selectedDocument = documents[currentStep];
    if (selectedDocument) {
      setSelectedDocument(selectedDocument);
      navigate(`/documents/${applicationId}`);
    }
  };

  const handleDocumentClick = (index) => {
    const selectedDocument = documents[index];
    if (selectedDocument) {
      setSelectedDocument(selectedDocument);
      navigate(`/documents/${applicationId}`);
    }
  };

  // docStage değerine göre dökümanları gruplandırma (sponsor belgeleri de kendi docStage değerlerine göre gruplandırılır)
  const groupedDocuments = documents.reduce((acc, doc, index) => {
    const stage = doc.docStage || "planla"; // Eğer docStage tanımlanmamışsa "planla" kategorisine ekle
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push({ ...doc, index });
    return acc;
  }, {});

  // Kategori sıralama fonksiyonu (hazir > planla > bizimle)
  const categoryOrder = ["hazir", "planla", "bizimle"];
  
  // Her kategori için tamamlanma yüzdesini hesaplama
  const calculateCategoryProgress = (docs) => {
    if (!docs || !docs.length) return 0;
    const completedCount = docs.filter(doc => 
      completedDocuments[applicationId]?.[doc.docName]
    ).length;
    return Math.round((completedCount / docs.length) * 100);
  };

  return (
    <StepPageCont>
      <StepAndContinueContainer>
        {/* Kategorileri sırayla göster */}
        {categoryOrder.map(category => {
          // Bu kategoride döküman yoksa gösterme
          if (!groupedDocuments[category] || groupedDocuments[category].length === 0) {
            return null;
          }
          
          const docs = groupedDocuments[category];
          const progress = calculateCategoryProgress(docs);
          const colorSet = categoryColors[category];
          
          return (
            <CategoryContainer key={category}>
              <CategoryHeader 
                onClick={() => toggleCategory(category)} 
                color={colorSet}
              >
                <CategoryIcon color={colorSet}>
                  {colorSet.icon}
                </CategoryIcon>
                <CategoryTitleContainer>
                  <CategoryTitle color={colorSet}>{colorSet.title}</CategoryTitle>
                  <CategoryDescription>{colorSet.description}</CategoryDescription>
                </CategoryTitleContainer>
                <CategoryProgress>
                  <ProgressBar>
                    <ProgressFill progress={progress} color={colorSet.border} />
                  </ProgressBar>
                  <ProgressText>{progress}%</ProgressText>
                </CategoryProgress>
                <ChevronIcon isOpen={openCategories[category]}>
                  ▼
                </ChevronIcon>
              </CategoryHeader>
              
              <DocumentListContainer isOpen={openCategories[category]}>
                <DocsGrid>
                  {docs.map(doc => {
                    const isActive = doc.index === currentStep;
                    const isCompleted = completedDocuments[applicationId]?.[doc.docName];
                    const isSponsor = doc.docName?.startsWith("Sponsor");
                    
                    return (
                      <DocumentItem 
                        key={doc.id}
                        isActive={isActive}
                        isCompleted={isCompleted}
                        isSponsor={isSponsor}
                        onClick={() => handleDocumentClick(doc.index)}
                      >
                        <DocumentHeader>
                          <DocumentNumber 
                            isActive={isActive} 
                            isCompleted={isCompleted}
                          >
                            {doc.index + 1}
                          </DocumentNumber>
                          <DocumentInfo>
                            <DocumentTitle>{doc.docName}</DocumentTitle>
                          </DocumentInfo>
                        </DocumentHeader>
                        <DocumentStatus 
                          isActive={isActive} 
                          isCompleted={isCompleted}
                        >
                          {isCompleted 
                            ? "Tamamlandı" 
                            : isActive 
                              ? "Mevcut Adım" 
                              : "Bekliyor"}
                          {isSponsor && <SponsorBadge>Sponsor</SponsorBadge>}
                        </DocumentStatus>
                      </DocumentItem>
                    );
                  })}
                </DocsGrid>
              </DocumentListContainer>
            </CategoryContainer>
          );
        })}
        
        <ContinueButton onClick={handleContinue}>
          Devam Et
        </ContinueButton>
      </StepAndContinueContainer>
    </StepPageCont>
  );
};

export default StepIndicator;