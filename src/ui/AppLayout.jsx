import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CountriesMarquee from "./CountriesMarquee";
import styled from "styled-components";
import DashboardMobileHeader from "./DashboardMobileHeader";
import MobileMenu from "./MobileMenu";
import SlideShow from "./SlideShow";
import { useUser } from "../features/authentication/useUser";

const StyledAppLayout = styled.div`
  overflow: clip;
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  background: var(--color-grey-1);

  @media (max-width: 1300px) {
    grid-template-columns: 22rem 1fr;
  }
  @media (max-width: 1050px) {
    grid-template-columns: 19rem 1fr;
  }
  @media (max-width: 830px) {
    grid-template-columns: 17rem 1fr;
  }
  @media (max-width: 710px) {
    grid-template-columns: none;
    grid-template-rows: none;
    /* Mobilde height'i içeriğe göre ayarla */
    height: auto;
    min-height: 100vh;
  }
`;

const Main = styled.main`
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: clip;
  z-index: 1;
  backdrop-filter: blur(0px);
  padding: 10rem 0 0 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  @media (max-width: 710px) {
    /* Mobilde padding'i azalt ve height'i serbest bırak */
    padding-top: 0; 
    min-height: auto; /* min-height kaldır */
    height: auto; /* İçeriğe göre height */
  }

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }

  @media (max-width: 710px) {
    &::-webkit-scrollbar {
      width: 0;
    }

    &::-webkit-scrollbar-track {
      background: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-brand-600);
      border-radius: 10px;
      border: 3px solid var(--color-grey-2);
    }
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 0 0 100px;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  @media (max-width: 1550px) {
    margin-left: 150px;
  }

  @media (max-width: 710px) {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    gap: 2rem; /* Gap azalt: 3.2rem -> 2rem */
    padding: 0; /* Yan padding ekle */
  }

  @media (max-width: 450px) {
    gap: 1.5rem; /* Daha da azalt */
    padding: 0;
  }
`;

const MobileMenuContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
`;

// SlideShow wrapper'ı ekleyelim - mobilde daha kompakt olsun
const SlideShowWrapper = styled.div`
  @media (max-width: 710px) {
    margin-top: 2rem; /* SlideShow üst margin'ini azalt */
  }

  @media (max-width: 450px) {
    margin-top: 1rem;
  }
`;

// Welcome Modal Styles - Ultra Premium Refined Version
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  padding: 20px;
  animation: overlayFadeIn 1.2s ease-out;

  @keyframes overlayFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px) saturate(100%);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(20px) saturate(180%);
    }
  }

  @media (max-width: 710px) {
    padding: 16px;
  }
`;

const WelcomeModal = styled.div`
  background: linear-gradient(
    145deg,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(30, 41, 59, 0.98) 15%,
    rgba(0, 68, 102, 0.95) 30%,
    rgba(6, 78, 59, 0.98) 45%,
    rgba(45, 55, 72, 0.95) 60%,
    rgba(0, 68, 102, 0.98) 75%,
    rgba(15, 23, 42, 0.95) 100%
  );
  background-size: 600% 600%;
  animation: luxuryGradientFlow 20s ease-in-out infinite;
  backdrop-filter: blur(40px) saturate(150%);
  padding: 48px;
  border-radius: 32px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  max-width: 580px;
  width: 100%;
  box-shadow: 0 32px 120px rgba(0, 0, 0, 0.6), 0 8px 32px rgba(0, 68, 102, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: "";
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: conic-gradient(
      from 0deg at 50% 50%,
      rgba(255, 255, 255, 0.02) 0deg,
      rgba(0, 255, 162, 0.08) 60deg,
      rgba(255, 255, 255, 0.02) 120deg,
      rgba(147, 51, 234, 0.06) 180deg,
      rgba(255, 255, 255, 0.02) 240deg,
      rgba(0, 255, 162, 0.08) 300deg,
      rgba(255, 255, 255, 0.02) 360deg
    );
    pointer-events: none;
    animation: luxuryShimmer 25s linear infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 32px;
    padding: 1px;
    background: linear-gradient(
      45deg,
      rgba(0, 255, 162, 0.4),
      rgba(147, 51, 234, 0.3),
      rgba(59, 130, 246, 0.4),
      rgba(0, 255, 162, 0.4)
    );
    background-size: 400% 400%;
    animation: luxuryBorderFlow 22s ease-in-out infinite;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: subtract;
    pointer-events: none;
  }

  @keyframes luxuryGradientFlow {
    0%,
    100% {
      background-position: 0% 50%;
    }
    20% {
      background-position: 80% 20%;
    }
    40% {
      background-position: 100% 80%;
    }
    60% {
      background-position: 20% 100%;
    }
    80% {
      background-position: 80% 20%;
    }
  }

  @keyframes luxuryShimmer {
    0% {
      transform: rotate(0deg) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: rotate(180deg) scale(1.1);
      opacity: 0.6;
    }
    100% {
      transform: rotate(360deg) scale(1);
      opacity: 0.3;
    }
  }

  @keyframes luxuryBorderFlow {
    0%,
    100% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    75% {
      background-position: 0% 100%;
    }
  }

  @media (max-width: 710px) {
    padding: 40px 28px;
    max-width: 440px;
    border-radius: 28px;
  }
`;

