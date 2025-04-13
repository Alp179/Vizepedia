/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import { getCurrentUser } from "../services/apiAuth"; // getCurrentUser import edildi

// Styled Components
const HeroContainer = styled.div`
  @media (min-width: 710px) {
    padding-top: 8vh;
  }
  padding-top: 80px;
  height: 100vh;
  padding-bottom: 65px;
  overflow: hidden;
`;

const PositionContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const TitleWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  font-size: 3.5rem; /* Yazıyı büyüt */
  font-weight: bold; /* Daha kalın font */
  color: white; /* Beyaz yap */
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); /* Arkaya gölge ekleyerek belirgin hale getir */
  padding: 20px;
  border-radius: 10px;

  /* Gradient efekti */
  background: linear-gradient(135deg, #004466, #00ffa2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 1000px) {
    top: 45%;
    font-size: 2.8rem; /* Küçük ekranlarda biraz küçült */
  }

  @media (max-width: 600px) {
    font-size: 2rem; /* Mobilde daha okunaklı hale getir */
    padding: 10px;
  }
`;

const Title = styled.h1`
  max-width: 100%;
  font-weight: 600;
  text-align: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 70px;
  @media (max-width: 1410px) {
    font-size: 60px;
  }
  @media (max-width: 1200px) {
    font-size: 55px;
  }
  @media (max-width: 1050px) {
    font-size: 50px;
  }
  @media (max-width: 930px) {
    font-size: 45px;
  }
  @media (max-width: 830px) {
    font-size: 40px;
  }
  @media (max-width: 730px) {
    font-size: 35px;
  }
`;

const ImageWrapper = styled.div`
  width: 1440px;
  height: auto;
  perspective: 1500px; /* Perspektif efekti için */
`;

const HeroImage = styled.img`
  max-width: 1400px;
  width: 200vw;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  margin: 0 auto;
  transition: transform 0.2s ease;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
`;

// Yeniden düzenlenmiş buton stilleri
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

// Yükleniyor durumu için stil ekledik
const LoadingIndicator = styled.div`
  color: #00ffa2;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ContainerScroll = ({ titleComponent, children }) => {
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  // Yükleniyor durumu için state ekledik
  const [isLoading, setIsLoading] = useState(false);
  // Kullanıcının oturum durumunu kontrol etmek için state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kullanıcının oturum durumunu kontrol et
  useEffect(() => {
    async function checkLoginStatus() {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser);
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

  // Anonim giriş fonksiyonunu SignupForm.jsx'den buraya taşıdık
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Title animation: Yukarı hareket ve opaklık azalması
      if (titleRef.current) {
        titleRef.current.style.transform = `translate(-50%, calc(-50% + ${
          scrollY * 0.3
        }px))`;
        titleRef.current.style.opacity = `${1 - scrollY / 300}`;
      }

      // Image animation: Scroll ile düzleşme
      if (imageRef.current) {
        const rotation = Math.max(35 - scrollY * 0.1, 0); // Başlangıçta 20 derece, scroll ile 0 dereceye gelir
        const translateY = Math.min(scrollY * 0.2, 100); // Maksimum yukarı kayma 100px
        imageRef.current.style.transform = `
          perspective(1500px) 
          translateY(${translateY}px) 
          rotateX(${rotation}deg)
        `;
      }
    };

    // Başlangıçta görselin yamuk görünmesini sağlıyoruz
    if (imageRef.current) {
      imageRef.current.style.transform = `
        perspective(1500px) 
        translateY(0px) 
        rotateX(35deg)
      `;
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <PositionContainer>
      <TitleWrapper ref={titleRef}>{titleComponent}</TitleWrapper>
      <ImageWrapper ref={imageRef}>{children}</ImageWrapper>
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
    </PositionContainer>
  );
};

export function HeroScrollDemo() {
  return (
    <HeroContainer>
      <ContainerScroll
        titleComponent={
          <>
            <Title>
              Düşlerinizdeki Seyahatin İlk Adımı <br />
            </Title>
          </>
        }
      >
        <HeroImage
          src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/hero-image.png?t=2024-10-01T13%3A58%3A37.493Z"
          alt="hero"
          draggable={false}
        />
      </ContainerScroll>
    </HeroContainer>
  );
}

export default HeroScrollDemo;
