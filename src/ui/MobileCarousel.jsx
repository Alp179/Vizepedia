/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import StepIndicator from "../ui/StepIndicator";
import SponsorStepIndicator from "../ui/SponsorStepIndicator";
import FirmMap from "../ui/FirmMap";

// Geliştirilmiş Carousel stilleri
const CarouselContainer = styled.div`
  width: 100vw;
  position: relative;
  overflow: visible; // Değiştirildi: itemlerin dışarıda görünmesine izin verir
  margin: 0 auto;
  border-radius: 20px;
  padding: 4px 0;
`;

const CarouselContent = styled.div`
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  transform: ${(props) => {
    // Her itemin genişliği (padding dahil değil)
    const itemWidth = props.itemWidth;
    
    // Container genişliği
    const containerWidth = props.containerWidth;
    
    // Merkeze hizalamak için offset hesaplama
    const centerOffset = (containerWidth - itemWidth) / 2;
    
    // Her kaydırmada bir tam item ilerleyecek
    return `translateX(${-props.activeIndex * itemWidth + centerOffset}px)`;
  }};
  will-change: transform;
  position: relative;
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  width: ${(props) => props.width}px;
  padding: 0;
  opacity: ${(props) => (props.active ? 1 : 0.6)};
  transform: ${(props) => (props.active ? 'scale(1)' : 'scale(0.95)')};
  transition: opacity 0.3s ease, transform 0.3s ease;
  box-sizing: border-box;
`;

// Daha minimal ve şık bir kontrol paneli
const CarouselControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 20px auto 10px;
  padding: 0;
  gap: 8px;
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
    margin-bottom: 0;
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

// Swipe göstergeleri için animasyonlu element
const SwipeIndicator = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  top: 50%;
  opacity: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 100;
  background-color: rgba(0, 255, 162, 0.3);
  transform: translateY(-50%);

  &.left {
    left: 20px;
    animation: ${(props) =>
      props.animate ? "pulseLeft 1.5s ease-in-out infinite" : "none"};
  }

  &.right {
    right: 20px;
    animation: ${(props) =>
      props.animate ? "pulseRight 1.5s ease-in-out infinite" : "none"};
  }

  @keyframes pulseLeft {
    0%,
    100% {
      opacity: 0;
      transform: translateX(10px) translateY(-50%);
    }
    50% {
      opacity: 0.7;
      transform: translateX(0) translateY(-50%);
    }
  }

  @keyframes pulseRight {
    0%,
    100% {
      opacity: 0;
      transform: translateX(-10px) translateY(-50%);
    }
    50% {
      opacity: 0.7;
      transform: translateX(0) translateY(-50%);
    }
  }