const WelcomeTitle = styled.h2`
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 20px 0;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    rgba(0, 255, 162, 0.9) 30%,
    #ffffff 60%,
    rgba(147, 51, 234, 0.8) 100%
  );
  background-size: 200% 200%;
  animation: textShimmer 8s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 255, 162, 0.3);
  line-height: 1.1;
  letter-spacing: -0.02em;

  @keyframes textShimmer {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @media (max-width: 710px) {
    font-size: 28px;
  }
`;

const WelcomeSubtitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: rgba(0, 255, 162, 0.9);
  text-transform: uppercase;
  letter-spacing: 3px;
  opacity: 0.8;

  @media (max-width: 710px) {
    font-size: 13px;
    letter-spacing: 2px;
  }
`;

const WelcomeDescription = styled.p`
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.9;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 32px;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media (max-width: 710px) {
    font-size: 16px;
    margin-bottom: 28px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 22px;
  font-weight: 300;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(20px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }

  @media (max-width: 710px) {
    width: 36px;
    height: 36px;
    font-size: 20px;
    top: 16px;
    right: 16px;
  }
`;

const FeatureHighlights = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 32px 0 0 0;
  flex-wrap: wrap;

  @media (max-width: 710px) {
    gap: 24px;
    margin: 28px 0 0 0;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0.85;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
  }

  .icon {
    font-size: 28px;
    margin-bottom: 8px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .text {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.3;
  }

  @media (max-width: 710px) {
    .icon {
      font-size: 24px;
      margin-bottom: 6px;
    }

    .text {
      font-size: 11px;
      letter-spacing: 0.5px;
    }
  }
`;

function AppLayout() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { userType } = useUser();

  // Check if we should show welcome modal for bot/new visitors
  useEffect(() => {
    const shouldShowModal = userType === "bot" || userType === "new_visitor";

    if (shouldShowModal) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [userType]);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <>
      {/* Welcome Modal - Covers entire AppLayout (Refined Version) */}
      {showWelcomeModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <WelcomeModal onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>

            <WelcomeSubtitle>🚀 Platform Tanıtımı</WelcomeSubtitle>
            <WelcomeTitle>Vizepediaya Hoş Geldiniz!</WelcomeTitle>

            <WelcomeDescription>
              Vize başvuru sürecinizi adım adım takip edin ve kolayca yönetin.
              Bu demo ile platformumuzun tüm özelliklerini keşfedebilirsiniz.
            </WelcomeDescription>

            <FeatureHighlights>
              <FeatureItem>
                <div className="icon">📋</div>
                <div className="text">
                  Adım Adım
                  <br />
                  Rehberlik
                </div>
              </FeatureItem>
              <FeatureItem>
                <div className="icon">⚡</div>
                <div className="text">
                  Hızlı
                  <br />
                  Süreç
                </div>
              </FeatureItem>
              <FeatureItem>
                <div className="icon">🎯</div>
                <div className="text">
                  Uzman
                  <br />
                  Desteği
                </div>
              </FeatureItem>
            </FeatureHighlights>
          </WelcomeModal>
        </ModalOverlay>
      )}

      <StyledAppLayout>
        <Header />
        <Sidebar />
        <DashboardMobileHeader />
        <MobileMenuContainer>
          <MobileMenu />
        </MobileMenuContainer>
        <Main>
          <Container>
            <Outlet />
            
          </Container>
          <CountriesMarquee />
          <SlideShowWrapper>
            <SlideShow />
          </SlideShowWrapper>
        </Main>
      </StyledAppLayout>
    </>
  );
}

export default AppLayout;
