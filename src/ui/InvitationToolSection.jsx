const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 162, 0.08),
    rgba(0, 68, 102, 0.05)
  );
  border-radius: 50%;
  backdrop-filter: blur(10px);
`;

/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Styled Components
const SectionContainer = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 8rem 2rem;
  background: ${(props) =>
    props.theme?.isDark
      ? "linear-gradient(135deg, var(--color-grey-900) 0%, var(--color-grey-800) 50%, var(--color-grey-900) 100%)"
      : "linear-gradient(135deg, var(--color-grey-50) 0%, var(--color-grey-100) 50%, var(--color-grey-50) 100%)"};
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 6rem 1rem;
    min-height: 80vh;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const MainTitle = styled(motion.h2)`
  font-size: 6.4rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #004466, #00ffa2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
  letter-spacing: -0.02em;

  @media (max-width: 1410px) {
    font-size: 82px;
  }
  @media (max-width: 1200px) {
    font-size: 76px;
  }
  @media (max-width: 1050px) {
    font-size: 70px;
  }
  @media (max-width: 930px) {
    font-size: 64px;
  }
  @media (max-width: 830px) {
    font-size: 58px;
  }
  @media (max-width: 730px) {
    font-size: 48px;
  }
  @media (max-width: 350px) {
    font-size: 38px;
  }
`;

const SubTitle = styled(motion.p)`
  font-size: 2rem;
  color: ${(props) =>
    props.theme?.isDark ? "var(--color-grey-200)" : "var(--color-grey-700)"};
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  line-height: 1.6;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const ToolShowcase = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const FeaturesList = styled(motion.div)`
  background: ${(props) =>
    props.theme?.isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.8)"};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid
    ${(props) =>
      props.theme?.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #004466, #00ffa2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke: white;
    stroke-width: 2;
  }
`;

const FeatureContent = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #004466;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  p {
    color: ${(props) =>
      props.theme?.isDark ? "var(--color-grey-300)" : "var(--color-grey-600)"};
    line-height: 1.5;
    font-size: 1.1rem;
  }
`;

const MockupContainer = styled(motion.div)`
  position: relative;
  background: linear-gradient(135deg, #004466 0%, #00ffa2 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 25px 50px rgba(0, 70, 102, 0.25);
`;

const MockupFrame = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
`;

const MockupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
`;

const MockupDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.color};
`;

const MockupContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MockupField = styled.div`
  height: 2.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    width: 60%;
    height: 0.75rem;
    background: #e5e7eb;
    border-radius: 4px;
  }
`;

const MockupButton = styled.div`
  height: 3rem;
  background: linear-gradient(135deg, #004466, #00ffa2);
  border-radius: 25px;
  margin-top: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;

  &::after {
    content: "Davetiye Mektubu Oluştur";
  }
`;

const CTASection = styled(motion.div)`
  text-align: center;
`;

const CTAButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 3rem;
  background: linear-gradient(135deg, #004466, #00ffa2);
  color: white;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 8px 25px rgba(0, 70, 102, 0.25);

  svg {
    width: 1.5rem;
    height: 1.5rem;
    stroke: currentColor;
    stroke-width: 2;
    transition: transform 0.2s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(0, 70, 102, 0.35);
  }

  &:hover svg {
    transform: translateX(3px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
  }
`;

// Icons
const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const InvitationToolSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]));
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <DocumentIcon />,
      title: "Profesyonel Davetiye Mektupları",
      description:
        "28 farklı ülke için otomatik olarak oluşturulan, hukuki gerekliliklere uygun davetiye mektupları.",
    },
    {
      icon: <CheckIcon />,
      title: "Hızlı ve Kolay Kullanım",
      description:
        "Sadece birkaç dakikada tüm bilgilerinizi girin ve profesyonel davetiye mektubunuzu alın.",
    },
    {
      icon: <UsersIcon />,
      title: "Kişiselleştirilmiş İçerik",
      description:
        "Aile üyeleriniz, arkadaşlarınız için özel olarak hazırlanmış, kişiselleştirilmiş mektup içeriği.",
    },
    {
      icon: <GlobeIcon />,
      title: "Çoklu Ülke Desteği",
      description:
        "Schengen bölgesi, İngiltere, ABD ve daha birçok ülke için uygun format ve içerik.",
    },
  ];

  const handleCTAClick = () => {
    // Sayfanın en üstüne scroll yap
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Kısa bir delay sonra navigate et (smooth scroll için)
    setTimeout(() => {
      navigate("/davetiye-olustur");
    }, 100);
  };

  return (
    <SectionContainer ref={sectionRef}>
      <BackgroundElements>
        <FloatingElement
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            right: "-150px",
            y: y1,
          }}
          animate={{
            y: [0, -20, -35, -15, 5, 15, -5, 0],
            x: [0, 8, -5, 12, -8, 3, -2, 0],
            scale: [1, 1.05, 0.95, 1.08, 0.92, 1.03, 0.98, 1],
            borderRadius: [
              "50%",
              "47% 53% 58% 42%",
              "42% 58% 45% 55%",
              "55% 45% 52% 48%",
              "48% 52% 60% 40%",
              "52% 48% 43% 57%",
              "49% 51% 54% 46%",
              "50%",
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for organic feel
            times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
          }}
        />
        <FloatingElement
          style={{
            width: "200px",
            height: "200px",
            bottom: "20%",
            left: "-100px",
            y: y2,
          }}
          animate={{
            y: [0, 12, 25, 8, -10, -18, -5, 0],
            x: [0, -6, 4, -9, 7, -3, 2, 0],
            scale: [1, 0.88, 1.12, 0.94, 1.06, 0.91, 1.02, 1],
            borderRadius: [
              "50%",
              "58% 42% 53% 47%",
              "43% 57% 48% 52%",
              "51% 49% 59% 41%",
              "46% 54% 44% 56%",
              "54% 46% 51% 49%",
              "48% 52% 55% 45%",
              "50%",
            ],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: [0.23, 0.42, 0.58, 0.94], // Slightly different curve
            times: [0, 0.12, 0.28, 0.42, 0.58, 0.74, 0.88, 1],
            delay: 3,
          }}
        />
      </BackgroundElements>

      <ContentWrapper>
        <MainTitle
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Davetiye Mektubu Oluşturucu
        </MainTitle>

        <SubTitle
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          Vize başvurunuz için gerekli davetiye mektuplarını saniyeler içinde
          oluşturun. Profesyonel, hukuki gerekliliklere uygun ve tamamen
          ücretsiz.
        </SubTitle>

        <ToolShowcase>
          <FeaturesList
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureContent>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </FeatureContent>
              </FeatureItem>
            ))}
          </FeaturesList>

          <MockupContainer
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <MockupFrame>
              <MockupHeader>
                <MockupDot color="#ff5f56" />
                <MockupDot color="#ffbd2e" />
                <MockupDot color="#27ca3f" />
              </MockupHeader>
              <MockupContent>
                <MockupField />
                <MockupField />
                <MockupField />
                <MockupField />
                <MockupField />
                <MockupField />
              </MockupContent>
              <MockupButton />
            </MockupFrame>
          </MockupContainer>
        </ToolShowcase>

        <CTASection
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <CTAButton onClick={handleCTAClick} whileTap={{ scale: 0.98 }}>
            Hemen Başlayın
            <ArrowRightIcon />
          </CTAButton>
        </CTASection>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default InvitationToolSection;
