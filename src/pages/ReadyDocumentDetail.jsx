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
  padding: 25px;
  background: var(--color-grey-51);
  border-radius: 24px;
  box-sizing: border-box;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

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
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  @media (max-width: 680px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  gap: 20px;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

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
  border-bottom: 3px solid #00ffa2;
  padding-bottom: 8px;
  display: inline-block;

  @media (max-width: 1000px) {
    font-size: 24px;
  }

  @media (max-width: 680px) {
    font-size: 20px;
    text-align: center;
    display: block;
  }
`;

const DocumentDescription = styled.p`
  margin-top: 20px;
  color: var(--color-grey-53);
  font-size: 18px;
  line-height: 1.6;
  background: rgba(0, 68, 102, 0.03);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #004466;

  @media (max-width: 680px) {
    font-size: 16px;
    text-align: center;
    padding: 12px;
  }
`;

const DocumentMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  color: #718096;
  font-size: 14px;
  width: 100%;
  background: rgba(0, 68, 102, 0.05);
  padding: 10px;
  border-radius: 10px;
  justify-content: center;

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
  background-color: rgba(0, 68, 102, 0.1);
  color: #004466;
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

  svg {
    margin-right: 5px;
    color: #00ffa2;
  }
`;

const ImageText = styled.p`
  color: var(--color-grey-52);
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  padding: 6px 12px;
  background: rgba(0, 68, 102, 0.05);
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  margin-top: 25px;
  transition: all 0.3s ease;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  min-width: 200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
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

  ${(props) =>
    props.isCompleted
      ? ""
      : css`
          animation: ${pulse} 2s infinite ease-in-out;
        `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
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
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  object-fit: cover;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  will-change: transform, top;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #004466;
    color: #00ffa2;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
    box-shadow: none;

    &:hover {
      background: rgba(255, 255, 255, 0.95);
      color: #1a365d;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
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
  animation: ${({ isClosing }) => (isClosing ? fadeOutScale : fadeInScale)} 0.3s
    ease-in-out;
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
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #c53030;
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const DocProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  background: rgba(0, 68, 102, 0.05);
  padding: 10px;
  border-radius: 30px;
  width: fit-content;

  @media (max-width: 1300px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 4px;
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
    css`
      transform: scale(1.4);
    `}
`;

const SourceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-top: 25px;
  padding: 15px 20px;
  background-color: #004466;
  color: white;
  border: 2px solid #00ffa2;
  border-radius: 16px;
  width: auto;
  min-width: 150px;
  transition: all 0.3s ease;
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
    margin-left: auto;
    margin-right: auto;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${(props) => props.color || "#004466"};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const SectionHeading = styled.h3`
  font-size: 20px;
  color: var(--color-grey-52);
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
    color: ${(props) => props.iconColor || "#00ffa2"};
  }
`;

const SectionContent = styled.div`
  color: var(--color-grey-53);
  font-size: 16px;
  line-height: 1.6;
`;

const ReadyDocumentBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #e6fff2;
  color: #00703a;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #00cc66;

  svg {
    margin-right: 6px;
  }

  @media (max-width: 680px) {
    font-size: 12px;
    padding: 4px 10px;
    margin-top: 8px;
  }
`;


const RocketIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#00cc66">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const UndoIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 10h10a4 4 0 0 1 0 8H9"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 10l5-5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 10l5 5"
    />
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#e74c3c">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const ReadyDocumentDetail = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);
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
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  useEffect(() => {
    // SourceButton ile NavigationButton'ları hizalama fonksiyonu
    const adjustNavigationButtons = () => {
      if (window.innerWidth <= 680) {
        const startButton = document.getElementById("startButton");
        if (startButton) {
          const buttonRect = startButton.getBoundingClientRect();
          const leftButton = document.querySelector(".left");
          const rightButton = document.querySelector(".right");

          if (leftButton && rightButton) {
            // Butonların yüksekliklerini StartButton ile hizala
            const verticalCenter = buttonRect.top + buttonRect.height / 2;
            const buttonRadius = 22.5; // Button height (45px) / 2

            leftButton.style.position = "fixed";
            leftButton.style.top = `${verticalCenter - buttonRadius}px`;
            leftButton.style.transform = "none";
            leftButton.style.left = "10px";

            rightButton.style.position = "fixed";
            rightButton.style.top = `${verticalCenter - buttonRadius}px`;
            rightButton.style.transform = "none";
            rightButton.style.right = "10px";
          }
        }
      } else {
        // Desktop görünümde eski konumlarına getir
        const navigationButtons = document.querySelectorAll(".left, .right");
        navigationButtons.forEach((button) => {
          button.style.position = "absolute";
          button.style.top = "50%";
          button.style.transform = "translateY(-50%)";

          if (button.classList.contains("left")) {
            button.style.left = "-60px";
            button.style.right = "auto";
          } else {
            button.style.right = "-60px";
            button.style.left = "auto";
          }
        });
      }
    };

    // Sayfa yüklendiğinde ve scroll edildiğinde butonları hizala
    const handleScroll = () => {
      requestAnimationFrame(adjustNavigationButtons);
    };

    adjustNavigationButtons();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Düzenli olarak pozisyonu güncelle (scroll olayından bağımsız olarak)
    const intervalId = setInterval(adjustNavigationButtons, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearInterval(intervalId);
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
    if (imgRef.current && modalImage) {
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
      // Sadece "hazir" kategorisindeki belgeleri filtrele
      const readyDocuments = documents.filter(
        (doc) => doc.docStage === "hazir"
      );
      const initialDocument = readyDocuments[0];

      if (initialDocument) {
        setSelectedDocument(initialDocument);
        setCurrentDocumentIndex(0);
      }
    }
  }, [isDocumentsSuccess, documents, selectedDocument, setSelectedDocument]);

  useEffect(() => {
    if (selectedDocument && documents) {
      // Sadece "hazir" kategorisindeki belgeleri filtrele
      const readyDocuments = documents.filter(
        (doc) => doc.docStage === "hazir"
      );
      const index = readyDocuments.findIndex(
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
    if (!documents) return;

    // Sadece "hazir" kategorisindeki belgeleri filtrele
    const readyDocuments = documents.filter((doc) => doc.docStage === "hazir");

    if (direction === "prev" && currentDocumentIndex > 0) {
      setSelectedDocument(readyDocuments[currentDocumentIndex - 1]);
    } else if (
      direction === "next" &&
      currentDocumentIndex < readyDocuments.length - 1
    ) {
      setSelectedDocument(readyDocuments[currentDocumentIndex + 1]);
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

  const LinkIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
  // Filtrelenmiş "hazir" belgeleri
  const readyDocuments = documents
    ? documents.filter((doc) => doc.docStage === "hazir")
    : [];

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
                <ReadyDocumentBadge>
                  <RocketIcon />
                  Hemen Hazır
                </ReadyDocumentBadge>
              </MetaTag>
              {selectedDocument.docType && (
                <MetaTag>{selectedDocument.docType}</MetaTag>
              )}
            </MetaInfo>

            <DocumentDescription>
              {selectedDocument.docDescription}
            </DocumentDescription>

            {selectedDocument.docImportant && (
              <SectionContainer color="#e74c3c">
                <SectionHeading iconColor="#e74c3c">
                  <WarningIcon />
                  Dikkat
                </SectionHeading>
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
              </SectionContainer>
            )}

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
                <LinkIcon />
                <span>Bağlantı</span>
              </SourceButton>
            )}
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
          <ImageText>Belge Önizlemesi</ImageText>
          <DocumentImage
            src={selectedDocument.docImage}
            alt={selectedDocument.docName}
            onClick={() => handleImageClick(selectedDocument.docImage)}
          />

          <DocumentMeta>
            {selectedDocument.docSource
              ? `Kaynak: ${selectedDocument.docSource}`
              : "Online işlem yapılabilir"}
          </DocumentMeta>

          <DocProgress>
            {readyDocuments &&
              readyDocuments.map((_, index) => (
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
          disabled={
            !readyDocuments ||
            currentDocumentIndex === readyDocuments.length - 1
          }
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
            <ModalImage ref={imgRef} src={modalImage} alt="Büyütülmüş Görsel" />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ReadyDocumentDetail;
