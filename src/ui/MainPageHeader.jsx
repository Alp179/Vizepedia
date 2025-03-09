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
import { getCurrentUser } from "../services/apiAuth";

// Yeni modern, geçiş animasyonlu header
const StyledMainPageHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3000;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: none;
  padding: 20px 0;
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

  @media (max-width: 870px) {
    justify-content: space-between;
    flex-flow: row-reverse;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 870px) {
    display: none;
  }
`;

const NavLink = styled(Heading)`
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  opacity: 0.85;

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

const ActionButton = styled(Button)`
  transition: all 0.3s ease;
  transform: translateY(0);

  &:hover {
    transform: translateY(-2px);
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

  @media (max-width: 870px) {
    display: none;
  }
`;

const MobileMenuContainer = styled.div`
  @media (min-width: 871px) {
    display: none;
  }
`;

function MainPageHeader({ setMenuOpen }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Kullanıcı oturum kontrolü
  useEffect(() => {
    async function checkUserStatus() {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser);
    }
    checkUserStatus();
  }, []);

  // Scroll efekti için event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sayfa içi navigasyon
  const handleFaqClick = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Yönlendirme fonksiyonları
  const handleSignUpClick = () => navigate("/sign-up");
  const handleLogInClick = () => navigate("/login");
  const handleContinueClick = () => navigate("/dashboard");
  const handleAboutClick = () => navigate("/about");

  return (
    <StyledMainPageHeader scrolled={scrolled}>
      <HeaderContents>
        <LogoContainer>
          <Logo variant="mainpage" />

          <NavLinks>
            <NavLink as="h6" onClick={handleAboutClick}>
              Hakkımızda
            </NavLink>
            <NavLink as="h6" onClick={handleFaqClick}>
              SSS
            </NavLink>
            <BlogLogo variant="mainpage2" />
          </NavLinks>
        </LogoContainer>

        <ButtonContainer>
          {isLoggedIn ? (
            <>
              <ActionButton variation="mainpage4" onClick={handleContinueClick}>
                Devam Et
              </ActionButton>
              <MobileMenuContainer>
                <MainPageHamburger setMenuOpen={setMenuOpen} />
              </MobileMenuContainer>
            </>
          ) : (
            <>
              <ActionButton variation="mainpage2" onClick={handleLogInClick}>
                Oturum Aç
              </ActionButton>
              <ActionButton variation="mainpage" onClick={handleSignUpClick}>
                Başlayalım
              </ActionButton>
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
