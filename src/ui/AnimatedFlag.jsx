/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

// Sürekli ve kesintisiz yukarıdan aşağıya akan animasyon
const moveFlagAnimation = keyframes`
  0% {
    transform: translateY(-55%) rotate(31deg);
  }
  10% {
    transform: translateY(-40%) rotate(31deg);
  }
  20% {
    transform: translateY(-30%) rotate(31deg);
  }
   30% {
    transform: translateY(-20%) rotate(31deg);
  }
  40% {
    transform: translateY(-10%) rotate(31deg);
  }
  50% {
    transform: translateY(-0%) rotate(31deg);
  }
    60% {
    transform: translateY(-10%) rotate(31deg);
  }
  70% {
    transform: translateY(-20%) rotate(31deg);
  }
  80% {
    transform: translateY(-30%) rotate(31deg);
  }
   90% {
    transform: translateY(-40%) rotate(31deg);
  }
  100% {
    transform: translateY(-55%) rotate(31deg);
  }
`;

// Ana bayrak konteyneri - temiz ve modern
const FlagContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 800px;
  height: 300px;
  transform: translate(23%, -20%) rotate(31deg);
  border-radius: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
  opacity: 1;

  /* Fade efekti için mask */
  mask: radial-gradient(
    ellipse 120% 80% at center,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.9) 40%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.3) 85%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask: radial-gradient(
    ellipse 120% 80% at center,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.9) 40%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.3) 85%,
    rgba(0, 0, 0, 0) 100%
  );

  @media (max-width: 1450px) {
    width: 700px;
    height: 250px;
  }

  @media (max-width: 1200px) {
    width: 600px;
    height: 220px;
  }

  @media (max-width: 900px) {
    width: 500px;
    height: 180px;
  }

  @media (max-width: 450px) {
    width: 400px;
    height: 150px;
  }

  @media (max-width: 375px) {
    width: 350px;
    height: 130px;
  }
`;

const BlurredFlagBackground = styled.div`
  position: fixed;
  top: -10%;
  right: -10%;
  width: 900px;
  height: 400px;
  filter: blur(150px);
  z-index: 0;
  animation: ${moveFlagAnimation} 14s linear infinite;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;

  @media (max-width: 1450px) {
    width: 800px;
    height: 350px;
  }

  @media (max-width: 1200px) {
    width: 700px;
    height: 300px;
  }

  @media (max-width: 900px) {
    width: 650px;
    height: 300px;
    right: -15%;
  }

  @media (max-width: 768px) {
    width: 600px;
    height: 350px;
    right: -15%;
  }
    
  @media (max-width: 450px) {
    width: 550px !important;
    right: -20%;
    height: 350px !important;
  }

  @media (max-width: 375px) {
    width: 500px !important;
    right: -25%;
    height: 350px !important;
  }
`;

const AnimatedFlag = ({ countryCode }) => {
  // 1) Hook'lar en üstte
  const svgContainerRef = useRef(null);
  const flagUrl = countryCode
    ? `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`
    : null;

  useEffect(() => {
    if (!flagUrl) return; // countryCode yoksa hiçbir şey yapma

    const fetchAndStretchSVG = async () => {
      try {
        const response = await fetch(flagUrl);
        const svgText = await response.text();
        const modifiedSvg = svgText.replace(
          "<svg",
          '<svg preserveAspectRatio="none"'
        );

        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = modifiedSvg;
          const svgEl = svgContainerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.width = "100%";
            svgEl.style.height = "100%";
          }
        }
      } catch (error) {
        console.error("Bayrak yüklenirken hata oluştu:", error);
      }
    };

    fetchAndStretchSVG();
  }, [flagUrl]); // sadece flagUrl değiştiğinde çalış

  // 2) countryCode yoksa render etme
  if (!countryCode) {
    return null;
  }

  return (
    <>
      {/* Bulanık arka plan */}
      <BlurredFlagBackground
        style={{
          backgroundImage: `url(${flagUrl})`,
        }}
      />

      {/* Ana bayrak container'ı */}
      <FlagContainer>
        {/* SVG'nin ekleneceği div */}
        <div
          ref={svgContainerRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </FlagContainer>
    </>
  );
};

export default AnimatedFlag;
