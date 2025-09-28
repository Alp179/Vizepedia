import {
  useState,
  useEffect,
  useRef,
  memo,
  useMemo,
  lazy,
  Suspense,
} from "react";
import styled from "styled-components";
import Footer from "../ui/Footer";
import MailerLiteForm from "../ui/MailerLiteForm";
import { useLocation } from "react-router-dom";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";

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
  contain: layout; /* CSS containment for better performance */
`;

const PremiumSectionContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 100px;
  contain: layout style; /* CSS containment */

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
    will-change: auto; /* Reset will-change after animation */
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
  transform: translate3d(0, 0, 0) scaleX(0); /* GPU acceleration */
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

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return progress;
};

// FIXED: Intersection observer hook with correct visibility logic
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
              // Element is visible - ADD it to visible set
              updates.add(index);
            } else {
              // Element is not visible - REMOVE it from visible set
              // BUT keep it visible once it's been shown (for fade-in animations)
              // Don't remove it unless you want it to fade out when scrolling away
              if (!options.keepVisible) {
                updates.delete(index);
              }
            }
          });

          return updates;
        });
      },
      {
        rootMargin: "50px", // Start animation 50px before entering viewport
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
    unobserveOnIntersect: true, // One-time animations
  });
  const scrollIndicatorRef = useRef(null);
  const location = useLocation();

  // Memoized SEO data to prevent unnecessary re-renders (REMOVED faqData)
  const seoData = useMemo(
    () => ({
      title: "Vizepedia – Türkiye'nin Vize Başvuru Rehberi",
      description:
        "Vizepedia, vize başvurularında gereken belgeleri ve seyahat ipuçlarını adım adım anlatan kapsamlı bir rehberdir. Schengen, Amerika, İngiltere ve diğer ülkeler için vize başvuru süreçleri.",
      keywords: [
        "vize",
        "vize başvurusu",
        "vize rehberi",
        "seyahat rehberi",
        "belgeler",
        "Vizepedia",
        "Schengen vizesi",
        "Amerika vizesi",
        "İngiltere vizesi",
        "vize türleri",
        "vize başvuru formu",
        "vize randevu",
        "vize harç ücreti",
        "vize gerekli belgeler",
        "vize süresi",
        "vize başvuru takibi",
      ],
      url: "https://www.vizepedia.com/",
      image: "https://www.vizepedia.com/og-image.jpg",
    }),
    []
  );

  // Structured data for the main page (REMOVED FAQ structured data)
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Vizepedia",
      url: "https://www.vizepedia.com",
      description: "Türkiye'nin Vize Başvuru Rehberi",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.vizepedia.com/ara?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: "Vizepedia",
        url: "https://www.vizepedia.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.vizepedia.com/logo.png",
          width: 512,
          height: 512,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+90-XXX-XXX-XXXX",
          contactType: "customer service",
        },
        sameAs: [
          "https://facebook.com/vizepedia",
          "https://instagram.com/vizepediacom",
        ],
      },
    }),
    []
  );

  // Breadcrumb structured data
  const breadcrumbData = useMemo(
    () => [
      {
        name: "Ana Sayfa",
        url: "https://www.vizepedia.com/",
      },
    ],
    []
  );

  // REMOVED: FAQ structured data for main page - let FaqSectionComponent handle it

  // Optimized scroll indicator update
  useEffect(() => {
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.transform = `translate3d(0, 0, 0) scaleX(${scrollProgress})`;
    }
  }, [scrollProgress]);

  // Optimized FAQ section scrolling with better performance
  useEffect(() => {
    if (location.hash === "#faq-section") {
      // Use setTimeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const faqSection = document.getElementById("faq-section");
        if (faqSection) {
          const headerElement = document.querySelector("header");
          const headerHeight = headerElement ? headerElement.offsetHeight : 0;
          const elementTop =
            faqSection.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementTop - headerHeight - 70;

          // Smooth scroll with proper timing
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 150); // Slightly longer delay to ensure all components are mounted

      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <MainContainer>
      {/* SEO Component with comprehensive structured data (REMOVED faqData prop) */}
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={seoData.url}
        image={seoData.image}
        websiteData={structuredData}
        breadcrumbs={breadcrumbData}
        openGraphType="website"
        twitterCard="summary_large_image"
      />

      {/* Structured Data as JSON-LD */}
      <JsonLd data={structuredData} />

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
          {/* FIXED: Added overrideTitle prop to prevent child component from changing the page title */}
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
      {/* This component will handle its own FAQ structured data */}
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
          {/* FIXED: Added overrideTitle prop to prevent child component from changing the page title */}
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

// Memoize the component to prevent unnecessary re-renders
export default memo(MainPage);