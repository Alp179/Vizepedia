import { styled } from "styled-components";
import Heading from "../ui/Heading";

const StaticContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 710px) {
    padding: 20px 16px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 32px;

  @media (max-width: 710px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FeatureCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 710px) {
    padding: 20px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;

  @media (max-width: 710px) {
    font-size: 2rem;
  }
`;

const FeatureTitle = styled.h3`
  color: var(--color-grey-800);
  margin-bottom: 12px;
  font-size: 1.3rem;
  font-weight: 600;

  @media (max-width: 710px) {
    font-size: 1.2rem;
  }
`;

const FeatureDescription = styled.p`
  color: var(--color-grey-600);
  line-height: 1.6;
  font-size: 1rem;

  @media (max-width: 710px) {
    font-size: 0.9rem;
  }
`;

const ProcessSteps = styled.div`
  margin-top: 48px;
  padding: 32px;
  background: linear-gradient(135deg, #004466, #0066aa);
  border-radius: 16px;
  color: white;

  @media (max-width: 710px) {
    margin-top: 32px;
    padding: 24px;
  }
`;

const StepsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 24px 0 0 0;
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  counter-increment: step;

  &::before {
    content: counter(step);
    background: #00ffa2;
    color: #004466;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 16px;
    flex-shrink: 0;
    font-size: 0.9rem;
  }

  @media (max-width: 710px) {
    &::before {
      width: 28px;
      height: 28px;
      margin-right: 12px;
      font-size: 0.8rem;
    }
  }
`;

const StepText = styled.span`
  font-size: 1.1rem;
  line-height: 1.5;
  padding-top: 4px;

  @media (max-width: 710px) {
    font-size: 1rem;
  }
`;

const StaticDashboardContent = () => {
  return (
    <StaticContainer>
      <Heading as="h1" style={{ textAlign: 'center', marginBottom: '16px' }}>
        Kişiselleştirilmiş Vize Başvuru Dashboard&apos;u
      </Heading>
      
      <p style={{ 
        textAlign: 'center', 
        fontSize: '1.2rem', 
        color: 'var(--color-grey-600)', 
        marginBottom: '32px',
        lineHeight: '1.6'
      }}>
        Size özel vize başvuru belgeleri, randevu takibi ve adım adım rehberlik için onboarding sürecini tamamlayın.
      </p>

      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>📋</FeatureIcon>
          <FeatureTitle>Kişiselleştirilmiş Belgeler</FeatureTitle>
          <FeatureDescription>
            Hedef ülkeniz ve durumunuza göre özelleştirilmiş vize başvuru belgeleri ve formları.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📅</FeatureIcon>
          <FeatureTitle>Randevu Takibi</FeatureTitle>
          <FeatureDescription>
            Vize randevunuzu takip edin, hatırlatmalar alın ve başvuru sürecinizi yönetin.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🗺️</FeatureIcon>
          <FeatureTitle>Başvuru Adresleri</FeatureTitle>
          <FeatureDescription>
            Hedef ülkenize göre vize başvuru yapabileceğiniz konsolosluk ve vize merkezlerinin konumları.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>✅</FeatureIcon>
          <FeatureTitle>Adım Adım Rehberlik</FeatureTitle>
          <FeatureDescription>
            Vize başvuru sürecinizin her adımında size rehberlik eden interaktif kontrol listesi.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🏢</FeatureIcon>
          <FeatureTitle>Sponsorluk Desteği</FeatureTitle>
          <FeatureDescription>
            Sponsor bulma ve sponsorluk belgelerini hazırlama konusunda detaylı bilgi ve destek.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>İlerleme Takibi</FeatureTitle>
          <FeatureDescription>
            Başvuru sürecinizin hangi aşamada olduğunu görebilir ve eksik adımları tamamlayabilirsiniz.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>

      <ProcessSteps style={{ counterReset: 'step' }}>
        <Heading as="h2" style={{ color: 'white', marginBottom: '24px', textAlign: 'center' }}>
          Nasıl Başlarsınız?
        </Heading>
        
        <StepsList>
          <StepItem>
            <StepText>Hedef ülkenizi ve seyahat amacınızı belirtin</StepText>
          </StepItem>
          <StepItem>
            <StepText>Kişisel durumunuz hakkında sorularımızı yanıtlayın</StepText>
          </StepItem>
          <StepItem>
            <StepText>Size özel belge listesi ve rehber oluşturulur</StepText>
          </StepItem>
          <StepItem>
            <StepText>Kişiselleştirilmiş dashboard&apos;unuza erişim sağlayın</StepText>
          </StepItem>
          <StepItem>
            <StepText>Vize başvuru sürecinizi adım adım tamamlayın</StepText>
          </StepItem>
        </StepsList>
      </ProcessSteps>
    </StaticContainer>
  );
};

export default StaticDashboardContent;