// MainPage.jsx
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Footer from "../ui/Footer";
import MailerLiteForm from "../ui/MailerLiteForm";
import SlideShow from "../ui/SlideShow";
import HeroScrollDemo from "../ui/HeroScrollDemo";
import CustomPremiumSections from "../ui/CustomPremiumSections";
import CountriesMarquee from "../ui/CountriesMarquee";
import FaqSectionComponent from "../ui/FaqSectionComponent";

// Main container
const MainContainer = styled.div`
  position: relative;
  width: 100%;
`;

// Premium section container
const PremiumSectionContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 80px;
  margin-bottom: 100px;
  
  @media (max-width: 768px) {
    margin-top: 60px;
    margin-bottom: 80px;
  }
`;

// Fade In Animation for sections that come after premium section
const FadeInSection = styled.div`
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease-out, transform 1s ease-out;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// RahatProfesyonelContainer - Mobil için optimize
const RahatProfesyonelContainer = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  
  @media (max-width: 800px) {
    gap: 40px;
    margin-top: 80px;
  }
  
  @media (max-width: 580px) {
    gap: 20px;
    flex-direction: ${props => props.reverse ? 'column-reverse' : 'column'};
    margin-top: 60px;
  }
`;

// RahatProfesyonelImage - Mobil için optimize
const RahatProfesyonelImage = styled.div`
  width: 300px;
  height: 600px;
  background: red;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 732px) {
    width: 175px;
    height: 350px;
  }
  
  @media (max-width: 580px) {
    width: 200px;
    height: 400px;
    margin-bottom: ${props => props.marginBottom || '0'};
    margin-top: ${props => props.marginTop || '0'};
  }
  
  @media (max-width: 410px) {
    width: 180px;
    height: 360px;
  }
  
  @media (max-width: 350px) {
    width: 160px;
    height: 320px;
  }
`;

// RahatProfesyonelText - Yeni komponent
const RahatProfesyonelText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  
  @media (max-width: 768px) {
    gap: 30px;
  }
  
  @media (max-width: 580px) {
    gap: 20px;
    text-align: center;
    align-items: center;
    max-width: 90%;
  }
`;

// RahatProfesyonelMobileHeading - Mobil için optimize
const RahatProfesyonelMobileHeading = styled.p`
  @media (min-width: 500px) {
    display: none !important;
  }
  color: var(--color-grey-904);
  font-weight: 600;
  text-align: center;
  font-size: 36px;
  margin-top: 70px;
  margin-bottom: -40px;
  display: block;
  
  @media (max-width: 480px) {
    margin-top: 60px;
    margin-bottom: -30px;
  }
  
  @media (max-width: 370px) {
    font-size: 32px;
    margin-top: 50px;
  }
  
  @media (max-width: 360px) {
    font-size: 28px;
  }
`;

// Smooth Scroll Indicator
const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366F1, #10B981, #EC4899);
  transform-origin: 0 0;
  transform: scaleX(0);
  z-index: 1000;
  
  @media (max-width: 480px) {
    height: 3px;
  }
`;

function MainPage() {
  const [fadeInSections, setFadeInSections] = useState([]);
  const premiumRef = useRef(null);
  const afterPremiumRef = useRef(null);
  const fadeInRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);
  
  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Premium bölümü tamamlandığında çağrılacak fonksiyon
  const handlePremiumComplete = () => {
    // Aşağıya doğru yumuşak bir geçiş yap
    if (afterPremiumRef.current) {
      const yOffset = -50; // Header yüksekliği veya diğer offsetler için ayar
      const y = afterPremiumRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Fade-in efektli bölümleri görünürlüklerini takip et
  useEffect(() => {
    // Fade-in için IntersectionObserver
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    
    const observers = [];
    
    // Her fade-in bölümü için observer oluştur
    fadeInRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Bölüm görünür olduğunda, state'e ekle
            setFadeInSections(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
            // Görünür olduktan sonra izlemeyi bırak
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      // Tüm observer'ları temizle
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Fade-in ref'lerini ayarla
  const setFadeInRef = (index) => (el) => {
    fadeInRefs.current[index] = el;
  };

  return (
    <MainContainer>
      {/* Scroll indicator */}
      <ScrollIndicator ref={scrollIndicatorRef} />
      
      <HeroScrollDemo />

      {/* Premium Features Section */}
      <PremiumSectionContainer ref={premiumRef}>
        <CustomPremiumSections onComplete={handlePremiumComplete} />
      </PremiumSectionContainer>

      {/* Marker for the section after premium */}
      <div ref={afterPremiumRef}></div>

      {/* Countries Section with Fade In */}
      <FadeInSection 
        ref={setFadeInRef(0)} 
        className={fadeInSections.includes(0) ? 'visible' : ''}
      >
        <CountriesMarquee />
      </FadeInSection>

      {/* Rahat Section with Fade In */}
      <FadeInSection 
        ref={setFadeInRef(1)} 
        className={fadeInSections.includes(1) ? 'visible' : ''}
      >
        <RahatProfesyonelMobileHeading>Çok Rahat</RahatProfesyonelMobileHeading>
        <RahatProfesyonelContainer>
          <RahatProfesyonelText>
            <Heading as="h15">Çok Rahat</Heading>
            <Heading as="h13">
              Vize başvuru sürecinin karmaşıklığını ve bilgi kirliliğinin negatif
              hissiyatını unutun ve her adımda size sunulan rehberlikle rahat,
              güvenli ve başarıya odaklı bir deneyimi yaşayın!
            </Heading>
          </RahatProfesyonelText>
          <RahatProfesyonelImage marginBottom="20px">s</RahatProfesyonelImage>
        </RahatProfesyonelContainer>
      </FadeInSection>

      {/* Profesyonel Section with Fade In */}
      <FadeInSection 
        ref={setFadeInRef(2)} 
        className={fadeInSections.includes(2) ? 'visible' : ''}
      >
        <RahatProfesyonelMobileHeading>
          Çok Profesyonel
        </RahatProfesyonelMobileHeading>
        <RahatProfesyonelContainer reverse>
          <RahatProfesyonelImage marginTop="20px">s</RahatProfesyonelImage>
          <RahatProfesyonelText>
            <Heading as="h15">Çok Profesyonel</Heading>
            <Heading as="h13">
              Vizepedia, alanında uzman ekibi ve profesyonel yaklaşımıyla vize
              başvurularınızda güvenilir ve etkili bir çözüm ortağı olarak
              yanınızda!
            </Heading>
          </RahatProfesyonelText>
        </RahatProfesyonelContainer>
      </FadeInSection>

      {/* SlideShow with Fade In */}
      <FadeInSection 
        ref={setFadeInRef(3)} 
        className={fadeInSections.includes(3) ? 'visible' : ''}
      >
        <SlideShow />
      </FadeInSection>

      {/* FAQ Section with Fade In */}
      <FadeInSection 
        ref={setFadeInRef(4)} 
        className={fadeInSections.includes(4) ? 'visible' : ''}
      >
        <FaqSectionComponent />
      </FadeInSection>

      {/* MailerLite Form with Fade In */}
      <FadeInSection 
        ref={setFadeInRef(5)} 
        className={fadeInSections.includes(5) ? 'visible' : ''}
      >
        <MailerLiteForm />
      </FadeInSection>

      {/* Footer */}
      <Footer />
    </MainContainer>
  );
}

export default MainPage;