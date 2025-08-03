import { styled } from "styled-components";
import { useEffect } from "react";

const StaticContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
  margin: 0 auto;

  @media (max-width: 1650px) {
    margin-left: -40px;
  }

  @media (max-width: 1600px) {
    margin-left: -80px;
  }

  @media (max-width: 1550px) {
    margin-left: -130px;
  }

  @media (max-width: 710px) {
    padding: 20px 16px;
    margin-left: 0;
    margin-top: 55px;
  }
`;

const HeadingStatic = styled.h1`
  font-size: 36px;
  @media (max-width: 400px) {
    font-size: 32px;
  }
  @media (max-width: 295px) {
    font-size: 28px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: 24px;
  margin-top: 32px;
  width: 100%;

  /* 3x2 layout on big screens (default) */
  grid-template-columns: repeat(3, 1fr);

  /* 2x3 layout on screens below 1000px */
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 1x6 layout on screens below 600px */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* Ensure all cards have the same height */
  display: flex;
  flex-direction: column;
  min-height: 250px; /* Set a minimum height for consistency */

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 1000px) {
    min-height: 220px;
  }

  @media (max-width: 600px) {
    min-height: 250px;
    padding: 20px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  text-align: center; /* Center the icon */

  @media (max-width: 1000px) {
    font-size: 3.7rem;
  }

  @media (max-width: 600px) {
    font-size: 3.5rem;
    margin-bottom: 12px;
  }
`;

const FeatureTitle = styled.h3`
  color: var(--color-grey-800);
  font-size: 1.9rem;
  font-weight: 600;
  text-align: center; /* Center the title */

  @media (max-width: 1000px) {
    font-size: 1.7rem;
  }

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const FeatureDescription = styled.p`
  color: var(--color-grey-600);
  line-height: 1.6;
  font-size: 1.5rem;
  text-align: center; /* Center the description */
  flex-grow: 1; /* This ensures the description takes up remaining space */
  display: flex;
  align-items: center; /* Vertically center the text within the available space */

  @media (max-width: 1000px) {
    font-size: 1.4rem;
  }

  @media (max-width: 600px) {
    font-size: 1.6rem;
  }
`;

const HeadingSteps = styled.h2`
  fonts-size: 24px;
`;

const ProcessSteps = styled.div`
  margin-top: 48px;
  padding: 32px;
  background: linear-gradient(135deg, #004466, #0066aa);
  border-radius: 16px;
  color: white;
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
    font-size: 1.5rem;
  }

  @media (max-width: 1000px) {
    &::before {
      margin-right: 12px;
      font-size: 1.4rem;
    }

  @media (max-width: 600px) {
    &::before {
      width: 28px;
      height: 28px;
      margin-right: 12px;
      font-size: 1.6rem;
    }
  }
`;

const StepText = styled.span`
  font-size: 1.5rem;
  line-height: 1.5;
  padding-top: 4px;

  @media (max-width: 1000px) {
    font-size: 1.4rem;
  }
  @media (max-width: 600px) {
    font-size: 1.6rem;
  }
`;

// AdSense reklam alanı için styled component
const AdContainer = styled.div`
  width: 100%;
  min-height: 250px;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  
  /* Reklam alanının görünür olduğundan emin ol */
  .adsbygoogle {
    display: block !important;
    width: 100%;
    min-width: 300px;
    min-height: 250px;
  }
  
  @media (max-width: 600px) {
    margin: 30px 0;
    min-height: 200px;
    
    .adsbygoogle {
      min-height: 200px;
    }
  }
`;

const StaticDashboardContent = () => {
  useEffect(() => {
    // Önceki AdSense script'lerini temizle
    const existingScripts = document.querySelectorAll('script[src*="adsbygoogle.js"]');
    existingScripts.forEach(script => script.remove());

    // AdSense script'ini yükle
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9096433647543770';
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log("AdSense script loaded successfully");
      
      // Reklam alanının görünür olmasını bekle
      const checkAndInitializeAd = () => {
        const adElement = document.querySelector('.adsbygoogle');
        if (adElement && adElement.offsetWidth > 0) {
          // Daha önce reklam yüklenmemiş mi kontrol et
          if (!adElement.dataset.adsbygoogleStatus) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              adElement.dataset.adsbygoogleStatus = 'done';
              console.log("AdSense ad pushed to queue");
            } catch (e) {
              console.error("AdSense initialization error:", e);
            }
          }
        } else {
          // Element henüz hazır değilse 100ms sonra tekrar dene
          setTimeout(checkAndInitializeAd, 100);
        }
      };
      
      // Kısa bir gecikme ile kontrol et
      setTimeout(checkAndInitializeAd, 200);
    };
    
    script.onerror = (error) => {
      console.warn("AdSense script could not be loaded:", error);
    };
    
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <StaticContainer>
      <HeadingStatic
        as="h1"
        style={{ textAlign: "center", marginBottom: "16px" }}
      >
        Kişiselleştirilmiş Vize Başvuru Dashboard&apos;u
      </HeadingStatic>

      <p
        style={{
          textAlign: "center",
          fontSize: "1.7rem",
          color: "var(--color-grey-600)",
          marginBottom: "32px",
          lineHeight: "1.6",
        }}
      >
        Size özel vize başvuru belgeleri, randevu takibi ve adım adım rehberlik
        için onboarding sürecini tamamlayın.
      </p>

      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>📋</FeatureIcon>
          <FeatureTitle>Kişiselleştirilmiş Belgeler</FeatureTitle>
          <FeatureDescription>
            Hedef ülkeniz ve durumunuza göre özelleştirilmiş vize başvuru
            belgeleri ve formları.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📅</FeatureIcon>
          <FeatureTitle>Randevu Takibi</FeatureTitle>
          <FeatureDescription>
            Vize randevunuzu takip edin, hatırlatmalar alın ve başvuru
            sürecinizi yönetin.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🗺️</FeatureIcon>
          <FeatureTitle>Başvuru Adresleri</FeatureTitle>
          <FeatureDescription>
            Hedef ülkenize göre vize başvuru yapabileceğiniz konsolosluk ve vize
            merkezlerinin konumları.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>✅</FeatureIcon>
          <FeatureTitle>Adım Adım Rehberlik</FeatureTitle>
          <FeatureDescription>
            Vize başvuru sürecinizin her adımında size rehberlik eden interaktif
            kontrol listesi.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🏢</FeatureIcon>
          <FeatureTitle>Sponsorluk Desteği</FeatureTitle>
          <FeatureDescription>
            Sponsor bulma ve sponsorluk belgelerini hazırlama konusunda detaylı
            bilgi ve destek.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>İlerleme Takibi</FeatureTitle>
          <FeatureDescription>
            Başvuru sürecinizin hangi aşamada olduğunu görebilir ve eksik
            adımları tamamlayabilirsiniz.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>

      {/* Google AdSense Reklam Alanı */}
      <AdContainer>
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9096433647543770"
          data-ad-slot="4888104758"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </AdContainer>

      <ProcessSteps style={{ counterReset: "step" }}>
        <HeadingSteps
          as="h2"
          style={{ color: "white", marginBottom: "24px", textAlign: "center" }}
        >
          Nasıl Başlarsınız?
        </HeadingSteps>

        <StepsList>
          <StepItem>
            <StepText>Hedef ülkenizi ve seyahat amacınızı belirtin</StepText>
          </StepItem>
          <StepItem>
            <StepText>
              Kişisel durumunuz hakkında sorularımızı yanıtlayın
            </StepText>
          </StepItem>
          <StepItem>
            <StepText>Size özel belge listesi ve rehber oluşturulur</StepText>
          </StepItem>
          <StepItem>
            <StepText>
              Kişiselleştirilmiş dashboard&apos;unuza erişim sağlayın
            </StepText>
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