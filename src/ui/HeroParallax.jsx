/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase"; // Bu import'u kendi projenizin yapısına göre ayarlamanız gerekebilir
import { getCurrentUser } from "../services/apiAuth"; // Bu import'u kendi projenizin yapısına göre ayarlamanız gerekebilir

// Styled Components tanımları
const ParallaxContainer = styled.div`
  height: 300vh;
  padding: 10rem 0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  self-auto: auto;
  perspective: 1000px;
  transform-style: preserve-3d;
`;

const HeaderContainer = styled.div`
  max-width: 80rem;
  position: relative;
  margin: 0 auto;
  padding: 5rem 1rem;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 10;

  @media (min-width: 768px) {
    padding: 10rem 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.8rem; /* %20 büyütüldü: 1.5rem * 1.2 = 1.8rem */
  font-weight: 600;
  color: ${props => props.theme.isDark ? "white" : "black"};
  text-align: center;
  max-width: 100%;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 84px; /* %20 büyütüldü: 70px * 1.2 = 84px */
  
  /* Gradient efekti */
  background: linear-gradient(135deg, #004466, #00ffa2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 1410px) {
    font-size: 72px; /* %20 büyütüldü: 60px * 1.2 = 72px */
  }
  @media (max-width: 1200px) {
    font-size: 66px; /* %20 büyütüldü: 55px * 1.2 = 66px */
  }
  @media (max-width: 1050px) {
    font-size: 60px; /* %20 büyütüldü: 50px * 1.2 = 60px */
  }
  @media (max-width: 930px) {
    font-size: 54px; /* %20 büyütüldü: 45px * 1.2 = 54px */
  }
  @media (max-width: 830px) {
    font-size: 48px; /* %20 büyütüldü: 40px * 1.2 = 48px */
  }
  @media (max-width: 730px) {
    font-size: 42px; /* %20 büyütüldü: 35px * 1.2 = 42px */
  }
  
  @media (min-width: 768px) {
    font-size: 5.4rem; /* %20 büyütüldü: 4.5rem * 1.2 = 5.4rem */
  }
`;

const HeaderDescription = styled.p`
  max-width: 50.4rem; /* %20 büyütüldü: 42rem * 1.2 = 50.4rem */
  font-size: 1.2rem; /* %20 büyütüldü: 1rem * 1.2 = 1.2rem */
  margin-top: 2rem;
  color: ${props => props.theme.isDark ? "rgba(229, 229, 229)" : "rgba(23, 23, 23)"};
  text-align: center;
  margin: 2rem auto 0;

  @media (min-width: 768px) {
    font-size: 1.5rem; /* %20 büyütüldü: 1.25rem * 1.2 = 1.5rem */
  }
`;

const RowContainer = styled(motion.div)`
  display: flex;
  margin-bottom: 5rem;
  ${props => props.reverse ? "flex-direction: row-reverse; space-x-reverse: 1;" : "flex-direction: row;"}
  gap: 5rem;
`;

const ProductCardContainer = styled(motion.div)`
  height: 24rem;
  width: 30rem;
  position: relative;
  flex-shrink: 0;
`;

const ProductLink = styled.a`
  display: block;
  &:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
`;

const ProductImage = styled.img`
  object-fit: cover;
  object-position: left top;
  position: absolute;
  height: 100%;
  width: 100%;
  inset: 0;
`;

const ProductOverlay = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: black;
  pointer-events: none;
  transition: opacity 0.3s ease;

  ${ProductCardContainer}:hover & {
    opacity: 0.8;
  }
`;

const ProductTitle = styled.h2`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  opacity: 0;
  color: white;
  transition: opacity 0.3s ease;

  ${ProductCardContainer}:hover & {
    opacity: 1;
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
        We build beautiful products with the latest technologies and frameworks.
        We are a team of passionate developers and designers that love to build
        amazing products.
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

export const ProductCard = ({ product, translate }) => {
  return (
    <ProductCardContainer
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
    >
      <ProductLink href={product.link}>
        <ProductImage
          src={product.thumbnail}
          height="600"
          width="600"
          alt={product.title}
        />
      </ProductLink>
      <ProductOverlay />
      <ProductTitle>{product.title}</ProductTitle>
    </ProductCardContainer>
  );
};

export const HeroParallax = ({ products = [] }) => {
  // Default boş array ve güvenli slice işlemleri için kontrol
  const firstRow = products.length ? products.slice(0, 5) : [];
  const secondRow = products.length >= 6 ? products.slice(5, 10) : [];
  const thirdRow = products.length >= 11 ? products.slice(10, 15) : [];
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
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]), 
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
        }}
      >
        <RowContainer reverse>
          {firstRow.map((product) => (
            <ProductCard 
              product={product} 
              translate={translateX} 
              key={product.title} 
            />
          ))}
        </RowContainer>
        <RowContainer>
          {secondRow.map((product) => (
            <ProductCard 
              product={product} 
              translate={translateXReverse} 
              key={product.title} 
            />
          ))}
        </RowContainer>
        <RowContainer reverse>
          {thirdRow.map((product) => (
            <ProductCard 
              product={product} 
              translate={translateX} 
              key={product.title} 
            />
          ))}
        </RowContainer>
      </motion.div>
    </ParallaxContainer>
  );
};

export default HeroParallax;