`;

// Çok basit sabit pozisyonlar kullanalım
const ScrollbarContainer = styled.div`
  position: relative;
  width: 80%;
  height: 4px;
  background-color: rgba(0, 68, 102, 0.1);
  margin: 0 auto 20px;
  border-radius: 10px;
  overflow: hidden;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  height: 100%;
  width: ${(props) => 100 / props.totalItems}%;
  background-color: rgba(0, 68, 102, 0.3);
  border-radius: 10px;
  left: ${(props) => {
    // Basit ve direkt sabit pozisyonlar
    const stepSize = 100 - (100 / props.totalItems);
    const percentage = (props.activeIndex / (props.totalItems - 1)) * stepSize;
    return `${percentage}%`;
  }};
  transition: left 0.5s cubic-bezier(0.25, 1, 0.5, 1);
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden; // Ana container içinde overflow hidden
  border-radius: 20px;
  margin: 0 auto;
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
  const [touchEnd, setTouchEnd] = useState(0);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);

  // Görünür kısmın genişliğini hesaplıyoruz
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Kenardan görünecek miktar
  // Artık merkeze konumlandırma ile çalışacağız, peek amount'a gerek yok
  
  // Her bir itemin gerçek genişliği (merkezdeki item için)
  const [itemWidth, setItemWidth] = useState(() => {
    if (window.innerWidth <= 389) {
      return 300;
    } else if (window.innerWidth <= 710) {
      return 350;
    }
    return window.innerWidth > 800 ? 800 : window.innerWidth;
  });
  
  // Toplam öğe sayısı: sponsor varsa 3, yoksa 2
  const totalItems = hasSponsor ? 3 : 2;

  // Sadece active index sıfırlanıyor
  const resetCarouselPosition = () => {
    setActiveCardIndex(0);
  };

  // İlk bir kaç saniye swipe ipucu gösteriliyor
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  useEffect(() => {
    setCarouselVisible(false);
    setTimeout(() => {
      setCarouselVisible(true);
      resetCarouselPosition();
    }, 100);
  }, []);

  useEffect(() => {
    const calculateWidths = () => {
      // Konteyner genişliğini ölç
      const currentContainerWidth = containerRef.current?.clientWidth || window.innerWidth;
      setContainerWidth(currentContainerWidth);
      
      // Her ekran boyutu için doğru genişlik hesaplaması
      let calculatedWidth;
      
      // Ekran boyutuna göre item genişliği ayarla
      // Bu değerler, kenarlarda görünecek kısımları hesaba katarak belirlenmiştir
      if (window.innerWidth <= 389) {
        // Çok küçük ekranlarda item genişliği konteyner genişliğinin %80'i
        calculatedWidth = Math.min(300, currentContainerWidth * 0.80);
      } else if (window.innerWidth <= 710) {
        // Küçük ekranlarda item genişliği konteyner genişliğinin %75'i
        calculatedWidth = Math.min(350, currentContainerWidth * 0.80);
      } else {
        // Daha büyük ekranlarda item genişliği konteyner genişliğinin %70'i
        // Bu değer daha fazla peek efekti sağlar
        calculatedWidth = Math.min(800, currentContainerWidth * 0.70);
      }
      
      setItemWidth(calculatedWidth);
    };

    calculateWidths();
    window.addEventListener("resize", calculateWidths);
    return () => window.removeEventListener("resize", calculateWidths);
  }, []);

  useEffect(() => {
    resetCarouselPosition();
  }, [documents]);

  // Geliştirilmiş dokunma kontrolü
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 30;
    const isRightSwipe = distance < -30;

    if (isLeftSwipe && activeCardIndex < totalItems - 1) {
      setActiveCardIndex((prevIndex) => prevIndex + 1);
    }

    if (isRightSwipe && activeCardIndex > 0) {
      setActiveCardIndex((prevIndex) => prevIndex - 1);
    }

    // İpucu sadece ilk swipe'tan sonra kaldırılıyor
    if (isLeftSwipe || isRightSwipe) {
      setShowSwipeHint(false);
    }
  };

  return (
    <div style={{ position: "relative" }} ref={containerRef}>
      <ScrollbarContainer>
        <ScrollIndicator
          totalItems={totalItems}
          activeIndex={activeCardIndex}
        />
      </ScrollbarContainer>

      {/* Swipe ipucu ikonları */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 15px",
          opacity: showSwipeHint ? 0.6 : 0,
          zIndex: 10,
        }}
      >
        {activeCardIndex > 0 && (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 68, 102, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#004466",
              transition: "opacity 0.3s",
            }}
          >
            &lt;
          </div>
        )}

        {activeCardIndex < totalItems - 1 && (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 68, 102, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#004466",
              marginLeft: "auto",
              transition: "opacity 0.3s",
            }}
          >
            &gt;
          </div>
        )}
      </div>

      <CarouselWrapper>
        <CarouselContainer
          style={{ display: carouselVisible ? "block" : "none" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <SwipeIndicator
            className="left"
            animate={showSwipeHint && activeCardIndex > 0}
          />
          <SwipeIndicator
            className="right"
            animate={showSwipeHint && activeCardIndex < totalItems - 1}
          />

          <CarouselContent
            ref={carouselRef}
            activeIndex={activeCardIndex}
            itemWidth={itemWidth}

            containerWidth={containerWidth}
          >
            <CarouselItem width={itemWidth} active={activeCardIndex === 0}>
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
              <CarouselItem width={itemWidth} active={activeCardIndex === 1}>
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

            <CarouselItem
              width={itemWidth}
              active={activeCardIndex === (hasSponsor ? 2 : 1)}
            >
              <InfoContainerWrapper>
                <Heading as="h14">Başvuru adresi</Heading>
                {isFirmLocationSuccess && firmLocation && (
                  <FirmMap firmLocation={firmLocation} />
                )}
              </InfoContainerWrapper>
            </CarouselItem>
          </CarouselContent>

          <CarouselControls>
            {/* Dot göstergelerini ve butonları kaldıralım */}
          </CarouselControls>
        </CarouselContainer>
      </CarouselWrapper>
    </div>
  );
};

export default MobileCarousel;