/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/apiAuth";
import { AnonymousDataService } from "../utils/anonymousDataService";

// All your existing styled components remain exactly the same...
const ParallaxContainer = styled.div`
  height: 230vh;
  padding: 6rem 0 3rem 0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  self-auto: auto;
  perspective: 1000px;
  transform-style: preserve-3d;
  @media (max-width: 330px) {
    padding-top: 1rem;
  }
`;

const HeaderContainer = styled.div`
  max-width: 80rem;
  position: relative;
  margin: 0 auto;
  padding: 3rem 1rem;
  width: 100%;
  left: 0;
  top: 150px;
  z-index: 10;

  @media (min-width: 768px) {
    padding: 5rem 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: ${(props) => (props.theme.isDark ? "white" : "black")};
  text-align: center;
  max-width: 100%;
  transition: transform 0.2s ease, opacity 0.2s ease;

  background: linear-gradient(15deg, #004466, #00ffa2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

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

  @media (min-width: 768px) {
    font-size: 6.4rem;
  }
`;

const HeaderDescription = styled.p`
  max-width: 50.4rem;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  hyphens: none;
  font-size: 1.5rem;
  margin-top: 2rem;
  color: var(--color-grey-700);
  text-align: center;
  margin: 2rem auto 0;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const RowContainer = styled(motion.div)`
  display: flex;
  margin-bottom: 2.5rem;
  ${(props) =>
    props.reverse
      ? "flex-direction: row-reverse; space-x-reverse: 1;"
      : "flex-direction: row;"}
  gap: 3rem;
`;

const CountryCardContainer = styled(motion.div)`
  height: 20rem;
  width: 25rem;
  position: relative;
  flex-shrink: 0;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FlagContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
`;

const FlagImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  inset: 0;

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CountryOverlay = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.7);
  pointer-events: none;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  ${CountryCardContainer}:hover & {
    opacity: 1;
  }
`;

const CountryName = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  transition: transform 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  ${CountryCardContainer}:hover & {
    transform: translateY(0);
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  z-index: 11;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const StyledCeper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 283px;
  height: 127px;
  border: 3px solid #00ffa2;
  filter: drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.11));
  border-radius: 82px;
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: scale(0.97);
    border-color: #004466;
    transform: scale(0.8);
  }
`;

const StyledHeroButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 248.6px;
  height: 89px;
  background: #004466;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.11);
  border-radius: 49px;
  font-weight: 700;
  font-size: 24px;
  text-align: center;
  color: #00ffa2;
  transition: all 0.3s ease;

  svg {
    width: 28px;
    height: 28px;
    stroke: currentColor;
    stroke-width: 2;
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: #00ffa2;
    color: #004466;

    svg {
      transform: translateY(-3px);
    }
  }
`;

