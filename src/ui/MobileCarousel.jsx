/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import StepIndicator from "../ui/StepIndicator";
import SponsorStepIndicator from "../ui/SponsorStepIndicator";
import FirmMap from "../ui/FirmMap";

// Carousel stilleri
const CarouselContainer = styled.div`
  width: ${(props) => (props.width ? props.width + "px" : "100%")};
  position: relative;
  overflow: hidden;
`;

const CarouselContent = styled.div`
  display: flex;
  transition: transform 0.4s ease;
  transform: ${(props) =>
    `translateX(-${props.activeIndex * props.itemWidth}px)`};
  will-change: transform;
  position: relative;
  left: 0;
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  width: ${(props) => props.width}px;
  padding: 0 10px;
`;

const CarouselControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 15px auto 5px;
  padding: 0;
  gap: 8px;
`;

const PaginationDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.active ? "#004466" : "rgba(0, 68, 102, 0.3)"};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    background-color: ${(props) =>
      props.active ? "#004466" : "rgba(0, 68, 102, 0.5)"};
  }
`;

const NavButton = styled.button`
  background-color: rgba(0, 68, 102, 0.1);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #004466;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0 10px;

  &:hover {
    background-color: rgba(0, 68, 102, 0.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StepIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
  @media (max-width: 1450px) {
    margin-bottom: 46px;
  }

  @media (max-width: 710px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

const InfoContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: 710px) {
    width: 100%;
  }
`;

const MobileCarousel = ({
  stepLabels,
  currentStep,
  handleStepClick,
  completedDocuments,
  documents,
  hasSponsor,
  firmLocation,
  isFirmLocationSuccess,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const carouselRef = useRef(null);

  // Öğenin genişliğini hesaplıyoruz
  const [itemWidth, setItemWidth] = useState(() => {
    if (window.innerWidth <= 389) {
      return 300;
    } else if (window.innerWidth <= 710) {
      return 350;
    }
    return window.innerWidth;
  });

  // Toplam öğe sayısı: sponsor varsa 3, yoksa 2
  const totalItems = hasSponsor ? 3 : 2;

  // Sadece active index sıfırlanıyor
  const resetCarouselPosition = () => {
    setActiveCardIndex(0);
  };

  useEffect(() => {
    setCarouselVisible(false);
    setTimeout(() => {
      setCarouselVisible(true);
      resetCarouselPosition();
    }, 50);
  }, []);

  useEffect(() => {
    const calculateItemWidth = () => {
      if (window.innerWidth <= 389) {
        return 300;
      } else if (window.innerWidth <= 710) {
        return 350;
      }
      return window.innerWidth;
    };

    const handleResize = () => {
      setItemWidth(calculateItemWidth());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    resetCarouselPosition();
  }, [documents]);

  return (
    <div>
      <CarouselContainer
        width={itemWidth}
        style={{ display: carouselVisible ? "block" : "none" }}
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const touchEnd = e.changedTouches[0].clientX;
          const diff = touchStart - touchEnd;

          if (diff > 50 && activeCardIndex < totalItems - 1) {
            setActiveCardIndex((prevIndex) => prevIndex + 1);
          } else if (diff < -50 && activeCardIndex > 0) {
            setActiveCardIndex((prevIndex) => prevIndex - 1);
          }
        }}
      >
        <CarouselContent
          ref={carouselRef}
          activeIndex={activeCardIndex}
          itemWidth={itemWidth}
        >
          <CarouselItem width={itemWidth}>
            <StepIndicatorWrapper>
              <Heading as="h14">Başvuru Sahibinin Belgeleri</Heading>
              <StepIndicator
                steps={stepLabels}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                completedDocuments={completedDocuments}
                documents={documents}
              />
            </StepIndicatorWrapper>
          </CarouselItem>

          {hasSponsor && (
            <CarouselItem width={itemWidth}>
              <StepIndicatorWrapper>
                <Heading as="h14">Sponsorun Belgeleri</Heading>
                <SponsorStepIndicator
                  steps={stepLabels}
                  currentStep={currentStep}
                  onStepClick={handleStepClick}
                  completedDocuments={completedDocuments}
                  documents={documents}
                />
              </StepIndicatorWrapper>
            </CarouselItem>
          )}

          <CarouselItem width={itemWidth}>
            <InfoContainerWrapper>
              <Heading as="h14">Başvuru adresi</Heading>
              {isFirmLocationSuccess && firmLocation && (
                <FirmMap firmLocation={firmLocation} />
              )}
            </InfoContainerWrapper>
          </CarouselItem>
        </CarouselContent>

        <CarouselControls>
          <NavButton
            onClick={() => setActiveCardIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeCardIndex === 0}
          >
            &lt;
          </NavButton>

          <div style={{ display: "flex", gap: "8px" }}>
            <PaginationDot
              active={activeCardIndex === 0}
              onClick={() => setActiveCardIndex(0)}
            />
            {hasSponsor && (
              <PaginationDot
                active={activeCardIndex === 1}
                onClick={() => setActiveCardIndex(1)}
              />
            )}
            <PaginationDot
              active={activeCardIndex === (hasSponsor ? 2 : 1)}
              onClick={() => setActiveCardIndex(hasSponsor ? 2 : 1)}
            />
          </div>

          <NavButton
            onClick={() =>
              setActiveCardIndex((prev) => Math.min(totalItems - 1, prev + 1))
            }
            disabled={activeCardIndex === totalItems - 1}
          >
            &gt;
          </NavButton>
        </CarouselControls>
      </CarouselContainer>
    </div>
  );
};

export default MobileCarousel;
