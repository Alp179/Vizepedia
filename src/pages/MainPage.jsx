// MainPage.jsx
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Footer from "../ui/Footer";
import MailerLiteForm from "../ui/MailerLiteForm";
import { useLocation } from 'react-router-dom';

import SlideShow from "../ui/SlideShow";
import InvitationToolSection from "../ui/InvitationToolSection"; // Yeni komponent import

import CustomPremiumSections from "../ui/CustomPremiumSections";
import CountriesMarquee from "../ui/CountriesMarquee";
import FaqSectionComponent from "../ui/FaqSectionComponent";
import HeroParallax from "../ui/HeroParallax";

// Main container
const MainContainer = styled.div`
  position: relative;
  width: 100%;
`;

// Premium section container
const PremiumSectionContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 100px;

  @media (max-width: 768px) {
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

// Smooth Scroll Indicator
const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #10b981, #ec4899);
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
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;

      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  // Inside your main page component:
const location = useLocation();

useEffect(() => {
  // Check if there's a hash in the URL when component mounts
  if (location.hash === '#faq-section') {
    // Small delay to ensure the page has fully rendered
    const timer = setTimeout(() => {
      const faqSection = document.getElementById("faq-section");
      
      if (faqSection) {
        // Header'ı bul ve yüksekliğini ölç
        const headerElement = document.querySelector('header');
        const headerHeight = headerElement ? headerElement.offsetHeight : 0;
        
        // FAQ section'ın pozisyonunu al
        const faqPosition = faqSection.getBoundingClientRect().top;
        // Geçerli scroll pozisyonunu al
        const scrollPosition = window.pageYOffset;
        // Header yüksekliği + 50px ek boşluk bırak
        const offsetPosition = faqPosition + scrollPosition - headerHeight - 50;
        
        // Smooth scroll ile git
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }
}, [location.hash]);

  // Premium bölümü tamamlandığında çağrılacak fonksiyon
  const handlePremiumComplete = () => {
    // Aşağıya doğru yumuşak bir geçiş yap
    if (afterPremiumRef.current) {
      const yOffset = -50; // Header yüksekliği veya diğer offsetler için ayar
      const y =
        afterPremiumRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  // Fade-in efektli bölümleri görünürlüklerini takip et
  useEffect(() => {
    // Fade-in için IntersectionObserver
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observers = [];

    // Her fade-in bölümü için observer oluştur
    fadeInRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Bölüm görünür olduğunda, state'e ekle
            setFadeInSections((prev) => {
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
      observers.forEach((observer) => observer.disconnect());
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

      <HeroParallax />

      {/* Premium Features Section */}
      <PremiumSectionContainer ref={premiumRef}>
        <CustomPremiumSections onComplete={handlePremiumComplete} />
      </PremiumSectionContainer>

      {/* Marker for the section after premium */}
      <div ref={afterPremiumRef}></div>

      {/* Countries Section with Fade In */}
      <FadeInSection
        ref={setFadeInRef(0)}
        className={fadeInSections.includes(0) ? "visible" : ""}
      >
        <CountriesMarquee />
      </FadeInSection>

      {/* Invitation Tool Section - YENİ EKLENEN BÖLÜM */}
      <FadeInSection
        ref={setFadeInRef(1)}
        className={fadeInSections.includes(1) ? "visible" : ""}
      >
        <InvitationToolSection />
      </FadeInSection>

      {/* SlideShow with Fade In - Index güncellendi */}
      <FadeInSection
        ref={setFadeInRef(2)}
        className={fadeInSections.includes(2) ? "visible" : ""}
      >
        <SlideShow />
      </FadeInSection>

      {/* FAQ Section with Fade In - Index güncellendi */}
      <FadeInSection
        ref={setFadeInRef(3)}
        className={fadeInSections.includes(3) ? "visible" : ""}
      >
        <FaqSectionComponent />
      </FadeInSection>

      {/* MailerLite Form with Fade In - Index güncellendi */}
      <FadeInSection
        ref={setFadeInRef(4)}
        className={fadeInSections.includes(4) ? "visible" : ""}
      >
        <MailerLiteForm />
      </FadeInSection>

      {/* Footer */}
      <Footer />
    </MainContainer>
  );
}

export default MainPage;
