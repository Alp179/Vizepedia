/* eslint-disable react/prop-types */
import styled, { keyframes } from "styled-components";
import "flag-icons/css/flag-icons.min.css";

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

const FlagContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 800px; /* Genişlik artırıldı */
  height: 300px; /* Yükseklik azaltıldı */
  transform: translate(23%, -20%) rotate(31deg);
  border-radius: 0; /* Şerit görünümü için radius kaldırıldı */
  overflow: hidden;
  z-index: 0;
  pointer-events: none;

  & > span {
    width: 100%;
    height: 100%;
    display: block;
    background-size: cover;
    background-position: center;
  }

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
  width: 900px; /* Genişlik artırıldı */
  height: 400px; /* Yükseklik azaltıldı */
  filter: blur(150px);
  z-index: 0;
  animation: ${moveFlagAnimation} 14s linear infinite; // Animasyon değiştirilmedi
  background-size: 100% 100%;

  @media (max-width: 1450px) {
    width: 800px;
    height: 350px;
  }

  @media (max-width: 1200px) {
    width: 700px;
    height: 300px;
  }

  @media (max-width: 900px) {
    width: 600px;
    height: 250px;
  }

  @media (max-width: 450px) {
    width: 500px !important;
    right: -20%;
    height: 200px !important;
  }
`;

const AnimatedFlag = ({ countryCode }) => {
  if (!countryCode) return null;

  return (
    <>
      <BlurredFlagBackground
        style={{
          backgroundImage: `url(https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg)`,
        }}
      />
      <FlagContainer>
        <span className={`fi fi-${countryCode}`}></span>
      </FlagContainer>
    </>
  );
};

export default AnimatedFlag;