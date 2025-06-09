import styled from "styled-components";
import BlogLogo from "./BlogLogo";
import Logo from "./Logo";
import Heading from "./Heading";
import Button from "./Button";
import DarkModeToggle from "./DarkModeToggle";
import PropTypes from "prop-types";
import MainPageHamburger from "./MainPageHamburger";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, isUserAnonymous } from "../services/apiAuth";
import supabase from "../services/supabase";
import ProfileButton from "./ProfileButton";

// Scroll hide/show özellikli modern header
const StyledMainPageHeader = styled.header`
  position: fixed;
  top: ${(props) =>
    props.isVisible ? "0" : "-120px"}; /* Scroll durumuna göre konum */
  left: 0;
  width: 100%;
  z-index: 9999; /* BlogHeader ile aynı z-index seviyesi */
  transition: all 0.3s ease-in-out; /* Smooth geçiş */
  background: ${(props) =>
    props.scrolled ? "rgba(255, 255, 255, 0.2)" : "transparent"};
  backdrop-filter: ${(props) => (props.scrolled ? "blur(10px)" : "none")};
  -webkit-backdrop-filter: ${(props) =>
    props.scrolled ? "blur(10px)" : "none"};
  box-shadow: ${(props) =>
    props.scrolled ? "0 4px 20px rgba(0, 0, 0, 0.05)" : "none"};
  padding: 20px 0;

  /* Dark Mode Styles */
  .dark-mode & {
    background: ${(props) =>
      props.scrolled ? "rgba(30, 35, 45, 0.2)" : "transparent"};
  }
`;

