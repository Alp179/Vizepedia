/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useMemo } from "react";
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

// OPTIMIZED: Changed to img for better performance
const FlagImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
`;

// OPTIMIZED: Added skeleton loader
const FlagSkeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
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

// OPTIMIZED Header component - Memoized for better performance
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
    await handleAnonymousSignIn();
  };

  const handleAnonymousSignIn = async () => {
    try {
      setIsLoading(true);
      AnonymousDataService.saveUserSelections({});
      console.log("Anonymous mode activated (localStorage only)");
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.error("Anonymous mode activation error:", error);
      setIsLoading(false);
    }
  };

  // Memoized icons to prevent re-renders
  const IconRocket = useMemo(
    () => (
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
    ),
    []
  );

  const IconContinue = useMemo(
    () => (
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
    ),
    []
  );

  return (
    <HeaderContainer>
      {/* SEO-optimized H1 with semantic structure */}
      <HeaderTitle>Düşlerinizdeki Seyahatin İlk Adımı</HeaderTitle>

      {/* SEO-optimized description with keywords */}
      <HeaderDescription>
        Avrupa&apos;dan Amerika&apos;ya tüm vize başvurularınızın süreç yönetimi
        tek yerde
      </HeaderDescription>

      {/* Internal links for SEO */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/ready-documents/schengen-vizesi"
          style={{
            color: "#00ffa2",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Schengen Vizesi
        </a>
        <a
          href="/ready-documents/amerika-vizesi"
          style={{
            color: "#00ffa2",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Amerika Vizesi
        </a>
        <a
          href="/ready-documents/ingiltere-vizesi"
          style={{
            color: "#00ffa2",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          İngiltere Vizesi
        </a>
        <a
          href="/blog"
          style={{
            color: "#00ffa2",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Vize Rehberi
        </a>
      </div>

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
                {isLoggedIn ? IconContinue : IconRocket}
                {isLoggedIn ? "Devam et" : "Hemen başlayın"}
              </>
            )}
          </StyledHeroButton>
        </StyledCeper>
      </ButtonWrapper>
    </HeaderContainer>
  );
};

// OPTIMIZED CountryCard - Progressive enhancement approach
export const CountryCard = ({ country, translate }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const flagRef = useRef(null);

  // Try multiple flag sources for reliability
  const flagSources = useMemo(() => {
    // Check if country and country.code exist
    if (!country || !country.code) return null;

    const code = country.code;
    if (typeof code !== "string") return null;

    return {
      // High-quality raster option
      png: `https://flagcdn.com/w320/${code.toLowerCase()}.png`,
      // Fallback to your original SVG source
      svg: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`,
      // Alternative SVG source
      svgAlt: `https://flagcdn.com/${code.toLowerCase()}.svg`,
    };
  }, [country]);

  // Try to load PNG first (fastest)
  const handleImageLoad = () => {
    setLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    // Fallback to SVG if PNG fails
    loadSVGFallback();
  };

  // Fallback SVG loading (your original method but optimized)
  const loadSVGFallback = async () => {
    if (!flagSources?.svg || !flagRef.current) return;

    try {
      const response = await fetch(flagSources.svg);
      if (!response.ok) throw new Error("SVG fetch failed");

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
        setSvgLoaded(true);
      }
    } catch (error) {
      console.error("SVG fallback failed:", error);
    }
  };

  return (
    <CountryCardContainer
      style={{
        x: translate,
        opacity: 1, // Always show container
      }}
      whileHover={{
        y: -20,
        transition: { duration: 0.3 },
      }}
      key={country?.name || "unknown"}
    >
      <FlagContainer>
        {/* Show skeleton while loading */}
        {!loaded && !svgLoaded && <FlagSkeleton />}

        {/* Try PNG first */}
        {flagSources && !imageError && (
          <FlagImage
            src={flagSources.png}
            alt={`${country?.name || "Ülke"} bayrağı`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              opacity: loaded ? 1 : 0,
            }}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* SVG fallback container */}
        <div
          ref={flagRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: svgLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Final fallback */}
        {imageError && !svgLoaded && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, 
              ${
                (country?.name?.length || 0) % 2 === 0
                  ? "#4A90E2, #7B68EE"
                  : "#50C878, #32CD32"
              })`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "600",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            {country?.name || "Ülke"}
          </div>
        )}
      </FlagContainer>
      <CountryOverlay>
        <CountryName>{country?.name || "Ülke"}</CountryName>
      </CountryOverlay>
    </CountryCardContainer>
  );
};

// OPTIMIZED: Memoized country data to prevent re-computations
const DEFAULT_COUNTRIES = [
  {
    name: "Amerika Birleşik Devletleri",
    code: "US",
    keywords: ["amerika vizesi", "ABD vizesi", "amerika turist vizesi"],
  },
  {
    name: "Birleşik Krallık",
    code: "GB",
    keywords: ["ingiltere vizesi", "İngiltere turist vizesi", "UK vizesi"],
  },
  {
    name: "Almanya",
    code: "DE",
    keywords: [
      "almanya vizesi",
      "Almanya turist vizesi",
      "Almanya Schengen vizesi",
    ],
  },
  {
    name: "Fransa",
    code: "FR",
    keywords: [
      "fransa vizesi",
      "Fransa turist vizesi",
      "Fransa Schengen vizesi",
    ],
  },
  {
    name: "İtalya",
    code: "IT",
    keywords: [
      "italya vizesi",
      "İtalya turist vizesi",
      "İtalya Schengen vizesi",
    ],
  },
  {
    name: "İspanya",
    code: "ES",
    keywords: [
      "ispanya vizesi",
      "İspanya turist vizesi",
      "İspanya Schengen vizesi",
    ],
  },
  {
    name: "Hollanda",
    code: "NL",
    keywords: [
      "hollanda vizesi",
      "Hollanda turist vizesi",
      "Hollanda Schengen vizesi",
    ],
  },
  {
    name: "Belçika",
    code: "BE",
    keywords: [
      "belçika vizesi",
      "Belçika turist vizesi",
      "Belçika Schengen vizesi",
    ],
  },
  {
    name: "Lüksemburg",
    code: "LU",
    keywords: [
      "lüksemburg vizesi",
      "Lüksemburg turist vizesi",
      "Lüksemburg Schengen vizesi",
    ],
  },
  {
    name: "İsveç",
    code: "SE",
    keywords: ["isveç vizesi", "İsveç turist vizesi", "İsveç Schengen vizesi"],
  },
  {
    name: "Finlandiya",
    code: "FI",
    keywords: [
      "finlandiya vizesi",
      "Finlandiya turist vizesi",
      "Finlandiya Schengen vizesi",
    ],
  },
  {
    name: "Danimarka",
    code: "DK",
    keywords: [
      "danimarka vizesi",
      "Danimarka turist vizesi",
      "Danimarka Schengen vizesi",
    ],
  },
  {
    name: "Avusturya",
    code: "AT",
    keywords: [
      "avusturya vizesi",
      "Avusturya turist vizesi",
      "Avusturya Schengen vizesi",
    ],
  },
  {
    name: "Çek Cumhuriyeti",
    code: "CZ",
    keywords: [
      "çek cumhuriyeti vizesi",
      "Çekya turist vizesi",
      "Çekya Schengen vizesi",
    ],
  },
  {
    name: "Estonya",
    code: "EE",
    keywords: [
      "estonya vizesi",
      "Estonya turist vizesi",
      "Estonya Schengen vizesi",
    ],
  },
  {
    name: "Macaristan",
    code: "HU",
    keywords: [
      "macaristan vizesi",
      "Macaristan turist vizesi",
      "Macaristan Schengen vizesi",
    ],
  },
  {
    name: "Letonya",
    code: "LV",
    keywords: [
      "letonya vizesi",
      "Letonya turist vizesi",
      "Letonya Schengen vizesi",
    ],
  },
  {
    name: "Litvanya",
    code: "LT",
    keywords: [
      "litvanya vizesi",
      "Litvanya turist vizesi",
      "Litvanya Schengen vizesi",
    ],
  },
  {
    name: "Malta",
    code: "MT",
    keywords: ["malta vizesi", "Malta turist vizesi", "Malta Schengen vizesi"],
  },
  {
    name: "Polonya",
    code: "PL",
    keywords: [
      "polonya vizesi",
      "Polonya turist vizesi",
      "Polonya Schengen vizesi",
    ],
  },
  {
    name: "Portekiz",
    code: "PT",
    keywords: [
      "portekiz vizesi",
      "Portekiz turist vizesi",
      "Portekiz Schengen vizesi",
    ],
  },
  {
    name: "Slovakya",
    code: "SK",
    keywords: [
      "slovakya vizesi",
      "Slovakya turist vizesi",
      "Slovakya Schengen vizesi",
    ],
  },
  {
    name: "Slovenya",
    code: "SI",
    keywords: [
      "slovenya vizesi",
      "Slovenya turist vizesi",
      "Slovenya Schengen vizesi",
    ],
  },
  {
    name: "Yunanistan",
    code: "GR",
    keywords: [
      "yunanistan vizesi",
      "Yunanistan turist vizesi",
      "Yunanistan Schengen vizesi",
    ],
  },
  {
    name: "İsviçre",
    code: "CH",
    keywords: [
      "isviçre vizesi",
      "İsviçre turist vizesi",
      "İsviçre Schengen vizesi",
    ],
  },
  {
    name: "Norveç",
    code: "NO",
    keywords: [
      "norveç vizesi",
      "Norveç turist vizesi",
      "Norveç Schengen vizesi",
    ],
  },
  {
    name: "İzlanda",
    code: "IS",
    keywords: [
      "izlanda vizesi",
      "İzlanda turist vizesi",
      "İzlanda Schengen vizesi",
    ],
  },
  {
    name: "Lihtenştayn",
    code: "LI",
    keywords: [
      "lihtenştayn vizesi",
      "Lihtenştayn turist vizesi",
      "Lihtenştayn Schengen vizesi",
    ],
  },
];

export const HeroParallax = ({ countries = [] }) => {
  const usedCountries = countries.length > 0 ? countries : DEFAULT_COUNTRIES;

  // OPTIMIZED: Memoize country rows to prevent re-computation on scroll
  const [firstRow, secondRow, thirdRow] = useMemo(
    () => [
      usedCountries.slice(0, 8),
      usedCountries.slice(8, 16),
      usedCountries.slice(16, 28),
    ],
    [usedCountries]
  );

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // OPTIMIZED: Slightly less aggressive spring config for better performance
  const springConfig = useMemo(
    () => ({
      stiffness: 200, // Reduced from 300
      damping: 25, // Reduced from 30
      bounce: 0, // Removed bounce for smoother performance
    }),
    []
  );

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
              key={country?.code || country?.name || "unknown"}
            />
          ))}
        </RowContainer>
        <RowContainer>
          {secondRow.map((country) => (
            <CountryCard
              country={country}
              translate={translateXReverse}
              key={country?.code || country?.name || "unknown"}
            />
          ))}
        </RowContainer>
        <RowContainer reverse>
          {thirdRow.map((country) => (
            <CountryCard
              country={country}
              translate={translateX}
              key={country?.code || country?.name || "unknown"}
            />
          ))}
        </RowContainer>
      </motion.div>
    </ParallaxContainer>
  );
};

export default HeroParallax;
