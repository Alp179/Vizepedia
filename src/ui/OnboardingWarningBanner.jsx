import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

const WarningBanner = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  border-left: 5px solid #ff4757;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%);
    background-size: 20px 20px;
    opacity: 0.3;
  }

  @media (max-width: 710px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const WarningContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WarningTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 710px) {
    font-size: 1.2rem;
  }
`;

const WarningText = styled.p`
  margin: 0 0 16px 0;
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.95;

  @media (max-width: 710px) {
    font-size: 0.9rem;
  }
`;

const StartButton = styled.button`
  background: white;
  color: #ff6b6b;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: #f8f9fa;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 710px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const OnboardingWarningBanner = () => {
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    navigate('/wellcome');
  };

  return (
    <WarningBanner>
      <WarningContent>
        <WarningTitle>
          <span role="img" aria-label="warning">⚠️</span>
          Kişiselleştirilmiş İçerik İçin Onboarding Tamamlayın
        </WarningTitle>
        <WarningText>
          Dashboard&apos;unuzu kişiselleştirmek ve size özel belgeleri görmek için lütfen onboarding adımlarını tamamlayın. Bu işlem sadece birkaç dakikanızı alacak.
        </WarningText>
        <StartButton onClick={handleStartOnboarding}>
          Onboarding&apos;i Başlat
        </StartButton>
      </WarningContent>
    </WarningBanner>
  );
};

export default OnboardingWarningBanner;