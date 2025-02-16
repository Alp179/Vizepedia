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
import { getCurrentUser } from "../services/apiAuth"; // Oturum açma durumunu kontrol eden fonksiyon

const StyledMainPageHeader = styled.div`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 20px;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const HeaderContents = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: 52px;
  justify-content: space-around;
  align-items: center;
  @media (max-width: 1310px) {
    width: 90%;
  }
  @media (max-width: 1200px) {
    gap: 32px;
    width: 95%;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
  @media (max-width: 360px) {
    gap: 16px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  @media (max-width: 870px) {
    justify-content: space-between;
    flex-flow: row-reverse;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-left: auto;
  @media (max-width: 870px) {
    gap: 4px;
  }
`;

function MainPageHeader({ setMenuOpen }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kullanıcının oturum açıp açmadığını kontrol et
    async function checkUserStatus() {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser); // Kullanıcı varsa true, yoksa false
    }
    checkUserStatus();
  }, []);

  const handleFaqClick = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignUpClick = () => {
    navigate("/sign-up"); // /sign-up yoluna yönlendir
  };

  const handleLogInClick = () => {
    navigate("/login"); // /login yoluna yönlendir
  };

  const handleContinueClick = () => {
    navigate("/dashboard"); // /dashboard yoluna yönlendir
  };

  return (
    <StyledMainPageHeader>
      <HeaderContents>
        <LogoContainer>
          <Logo variant="mainpage" />
          <Heading className="header-link1" as="h10">
            Hakkımızda
          </Heading>
          <Heading className="header-link1" as="h10" onClick={handleFaqClick}>
            SSS
          </Heading>
          <BlogLogo variant="mainpage2" />
        </LogoContainer>
        <ButtonContainer>
          {isLoggedIn ? (
            <>
              <Button variation="mainpage4" onClick={handleContinueClick}>
                Devam Et
              </Button>
            </>
          ) : (
            <>
              <Button variation="mainpage2" onClick={handleLogInClick}>
                Oturum Aç
              </Button>
              <Button variation="mainpage" onClick={handleSignUpClick}>
                Başlayalım
              </Button>
              <MainPageHamburger setMenuOpen={setMenuOpen} />
            </>
          )}
          <DarkModeToggle />
        </ButtonContainer>
      </HeaderContents>
    </StyledMainPageHeader>
  );
}

MainPageHeader.propTypes = {
  setMenuOpen: PropTypes.func.isRequired, // setMenuOpen'ın fonksiyon olduğunu belirtin
};

export default MainPageHeader;
