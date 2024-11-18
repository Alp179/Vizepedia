/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import styled from "styled-components";

export function HeroScrollDemo() {
  return (
    <HeroContainer>
      <ContainerScroll
        titleComponent={
          <>
            <Title>
              Düşlerinizdeki Seyahatin İlk Adımı: <br />
              <HighlightText>Vizepedia </HighlightText>
            </Title>
          </>
        }
      >
        <HeroImage
          src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/hero-image.png?t=2024-10-01T13%3A58%3A37.493Z"
          alt="hero"
          draggable={false}
        />
      </ContainerScroll>
    </HeroContainer>
  );
}

// `ContainerScroll` Component
const ContainerScroll = ({ titleComponent, children }) => {
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Title animation: Yukarı hareket ve opaklık azalması
      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
        titleRef.current.style.opacity = `${1 - scrollY / 300}`;
      }

      // Image animation: Scroll ile düzleşme
      if (imageRef.current) {
        const rotation = Math.max(20 - scrollY * 0.1, 0); // Başlangıçta 20 derece, scroll ile 0 dereceye gelir
        const translateY = Math.min(scrollY * 0.2, 100); // Maksimum yukarı kayma 100px
        imageRef.current.style.transform = `
          perspective(1000px) 
          translateY(${translateY}px) 
          rotateX(${rotation}deg)
        `;
      }
    };

    // Başlangıçta görselin yamuk görünmesini sağlıyoruz
    if (imageRef.current) {
      imageRef.current.style.transform = `
        perspective(1000px) 
        translateY(0px) 
        rotateX(20deg)
      `;
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ScrollContainer>
      <TitleWrapper ref={titleRef}>{titleComponent}</TitleWrapper>
      <ImageWrapper ref={imageRef}>{children}</ImageWrapper>
    </ScrollContainer>
  );
};

// Styled Components
const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 2000vh; /* Daha uzun bir scroll efekti için */
  background-color: #f9f9f9;

  @media (prefers-color-scheme: dark) {
    background-color: #121212;
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  position: absolute;
  top: 20%;
  text-align: center;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  font-weight: 600;
  mix-blend-mode: difference;
  text-align: center;
  transition: transform 0.2s ease, opacity 0.2s ease;

  @media (prefers-color-scheme: dark) {
  }

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const HighlightText = styled.span`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  display: block;

  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: auto;
  perspective: 1000px; /* Perspektif efekti için */
`;

const HeroImage = styled.img`
  width: 90%;
  max-width: 1400px;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  transition: transform 0.2s ease;
`;

export default HeroScrollDemo;
