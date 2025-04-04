import styled, { keyframes, css } from "styled-components";
import { useContext, useEffect, useState, useRef } from "react";
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

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOutScale = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Tekrar kullanılabilir stiller

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: var(--color-grey-51);
  border-radius: 20px;
  box-sizing: border-box;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out;

  @media (max-width: 680px) {
    flex-direction: column;
    padding: 16px;
    height: 100%;
  }
  @media (max-width: 450px) {
    width: 95%;
    margin: 0 auto;
    padding: 12px;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 30px;
  background: var(--color-grey-51);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 680px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const ImageContainer = styled.div`
  flex: 0.4;
  gap: 16px;
  padding: 20px;
  background: var(--color-grey-51);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 680px) {
    margin-left: 0;
    padding: 20px;
  }
`;

const DocumentTitle = styled.h1`
  font-size: 35px;
  font-weight: bold;
  color: var(--color-grey-52);
  margin-bottom: 16px;
  text-align: left;

  @media (max-width: 1000px) {
    font-size: 24px;
  }

  @media (max-width: 680px) {
    font-size: 20px;
    text-align: center;
  }
`;

const DocumentDescription = styled.p`
  margin-top: 20px;
  color: var(--color-grey-53);
  font-size: 18px;
  line-height: 1.6;

  @media (max-width: 680px) {
    font-size: 16px;
    text-align: center;
  }
`;

const DocumentMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  color: #718096;
  font-size: 14px;
  
  svg {
    margin-right: 8px;
  }

  @media (max-width: 680px) {
    font-size: 13px;
    justify-content: center;
  }
`;

const MetaTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #e6f6ff;
  color: #0056b3;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 12px;
  
  svg {
    margin-right: 5px;
  }
`;

const ImageText = styled.p`
  color: var(--color-grey-52);
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
`;

const SourceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-top: 20px;
  padding: 15px 20px;
  background-color: #004466;
  color: white;
  border: 2px solid #00ffa2;
  border-radius: 16px;
  width: auto;
  min-width: 150px;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 8px;
    flex-shrink: 0;
  }
  
  &:hover {
    background-color: #00ffa2;
    color: #004466;
  }
  
  @media (max-width: 680px) {
    font-size: 16px;
    padding: 12px 15px;
    margin-left: auto;
    margin-right: auto;
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
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  transition: all 0.3s ease;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  min-width: 200px;
  
  svg {
    margin-right: 8px;
    flex-shrink: 0;
  }
  
  ${props => props.isCompleted ? '' : css`
    animation: ${pulse} 2s infinite ease-in-out;
  `}

  &:hover {
    background-color: ${(props) => (props.isCompleted ? "#c0392b" : "#27ae60")};
  }
  

  @media (max-width: 680px) {
    width: 100%;
    max-width: 200px;
    padding: 14px;
    font-size: 16px;
    margin: 20px auto 0;
  }
`;

const DocumentImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  transition: transform 0.3s ease;
  cursor: pointer;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.02);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  
  background: var(--color-grey-903);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #004466;
    color: #00ffa2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: rgba(255, 255, 255, 0.95);
      color: #1a365d;
      transform: translateY(-50%);
    }
  }

  &.left {
    left: -60px;
  }

  &.right {
    right: -60px;
  }
  
  @media (max-width: 680px) {
    width: 45px;
    height: 45px;
    font-size: 20px;
    
    &.left {
      left: 10px;
    }
    
    &.right {
      right: 10px;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  max-width: 90vw;
  max-height: 90vh;
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
  animation: ${({ isClosing }) => (isClosing ? fadeOutScale : fadeInScale)} 0.3s ease-in-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: -40px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c53030;
    transform: scale(1.1);
  }
  
  @media (max-width: 680px) {
    top: -30px;
    right: -10px;
    width: 30px;
    height: 30px;
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const DocProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  @media (max-width: 1100px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 4px;
  } 
`;

const ProgressDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#004466" : "#cbd5e0")};
  margin: 0 4px;
  transition: all 0.3s ease;
  
  ${props => props.active && css`
    transform: scale(1.3);
  `}
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

// SVG ikonları için bileşenler
const TimeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LinkIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const UndoIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a4 4 0 0 1 0 8H9" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l5-5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l5 5" />
  </svg>
);

