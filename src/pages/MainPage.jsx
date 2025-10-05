import { useState, useEffect, useRef, memo, lazy, Suspense } from "react";
import styled from "styled-components";
import Footer from "../ui/Footer";
import MailerLiteForm from "../ui/MailerLiteForm";
import { useLocation } from "react-router-dom";
import SEO from "../components/SEO";

// Lazy load heavy components to improve initial page load
const SlideShow = lazy(() => import("../ui/SlideShow"));
const InvitationToolSection = lazy(() => import("../ui/InvitationToolSection"));
const CustomPremiumSections = lazy(() => import("../ui/CustomPremiumSections"));
const CountriesMarquee = lazy(() => import("../ui/CountriesMarquee"));
const FaqSectionComponent = lazy(() => import("../ui/FaqSectionComponent"));
const HeroParallax = lazy(() => import("../ui/HeroParallax"));

// Loading skeleton component for better UX during lazy loading
const ComponentSkeleton = styled.div`
  width: 100%;
  height: ${(props) => props.height || "400px"};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Optimized styled components with performance improvements
const MainContainer = styled.div`
  position: relative;
  width: 100%;
  contain: layout;
`;

const PremiumSectionContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 100px;
  contain: layout style;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

// Optimized FadeInSection with GPU acceleration
const FadeInSection = styled.div`
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  will-change: opacity, transform;

  &.visible {
    opacity: 1;
    transform: translateY(0);
    will-change: auto;
  }
`;

// Optimized scroll indicator with transform3d for GPU acceleration
const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #10b981, #ec4899);
  transform-origin: 0 0;
  transform: translate3d(0, 0, 0) scaleX(0);
  z-index: 1000;
  will-change: transform;

  @media (max-width: 480px) {
    height: 3px;
  }
`;

// Custom hook for optimized scroll progress tracking
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = Math.min(window.scrollY / totalHeight, 1);
          setProgress(scrollProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return progress;
};

// Intersection observer hook
const useIntersectionObserver = (options = {}) => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const elementsRef = useRef(new Map());
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleElements((prev) => {
          const updates = new Set(prev);

          entries.forEach((entry) => {
            const index = elementsRef.current.get(entry.target);
            if (entry.isIntersecting) {
              updates.add(index);
            } else {
              if (!options.keepVisible) {
                updates.delete(index);
              }
            }
          });

          return updates;
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
        ...options,
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options.keepVisible]);

  const setElementRef = (index) => (element) => {
    if (element && observerRef.current) {
      elementsRef.current.set(element, index);
      observerRef.current.observe(element);
    }
  };

  return [visibleElements, setElementRef];
};

