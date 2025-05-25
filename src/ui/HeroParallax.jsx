/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
// 3. satırdaki import'u şu şekilde değiştirin:
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase"; // Bu import'u kendi projenizin yapısına göre ayarlamanız gerekebilir
import { getCurrentUser } from "../services/apiAuth"; // Bu import'u kendi projenizin yapısına göre ayarlamanız gerekebilir

// Styled Components tanımları
const ParallaxContainer = styled.div`
  height: 230vh; /* 230vh'den 210vh'ye düşürüldü */
  padding: 6rem 0 3rem 0; /* alt padding'i azalttık */
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
  padding: 3rem 1rem; /* 5rem'den 3rem'e düşürüldü */
  width: 100%;
  left: 0;
  top: 150px;
  z-index: 10;

  @media (min-width: 768px) {
    padding: 5rem 1rem; /* 10rem'den 5rem'e düşürüldü */
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2.8rem; /* %20 büyütüldü: 1.5rem * 1.2 = 1.8rem */
  font-weight: 700;
  color: ${(props) => (props.theme.isDark ? "white" : "black")};
  text-align: center;
  max-width: 100%;
  transition: transform 0.2s ease, opacity 0.2s ease;

  /* Gradient efekti */
  background: linear-gradient(15deg, #004466, #00ffa2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 1410px) {
    font-size: 82px; /* %20 büyütüldü: 60px * 1.2 = 72px */
  }
  @media (max-width: 1200px) {
    font-size: 76px; /* %20 büyütüldü: 55px * 1.2 = 66px */
  }
  @media (max-width: 1050px) {
    font-size: 70px; /* %20 büyütüldü: 50px * 1.2 = 60px */
  }
  @media (max-width: 930px) {
    font-size: 64px; /* %20 büyütüldü: 45px * 1.2 = 54px */
  }
  @media (max-width: 830px) {
    font-size: 58px; /* %20 büyütüldü: 40px * 1.2 = 48px */
  }
  @media (max-width: 730px) {
    font-size: 48px; /* %20 büyütüldü: 35px * 1.2 = 42px */
  }
  @media (max-width: 350px) {
    font-size: 38px;
  }

  @media (min-width: 768px) {
    font-size: 6.4rem; /* %20 büyütüldü: 4.5rem * 1.2 = 5.4rem */
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
  margin-bottom: 2.5rem; /* 3rem'den 2.5rem'e düşürüldü - satırlar arası mesafe */
  ${(props) =>
    props.reverse
      ? "flex-direction: row-reverse; space-x-reverse: 1;"
      : "flex-direction: row;"}
  gap: 3rem; /* bayraklar arası mesafe korundu */
`;

const CountryCardContainer = styled(motion.div)`
  height: 20rem; /* 24rem'den 20rem'e düşürüldü */
  width: 25rem; /* 30rem'den 25rem'e düşürüldü */
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

// CTA Buton stilleri
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
  gap: 12px; /* İkon ve metin arasında boşluk */
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

  /* İkon için stil */
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

// Component tanımları
export const Header = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kullanıcının oturum durumunu kontrol et
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

  // Başlayalım butonuna tıklandığında çalışacak fonksiyon
  const handleButtonClick = async () => {
    // Kullanıcı zaten giriş yapmışsa direkt dashboard'a yönlendir
    if (isLoggedIn) {
      navigate("/dashboard");
      return;
    }

    // Giriş yapmamışsa anonim giriş işlemini başlat
    await handleAnonymousSignIn();
  };

  // Anonim giriş fonksiyonu
  const handleAnonymousSignIn = async () => {
    try {
      setIsLoading(true); // Yükleniyor durumunu başlat

      // Supabase anonim oturum açma fonksiyonu
      const { data, error } = await supabase.auth.signInAnonymously();
      localStorage.setItem("isAnonymous", "true"); // LocalStorage'a isAnonymous bilgisi ekliyoruz

      if (error) {
        console.error("Anonim oturum açma hatası:", error.message);
        setIsLoading(false); // Hata durumunda yükleniyor durumunu kapat
        return;
      }

      if (data) {
        // LocalStorage'da wellcomes sorularının cevaplanıp cevaplanmadığını kontrol ediyoruz
        const wellcomesAnswered =
          localStorage.getItem("wellcomesAnswered") || "false"; // Varsayılan olarak 'false'

        if (wellcomesAnswered === "true") {
          // Eğer sorular cevaplanmışsa /dashboard'a yönlendir
          navigate("/dashboard");
        } else {
          // LocalStorage boşsa wellcome-2 (WellcomeA) sayfasına yönlendir
          navigate("/wellcome-2");
        }

        // Yükleniyor durumunu kapat (navigate işlemi gerçekleştiğinde otomatik kapanacak)
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Oturum açma sırasında hata oluştu:", error.message);
      setIsLoading(false); // Hata durumunda yükleniyor durumunu kapat
    }
  };

  // Roket ikonu bileşeni
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

  // Devam et ikonu bileşeni
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
        Schengen Vizesi, Birleşik Krallık Vizesi ve Amerika Vizesi
        başvurularınızı profesyonel ekibimizle kolayca tamamlayın.
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

// Ülke kartı bileşeni
export const CountryCard = ({ country, translate }) => {
  const flagRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const flagUrl = country.code
    ? `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`
    : null;

  useEffect(() => {
    if (!flagUrl) return; // country.code yoksa hiçbir şey yapma

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
        opacity: loaded ? 1 : 0.3, // Bayrak yüklendikçe opaklığı artır
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
  // Eğer countries prop'u gönderilmediyse, Schengen ülkeleri, ABD ve İngiltere'yi içeren default dizi
  const defaultCountries = [
    // Başlangıçta görünecek önemli ülkeler
    { name: "Amerika Birleşik Devletleri", code: "US" },
    { name: "Birleşik Krallık", code: "GB" },
    // Schengen Ülkeleri
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
    { name: "İsviçre", code: "CH" }, // Schengen ama AB üyesi değil
    { name: "Norveç", code: "NO" }, // Schengen ama AB üyesi değil
    { name: "İzlanda", code: "IS" }, // Schengen ama AB üyesi değil
    { name: "Lihtenştayn", code: "LI" }, // Schengen ama AB üyesi değil
  ];

  // Kullanılacak ülkeler dizisi (prop geldiyse onu, yoksa default olanı kullan)
  const usedCountries = countries.length > 0 ? countries : defaultCountries;

  // Default boş array ve güvenli slice işlemleri için kontrol
  const firstRow = usedCountries.length ? usedCountries.slice(0, 8) : [];
  const secondRow = usedCountries.length >= 9 ? usedCountries.slice(8, 16) : [];
  const thirdRow =
    usedCountries.length >= 17 ? usedCountries.slice(16, 28) : [];

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
    useTransform(scrollYProgress, [0, 0.2], [-500, 300]), // -700, 500'den -500, 300'e değiştirildi
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
          paddingTop:
            "2rem" /* Header ve bayraklar arasında daha fazla boşluk */,
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