const DocumentDetail = () => {
  const imgRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { id: applicationId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [userId, setUserId] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const navigate = useNavigate();
  const { selectedDocument, setSelectedDocument } = useSelectedDocument();
  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

  const { data: userSelections } = useQuery({
    queryKey: ["userSelections", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const { data: documents, isSuccess: isDocumentsSuccess } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  useEffect(() => {
    // Sadece mobil görünümde navigasyon butonlarını bağlantı butonuyla hizala
    const adjustNavigationButtons = () => {
      if (window.innerWidth <= 680) {
        const sourceButton = document.getElementById('sourceButton');
        if (sourceButton) {
          const buttonRect = sourceButton.getBoundingClientRect();
          const navigationButtons = document.querySelectorAll('.left, .right');
          navigationButtons.forEach(button => {
            // Bağlantı butonunun ortasına hizala
            button.style.top = `${buttonRect.top + buttonRect.height/2 - 22.5}px`;
          });
        }
      } else {
        // Desktop görünümde eski konumlarına getir
        const navigationButtons = document.querySelectorAll('.left, .right');
        navigationButtons.forEach(button => {
          button.style.top = '';
          button.style.transform = '';
        });
      }
    };

    // Sayfa tam yüklendiğinde butonları hizala
    setTimeout(adjustNavigationButtons, 500);

    // Pencere boyutu değiştikçe butonları yeniden hizala
    window.addEventListener('resize', adjustNavigationButtons);
    
    return () => {
      window.removeEventListener('resize', adjustNavigationButtons);
    };
  }, [selectedDocument]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);
  
  useEffect(() => {
    if (imgRef.current) {
      const updateSize = () => {
        const imgWidth = imgRef.current.naturalWidth;
        const imgHeight = imgRef.current.naturalHeight;
        const windowWidth = window.innerWidth * 0.8;
        const windowHeight = window.innerHeight * 0.8;
        const aspectRatio = imgWidth / imgHeight;
  
        let newWidth, newHeight;
  
        if (aspectRatio > 1) {
          newWidth = Math.min(imgWidth, windowWidth);
          newHeight = newWidth / aspectRatio;
          if (newHeight > windowHeight) {
            newHeight = windowHeight;
            newWidth = newHeight * aspectRatio;
          }
        } else {
          newHeight = Math.min(imgHeight, windowHeight);
          newWidth = newHeight * aspectRatio;
          if (newWidth > windowWidth) {
            newWidth = windowWidth;
            newHeight = newWidth / aspectRatio;
          }
        }
  
        setDimensions({ width: newWidth, height: newHeight });
      };
  
      if (imgRef.current.complete) {
        updateSize();
      } else {
        imgRef.current.onload = updateSize;
      }
    }
  }, [modalImage]);

  useEffect(() => {
    if (isDocumentsSuccess && documents && !selectedDocument) {
      const initialDocument = documents[0];
      if (initialDocument) {
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    }
  }, [isDocumentsSuccess, documents, selectedDocument, setSelectedDocument]);

  useEffect(() => {
    if (selectedDocument && documents) {
      const index = documents.findIndex(
        (doc) => doc.docName === selectedDocument.docName
      );
      setCurrentDocumentIndex(index);
    }
  }, [selectedDocument, documents]);

  if (!selectedDocument) {
    return <Spinner />;
  }

  const isCompleted =
    completedDocuments[applicationId]?.[selectedDocument?.docName];

  const handleAction = async () => {
    if (!userId || !selectedDocument || !applicationId) return;

    try {
      if (isCompleted) {
        await uncompleteDocument(
          userId,
          selectedDocument.docName,
          applicationId
        );
        dispatch({
          type: "UNCOMPLETE_DOCUMENT",
          payload: { documentName: selectedDocument.docName, applicationId },
        });
      } else {
        await completeDocument(userId, selectedDocument.docName, applicationId);
        dispatch({
          type: "COMPLETE_DOCUMENT",
          payload: { documentName: selectedDocument.docName, applicationId },
        });
      }
      navigate(`/dashboard/${applicationId}`);
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentDocumentIndex > 0) {
      setSelectedDocument(documents[currentDocumentIndex - 1]);
    } else if (
      direction === "next" &&
      currentDocumentIndex < documents.length - 1
    ) {
      setSelectedDocument(documents[currentDocumentIndex + 1]);
    }
  };

  const handleImageClick = (imageSrc) => {
    setIsClosing(false);
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setModalImage("");
      setIsClosing(false);
    }, 300);
  };
  
  return (
    <>
      <PageContainer>
        <NavigationButton
          className="left"
          onClick={() => handleNavigation("prev")}
          disabled={currentDocumentIndex === 0}
        >
          &lt;
        </NavigationButton>
        
        <InfoContainer>
          <div>
            <DocumentTitle>{selectedDocument.docName}</DocumentTitle>
            
            <MetaInfo>
              <MetaTag>
                <TimeIcon />
                {selectedDocument.estimatedCompletionTime}
              </MetaTag>
              {selectedDocument.docType && (
                <MetaTag>
                  {selectedDocument.docType}
                </MetaTag>
              )}
            </MetaInfo>
            
            <DocumentDescription>
              {selectedDocument.docDescription}
            </DocumentDescription>
            
            <SourceButton id="sourceButton">
              <LinkIcon />
              <span>Bağlantı</span>
            </SourceButton>
            
            {/* İlgili işlemler kısmı geçici olarak inaktif 
            <RelatedSteps>
              <RelatedStepsTitle>
                Bu Belge ile Bağlantılı İşlemler
              </RelatedStepsTitle>
              <StepsList>
                {selectedDocument.relatedSteps?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </StepsList>
            </RelatedSteps>
            */}
          </div>
          
          <ActionButton onClick={handleAction} isCompleted={isCompleted}>
            {isCompleted ? (
              <>
                <UndoIcon />
                <span>Tamamlandı</span>
              </>
            ) : (
              <>
                <CheckIcon />
                <span>Tamamla</span>
              </>
            )}
          </ActionButton>
        </InfoContainer>
        
        <ImageContainer>
          <ImageText>Belge Örneği</ImageText>
          <DocumentImage
            src={selectedDocument.docImage}
            alt={selectedDocument.docName}
            onClick={() => handleImageClick(selectedDocument.docImage)}
          />
          
          <DocumentMeta>
            Temin Yeri: {selectedDocument.procurementLocation || "Belirtilmemiş"}
          </DocumentMeta>
          
          <DocProgress>
            {documents && documents.map((_, index) => (
              <ProgressDot 
                key={index} 
                active={index === currentDocumentIndex} 
              />
            ))}
          </DocProgress>
        </ImageContainer>
        
        <NavigationButton
          className="right"
          onClick={() => handleNavigation("next")}
          disabled={!documents || currentDocumentIndex === documents.length - 1}
        >
          &gt;
        </NavigationButton>
      </PageContainer>

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent 
            isClosing={isClosing} 
            width={dimensions.width} 
            height={dimensions.height} 
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={closeModal}>×</CloseButton>
            <ModalImage 
              ref={imgRef} 
              src={modalImage} 
              alt="Büyütülmüş Görsel" 
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default DocumentDetail;