const LoadingIndicator = styled.div`
  color: #00ffa2;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

// FIXED Header component - Now directs to /dashboard instead of wellcome pages
export const Header = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const currentUser = await getCurrentUser();
        setIsLoggedIn(!!currentUser);
      } catch (error) {
        console.error("Login check error:", error);
      }
    }

    checkLoginStatus();
  }, []);

  const handleButtonClick = async () => {
    if (isLoggedIn) {
      navigate("/dashboard");
      return;
    }

    // For anonymous users, redirect to dashboard immediately
    await handleAnonymousSignIn();
  };

  // FIXED: Direct to dashboard approach
  const handleAnonymousSignIn = async () => {
    try {
      setIsLoading(true);

      
      // Initialize empty user data for anonymous user
      AnonymousDataService.saveUserSelections({});
      
      console.log("Anonymous mode activated (localStorage only)");

      // Always redirect to dashboard
      // Dashboard will handle the three scenarios:
      // 1. Static Dashboard (no onboarding completed)
      // 2. Anonymous Dashboard (onboarding completed, anonymous)
      // 3. Authenticated Dashboard (onboarding completed, authenticated)
      navigate("/dashboard");

      setIsLoading(false);
    } catch (error) {
      console.error("Anonymous mode activation error:", error);
      setIsLoading(false);
    }
  };

  // Icon components remain the same...
  const IconRocket = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
    </svg>
  );

  const IconContinue = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  return (
    <HeaderContainer>
      <HeaderTitle>
        Düşlerinizdeki Seyahatin İlk Adımı <br />
      </HeaderTitle>
      <HeaderDescription>
        Avrupa&apos;dan Amerika&apos;ya tüm vize başvurularınızın süreç yönetimi tek yerde
      </HeaderDescription>
      <ButtonWrapper>
        <StyledCeper>
          <StyledHeroButton onClick={handleButtonClick}>
            {isLoading ? (
              <LoadingIndicator>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="32"
                    strokeDashoffset="8"
                  />
                </svg>
                Yükleniyor...
              </LoadingIndicator>
            ) : (
              <>
                {isLoggedIn ? <IconContinue /> : <IconRocket />}
                {isLoggedIn ? "Devam et" : "Hemen başlayın"}
              </>
            )}
          </StyledHeroButton>
        </StyledCeper>
      </ButtonWrapper>
    </HeaderContainer>
  );
};

// CountryCard and HeroParallax components remain exactly the same...
export const CountryCard = ({ country, translate }) => {
  const flagRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const flagUrl = country.code
    ? `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`
    : null;

  useEffect(() => {
    if (!flagUrl) return;

    const fetchAndStretchSVG = async () => {
      try {
        const response = await fetch(flagUrl);
        const svgText = await response.text();
        const modifiedSvg = svgText.replace(
          "<svg",
          '<svg preserveAspectRatio="none"'
        );

        if (flagRef.current) {
          flagRef.current.innerHTML = modifiedSvg;
          const svgEl = flagRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.width = "100%";
            svgEl.style.height = "100%";
          }
          setLoaded(true);
        }
      } catch (error) {
        console.error("Bayrak yüklenirken hata oluştu:", error);
      }
    };

    fetchAndStretchSVG();
  }, [flagUrl]);

  return (
    <CountryCardContainer
      style={{
        x: translate,
        opacity: loaded ? 1 : 0.3,
      }}
      whileHover={{
        y: -20,
        transition: { duration: 0.3 },
      }}
      key={country.name}
    >
      <FlagContainer>
        <FlagImage ref={flagRef} />
      </FlagContainer>
      <CountryOverlay>
        <CountryName>{country.name}</CountryName>
      </CountryOverlay>
    </CountryCardContainer>
  );
};

export const HeroParallax = ({ countries = [] }) => {
  const defaultCountries = [
    { name: "Amerika Birleşik Devletleri", code: "US" },
    { name: "Birleşik Krallık", code: "GB" },
    { name: "Almanya", code: "DE" },
    { name: "Fransa", code: "FR" },
    { name: "İtalya", code: "IT" },
    { name: "İspanya", code: "ES" },
    { name: "Hollanda", code: "NL" },
    { name: "Belçika", code: "BE" },
    { name: "Lüksemburg", code: "LU" },
    { name: "İsveç", code: "SE" },
    { name: "Finlandiya", code: "FI" },
    { name: "Danimarka", code: "DK" },
    { name: "Avusturya", code: "AT" },
    { name: "Çek Cumhuriyeti", code: "CZ" },
    { name: "Estonya", code: "EE" },
    { name: "Macaristan", code: "HU" },
    { name: "Letonya", code: "LV" },
    { name: "Litvanya", code: "LT" },
    { name: "Malta", code: "MT" },
    { name: "Polonya", code: "PL" },
    { name: "Portekiz", code: "PT" },
    { name: "Slovakya", code: "SK" },
    { name: "Slovenya", code: "SI" },
    { name: "Yunanistan", code: "GR" },
    { name: "İsviçre", code: "CH" },
    { name: "Norveç", code: "NO" },
    { name: "İzlanda", code: "IS" },
    { name: "Lihtenştayn", code: "LI" },
  ];

  const usedCountries = countries.length > 0 ? countries : defaultCountries;
  const firstRow = usedCountries.length ? usedCountries.slice(0, 8) : [];
  const secondRow = usedCountries.length >= 9 ? usedCountries.slice(8, 16) : [];
  const thirdRow = usedCountries.length >= 17 ? usedCountries.slice(16, 28) : [];

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );

  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );

  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 300]),
    springConfig
  );

  return (
    <ParallaxContainer ref={ref}>
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
          paddingTop: "2rem",
        }}
      >
        <RowContainer reverse>
          {firstRow.map((country) => (
            <CountryCard
              country={country}
              translate={translateX}
              key={country.code}
            />
          ))}
        </RowContainer>
        <RowContainer>
          {secondRow.map((country) => (
            <CountryCard
              country={country}
              translate={translateXReverse}
              key={country.code}
            />
          ))}
        </RowContainer>
        <RowContainer reverse>
          {thirdRow.map((country) => (
            <CountryCard
              country={country}
              translate={translateX}
              key={country.code}
            />
          ))}
        </RowContainer>
      </motion.div>
    </ParallaxContainer>
  );
};

export default HeroParallax;