// Main component
function MainPage() {
  const scrollProgress = useScrollProgress();
  const [visibleSections, setElementRef] = useIntersectionObserver({
    unobserveOnIntersect: true,
  });
  const scrollIndicatorRef = useRef(null);
  const location = useLocation();

  // Optimized scroll indicator update
  useEffect(() => {
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.transform = `translate3d(0, 0, 0) scaleX(${scrollProgress})`;
    }
  }, [scrollProgress]);

  // FAQ section scrolling
  useEffect(() => {
    if (location.hash === "#faq-section") {
      const timer = setTimeout(() => {
        const faqSection = document.getElementById("faq-section");
        if (faqSection) {
          const headerElement = document.querySelector("header");
          const headerHeight = headerElement ? headerElement.offsetHeight : 0;
          const elementTop =
            faqSection.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementTop - headerHeight - 70;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <MainContainer>
      {/* ============================================ */}
      {/* SEO COMPONENT - ANA SAYFA (HOME PAGE) */}
      {/* ============================================ */}
      <SEO
        title="Vizepedia - Kapsamlı Vize Başvuru Rehberi | 50+ Ülke İçin Güncel Bilgiler"
        description="2025'in en güncel vize başvuru rehberi. Amerika, İngiltere, Schengen, Kanada ve 50+ ülke için vize işlemleri, gerekli belgeler ve başvuru süreçleri hakkında detaylı bilgiler."
        keywords={[
          "vize başvurusu",
          "vize rehberi",
          "schengen vizesi",
          "amerika vizesi",
          "İngiltere vizesi",
          "kanada vizesi",
          "vize belgeleri",
          "seyahat rehberi",
          "vize türleri",
          "vize randevusu",
          "vize ücreti",
          "vize başvuru formu",
          "turistik vize",
          "öğrenci vizesi",
          "iş vizesi",
        ]}
        url="/"
        image="/og-homepage.jpg"
        openGraphType="website"
        twitterCard="summary_large_image"
        websiteData={{
          description:
            "Türkiye'nin en kapsamlı vize başvuru rehberi platformu. 50+ ülke için güncel vize bilgileri, başvuru süreçleri ve uzman tavsiyeleri.",
        }}
        organizationData={{
          name: "Vizepedia",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "iletisim@vizepedia.com",
            availableLanguage: ["Turkish"],
          },
          sameAs: [
            "https://www.facebook.com/vizepedia",
            "https://www.instagram.com/vizepedia",
            "https://twitter.com/vizepedia",
          ],
        }}
      />

      {/* Scroll Progress Indicator */}
      <ScrollIndicator
        ref={scrollIndicatorRef}
        style={{ transform: `translate3d(0, 0, 0) scaleX(${scrollProgress})` }}
      />

      {/* Hero Section - Critical above-the-fold content */}
      <Suspense
        fallback={
          <ComponentSkeleton height="100vh">
            Hero yükleniyor...
          </ComponentSkeleton>
        }
      >
        <HeroParallax />
      </Suspense>

      {/* Premium Section - High priority for user engagement */}
      <PremiumSectionContainer ref={setElementRef(0)}>
        <Suspense
          fallback={
            <ComponentSkeleton>Premium bölüm yükleniyor...</ComponentSkeleton>
          }
        >
          <CustomPremiumSections overrideTitle={true} />
        </Suspense>
      </PremiumSectionContainer>

      {/* Countries Marquee - Below fold, lazy loaded */}
      <FadeInSection
        ref={setElementRef(1)}
        className={visibleSections.has(1) ? "visible" : ""}
      >
        <Suspense
          fallback={
            <ComponentSkeleton>Ülke listesi yükleniyor...</ComponentSkeleton>
          }
        >
          <CountriesMarquee />
        </Suspense>
      </FadeInSection>

      {/* SlideShow Section - Image-heavy, lazy loaded */}
      <FadeInSection
        ref={setElementRef(2)}
        className={visibleSections.has(2) ? "visible" : ""}
      >
        <Suspense
          fallback={<ComponentSkeleton>Galeri yükleniyor...</ComponentSkeleton>}
        >
          <SlideShow />
        </Suspense>
      </FadeInSection>

      {/* Invitation Tool Section - Interactive component */}
      <FadeInSection
        ref={setElementRef(3)}
        className={visibleSections.has(3) ? "visible" : ""}
      >
        <Suspense
          fallback={
            <ComponentSkeleton>Davetiye aracı yükleniyor...</ComponentSkeleton>
          }
        >
          <InvitationToolSection />
        </Suspense>
      </FadeInSection>

      {/* FAQ Section - Important for SEO and user support */}
      <FadeInSection
        ref={setElementRef(4)}
        className={visibleSections.has(4) ? "visible" : ""}
        id="faq-section"
      >
        <Suspense
          fallback={
            <ComponentSkeleton>SSS bölümü yükleniyor...</ComponentSkeleton>
          }
        >
          <FaqSectionComponent overrideTitle={true} />
        </Suspense>
      </FadeInSection>

      {/* Newsletter Section - User engagement and retention */}
      <FadeInSection
        ref={setElementRef(5)}
        className={visibleSections.has(5) ? "visible" : ""}
      >
        <MailerLiteForm />
      </FadeInSection>

      {/* Footer - Always loaded as it contains important links */}
      <Footer />
    </MainContainer>
  );
}

export default memo(MainPage);
