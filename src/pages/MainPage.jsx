// MainPage.jsx
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Footer from "../ui/Footer";
import MailerLiteForm from "../ui/MailerLiteForm";
import SlideShow from "../ui/SlideShow";

import CustomPremiumSections from "../ui/CustomPremiumSections";
import CountriesMarquee from "../ui/CountriesMarquee";
import FaqSectionComponent from "../ui/FaqSectionComponent";
import HeroParallax from "../ui/HeroParallax";

// MainPage.jsx'e eklemek için örnek ürün verileri
const products = [
  {
    title: "Web Development",
    link: "/services/web-development",
    thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mobile App Development",
    link: "/services/mobile-development",
    thumbnail: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "UI/UX Design",
    link: "/services/ui-ux-design",
    thumbnail: "https://images.unsplash.com/photo-1545235617-7a424c1a60cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Cloud Services",
    link: "/services/cloud-services",
    thumbnail: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "DevOps Solutions",
    link: "/services/devops",
    thumbnail: "https://images.unsplash.com/photo-1633998805650-511bb6c7953b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Artificial Intelligence",
    link: "/services/ai",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Blockchain Development",
    link: "/services/blockchain",
    thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Data Analytics",
    link: "/services/data-analytics",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "IoT Solutions",
    link: "/services/iot",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "E-commerce Solutions",
    link: "/services/ecommerce",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "API Development",
    link: "/services/api-development",
    thumbnail: "https://images.unsplash.com/photo-1623282033815-40b05d96c333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Digital Marketing",
    link: "/services/digital-marketing",
    thumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "CMS Development",
    link: "/services/cms-development",
    thumbnail: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Cybersecurity",
    link: "/services/cybersecurity",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "AR/VR Development",
    link: "/services/ar-vr",
    thumbnail: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

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
      
      <HeroParallax products={products} />

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