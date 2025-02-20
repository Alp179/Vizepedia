import styled, { keyframes } from "styled-components";
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

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

  @media (max-width: 680px) {
    flex-direction: column;
    padding: 10px;
    height: 100%;
  }
  @media (max-width: 450px) {
    width: 90%;
    margin: 0 auto;
  }

  /* Belgeler arası geçiş için animasyon */
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 30px;
  background: var(--color-grey-51);
  border-radius: 15px;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 680px) {
    padding: 15px;
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
    padding: 15px;
  }
`;

const DocumentTitle = styled.h1`
  font-size: 35px;
  text-align: center;
  font-weight: bold;
  color: var(--color-grey-52);

  @media (max-width: 1000px) {
    font-size: 32px;
  }

  @media (max-width: 680px) {
    margin-top: 10px;
    font-size: 20px;
    text-align: center;
  }
`;

const DocumentDescription = styled.p`
  margin-top: 20px;
  color: var(--color-grey-53);
  font-size: 18px;

  @media (max-width: 1000px) {
    font-size: 18px;
  }

  @media (max-width: 680px) {
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
  }
`;

const DocumentMeta = styled.p`
  margin-top: 10px;
  color: var(--color-grey-53);

  @media (max-width: 680px) {
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
  }
`;

const ImageText = styled.p`
  color: var(--color-grey-52);
  font-weight: bold;
`;

const SourceButton = styled.button`
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
  padding: 15px 20px;
  background-color: #004466;
  color: white;
  border: 2px solid #00ffa2;
  border-radius: 16px;
  width: 150px;
  &:hover {
    background-color: #00ffa2;
    color: #004466;
  }
  @media (max-width: 680px) {
    font-size: 14px;
    padding: 10px 15px;
    margin-left: auto;
    margin-right: auto;
    max-width: 150px;
    width: 80%;
  }
`;

const ActionButton = styled.button`
  padding: 15px 25px;
  background-color: ${(props) => (props.isCompleted ? "#e74c3c" : "#2ecc71")};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  margin-left: auto;
  font-weight: bold;
  margin-right: auto;
  width: 200px;
  @media (max-width: 710px) {
    width: 80% !important;
  }

  &:hover {
    background-color: ${(props) => (props.isCompleted ? "#c0392b" : "#27ae60")};
  }

  @media (max-width: 680px) {
    width: 200px;
    padding: 10px;
    font-size: 14px;
    margin-top: 15px;
  }
`;

const DocumentImage = styled.img`
  max-width: 100%;
  height: auto;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
`;

const RelatedSteps = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
  color: #333;
  box-shadow: 0px 9px 24px -12px rgba(0, 0, 0, 0.75);

  @media (max-width: 680px) {
    padding: 15px;
  }
`;

const RelatedStepsTitle = styled.h3`
  margin-bottom: 10px;
  text-align: center;

  @media (max-width: 1000px) {
    font-size: 16px;
  }

  @media (max-width: 680px) {
    text-align: center;
  }
`;

const NavigationButton = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-grey-903);
  z-index: 3000;
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

  &:hover {
    background-color: #004466;
    color: #00ffa2;
  }

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
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
`;

const ModalContent = styled.div`
  background: var(--color-grey-51);
  border-radius: 10px;
  padding: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  max-width: 85vw;
  max-height: 85vh;
`;


const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  z-index: 3000;
  width: 30px;
  height: 30px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background: #004466;
    color: #00ffa2;
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
`;

const DocumentDetail = () => {
  const imgRef = useRef(null);
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
    if (imgRef.current) {
      const updateSize = () => {
        const imgWidth = imgRef.current.naturalWidth;
        const imgHeight = imgRef.current.naturalHeight;
        const windowWidth = window.innerWidth * 0.92;
        const windowHeight = window.innerHeight * 0.92;
        const aspectRatio = imgWidth / imgHeight;
  
        let newWidth, newHeight;
  
        if (aspectRatio > 1) {
          // Enine büyük görseller
          newWidth = windowWidth;
          newHeight = windowWidth / aspectRatio;
          if (newHeight > windowHeight) {
            newHeight = windowHeight;
            newWidth = newHeight * aspectRatio;
          }
        } else {
          // Boyuna büyük görseller
          newHeight = windowHeight;
          newWidth = windowHeight * aspectRatio;
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
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  return (
    <>
      <PageContainer>
        <NavigationButton
          className="left"
          onClick={() => handleNavigation("prev")}
        >
          &lt;
        </NavigationButton>
        <InfoContainer>
          <DocumentMeta>
            Tahmini Tamamlama Süresi: {selectedDocument.estimatedCompletionTime}
          </DocumentMeta>
          <DocumentTitle>{selectedDocument.docName}</DocumentTitle>
          <DocumentDescription>
            {selectedDocument.docDescription}
          </DocumentDescription>
          <SourceButton>Bağlantı {selectedDocument.docSource}</SourceButton>
          <RelatedSteps>
            <RelatedStepsTitle>
              Bu Belge ile Bağlantılı İşlemler
            </RelatedStepsTitle>
            <ul>
              {selectedDocument.relatedSteps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </RelatedSteps>
          <ActionButton onClick={handleAction} isCompleted={isCompleted}>
            {isCompleted ? "Tamamlandı" : "Tamamla"}
          </ActionButton>
        </InfoContainer>
        <ImageContainer>
          <ImageText>Belge Örneği</ImageText>
          <DocumentImage
            src={selectedDocument.docImage}
            alt={selectedDocument.docName}
            onClick={() => handleImageClick(selectedDocument.docImage)}
          />
          <ImageText>Temin Yeri:</ImageText>
          <ImageText>Tür:</ImageText>
        </ImageContainer>
        <NavigationButton
          className="right"
          onClick={() => handleNavigation("next")}
        >
          &gt;
        </NavigationButton>
      </PageContainer>

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent
            width={dimensions.width}
            height={dimensions.height}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={closeModal}>×</CloseButton>
            <ModalImage ref={imgRef} src={modalImage} alt="Büyütülmüş Görsel" />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default DocumentDetail;