const HeaderContents = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  @media (max-width: 1310px) {
    width: 90%;
  }

  @media (max-width: 1200px) {
    width: 95%;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0 16px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;

  @media (max-width: 960px) {
    justify-content: space-between;
    flex-flow: row-reverse;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 960px) {
    display: none;
  }
`;

const NavLink = styled(Heading)`
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  position: relative;
  transition: all 0.3s ease;
  opacity: 0.85;

  svg {
    width: 18px;
    height: 18px;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: currentColor;
    transition: width 0.3s ease;
  }

  &:hover {
    opacity: 1;

    &:after {
      width: 100%;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 870px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const DarkModeContainer = styled.div`
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    transform: rotate(5deg);
  }

  @media (max-width: 960px) {
    display: none;
  }
`;

const MobileMenuContainer = styled.div`
  @media (min-width: 960px) {
    display: none;
  }
`;

const ProfileAndButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 870px) {
    gap: 8px;
  }
`;

// ProfileButton için responsive container - sadece büyük ekranlarda gösterilir
const ProfileButtonContainer = styled.div`
  display: flex;

  @media (max-width: 960px) {
    display: none; // Tablet ve mobil boyutlarda gizle
  }
`;

// Yükleniyor göstergesi için özel buton içeriği
const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function MainPageHeader({ setMenuOpen }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Scroll hide/show için yeni state'ler
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // İkonlar için SVG bileşenleri
  const IconUser = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

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

  const IconInfo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );

  const IconHelp = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );

  const IconLoading = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeDasharray="32"
        strokeDashoffset="8"
      />
    </svg>
  );

  // Header yüksekliğini ölçmek için ref ve useEffect
  useEffect(() => {
    const measureHeaderHeight = () => {
      const headerElement = document.querySelector("header");
      if (headerElement) {
        const height = headerElement.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // İlk render ve resize olayında ölçüm yap
    measureHeaderHeight();
    window.addEventListener("resize", measureHeaderHeight);

    return () => {
      window.removeEventListener("resize", measureHeaderHeight);
    };
  }, []);

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

  // Kullanıcı oturum kontrolü
  useEffect(() => {
    async function checkUserStatus() {
      try {
        const currentUser = await getCurrentUser();

        // Kullanıcı giriş yapmış mı?
        const isUserLoggedIn = !!currentUser;
        setIsLoggedIn(isUserLoggedIn);

        if (isUserLoggedIn) {
          // isUserAnonymous fonksiyonunu kullanarak anonim olup olmadığını kontrol et
          const anonymousStatus = await isUserAnonymous();
          setIsAnonymous(anonymousStatus);

          // Debug için
          console.log("Kullanıcı giriş yapmış:", isUserLoggedIn);
          console.log("Anonim kullanıcı mı:", anonymousStatus);
          console.log("Kullanıcı bilgileri:", currentUser);
        } else {
          setIsAnonymous(false);
        }
      } catch (error) {
        console.error("Kullanıcı durumu kontrol edilirken hata oluştu:", error);
        setIsLoggedIn(false);
        setIsAnonymous(false);
      }
    }
    checkUserStatus();
  }, []);

  // Scroll efekti için event listener - GÜNCELLENMIŞ
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scroll background effect için
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide/show logic için
      if (currentScrollY < 50) {
        setIsVisible(true);
      }
      // Scroll down - header'ı gizle (50px threshold)
      else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }
      // Scroll up - header'ı göster
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 16); // ~60fps
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  // Sayfa içi navigasyon - header'ın yüksekliği hesaba katılarak yapılıyor
  const handleFaqClick = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      // FAQ section'ın pozisyonunu al
      const faqPosition = faqSection.getBoundingClientRect().top;
      // Geçerli scroll pozisyonunu al
      const scrollPosition = window.pageYOffset;
      // Header yüksekliği + 70px ek boşluk bırak
      const offsetPosition = faqPosition + scrollPosition - headerHeight - 70;

      // Smooth scroll ile git
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Yönlendirme fonksiyonları
  const handleLogInClick = () => navigate("/login");
  const handleContinueClick = () => navigate("/dashboard");
  const handleAboutClick = () => navigate("/hakkimizda");

  return (
    <StyledMainPageHeader scrolled={scrolled} isVisible={isVisible}>
      <HeaderContents>
        <LogoContainer>
          <Logo variant="mainpage" />
          <NavLinks>
            <NavLink as="h6" onClick={handleAboutClick}>
              <IconInfo />
              Hakkımızda
            </NavLink>
            <NavLink as="h6" onClick={handleFaqClick}>
              <IconHelp />
              SSS
            </NavLink>
          </NavLinks>
          <BlogLogo variant="mainpage2" />
        </LogoContainer>

        <ButtonContainer>
          {isLoggedIn ? (
            <>
              <ProfileAndButtonContainer>
                {/* ProfileButton'u responsive container içine aldık */}
                <ProfileButtonContainer>
                  <ProfileButton isAnonymous={isAnonymous} />
                </ProfileButtonContainer>

                <Button variation="mainpage4" onClick={handleContinueClick}>
                  <IconContinue />
                  Devam Et
                </Button>
              </ProfileAndButtonContainer>
              <MobileMenuContainer>
                <MainPageHamburger setMenuOpen={setMenuOpen} />
              </MobileMenuContainer>
            </>
          ) : (
            <>
              <Button variation="mainpage2" onClick={handleLogInClick}>
                <IconUser />
                Oturum Aç
              </Button>
              <Button
                variation="mainpage"
                onClick={handleAnonymousSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingContent>
                    <IconLoading />
                    Yükleniyor...
                  </LoadingContent>
                ) : (
                  <>
                    <IconRocket />
                    Başlayalım
                  </>
                )}
              </Button>
              <MobileMenuContainer>
                <MainPageHamburger setMenuOpen={setMenuOpen} />
              </MobileMenuContainer>
            </>
          )}
          <DarkModeContainer>
            <DarkModeToggle />
          </DarkModeContainer>
        </ButtonContainer>
      </HeaderContents>
    </StyledMainPageHeader>
  );
}

MainPageHeader.propTypes = {
  setMenuOpen: PropTypes.func.isRequired,
};

export default MainPageHeader;
