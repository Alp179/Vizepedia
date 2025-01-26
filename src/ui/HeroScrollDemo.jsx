/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import styled from "styled-components";

// Styled Components
const HeroContainer = styled.div`
  padding-top: 200px;
  padding-bottom: 65px;
  overflow: hidden;
  @media (prefers-color-scheme: dark) {
    background-color: #121212;
  }
`;

const PositionContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const TitleWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  mix-blend-mode: luminosity;

  @media (max-width: 1000px) {
    top: 45%;
  }
`;

const Title = styled.h1`
  max-width: 100%;
  font-weight: 600;
  text-align: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 70px;
  @media (max-width: 1410px) {
    font-size: 60px;
  }
  @media (max-width: 1200px) {
    font-size: 55px;
  }
  @media (max-width: 1050px) {
    font-size: 50px;
  }
  @media (max-width: 930px) {
    font-size: 45px;
  }
  @media (max-width: 830px) {
    font-size: 40px;
  }
  @media (max-width: 730px) {
    font-size: 35px;
  }
`;

const HighlightText = styled.span`
  font-size: 70px;
  font-weight: 800;
  line-height: 1;
  mix-blend-mode: difference;
  @media (max-width: 1410px) {
    font-size: 65px;
  }
  @media (max-width: 1200px) {
    font-size: 60px;
  }
  @media (max-width: 1050px) {
    font-size: 55px;
  }
  @media (max-width: 830px) {
    font-size: 45px;
  }
  @media (max-width: 730px) {
    font-size: 40px;
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

const ContainerScroll = ({ titleComponent, children }) => {
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Title animation: Yukarı hareket ve opaklık azalması
      if (titleRef.current) {
        titleRef.current.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
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
    <PositionContainer>
      <TitleWrapper ref={titleRef}>{titleComponent}</TitleWrapper>
      <ImageWrapper ref={imageRef}>{children}</ImageWrapper>
    </PositionContainer>
  );
};

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

export default HeroScrollDemo;
