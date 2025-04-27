/* eslint-disable react/prop-types */

import  { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

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


const ImageViewer = ({ 
  imageSrc, 
  altText, 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);

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
      <ImageContainer>
        <ImageText>Belge Önizlemesi</ImageText>
        <DocumentImage
          src={imageSrc}
          alt={altText}
          onClick={() => handleImageClick(imageSrc)}
        />

        
      </ImageContainer>

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

export default ImageViewer;