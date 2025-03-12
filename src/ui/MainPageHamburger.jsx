import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import DarkModeToggle from "./DarkModeToggle";
import { getCurrentUser } from "../services/apiAuth";

// Modern ve daha minimalist hamburger ikonu
const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  z-index: 3000;
  cursor: pointer;
  background: ${(props) =>
    props.isOpen ? "rgba(0, 68, 102, 0.1)" : "transparent"};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 68, 102, 0.1);
  }

  @media (min-width: 960px) {
    display: none;
  }

  .line {
    fill: none;
    transition: stroke-dasharray 300ms, stroke-dashoffset 300ms, transform 300ms;
    stroke: ${(props) =>
      props.isOpen
        ? "var(--primary-color, #004466)"
        : "var(--text-color, #333)"};
    stroke-width: 5;
    stroke-linecap: round;
  }

  .ham .top {
    stroke-dasharray: 40 160;
  }

  .ham .middle {
    stroke-dasharray: 40 142;
    transform-origin: 50%;
    transition: transform 300ms;
  }

  .ham .bottom {
    stroke-dasharray: 40 85;
    transform-origin: 50%;
    transition: transform 300ms, stroke-dashoffset 300ms;
  }

  .ham.active .top {
    stroke-dashoffset: -64px;
  }

  .ham.active .middle {
    transform: rotate(90deg);
  }

  .ham.active .bottom {
    stroke-dashoffset: -64px;
  }
`;

// Yeni Close Button Bileşeni
const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--close-btn-bg, rgba(0, 0, 0, 0.05));
  color: var(--close-btn-color, #333);
  cursor: pointer;
  z-index: 3001;
  transition: all 0.2s ease;

  &:hover {
    background: var(--close-btn-hover-bg, rgba(0, 0, 0, 0.1));
    transform: rotate(90deg);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Geliştirilmiş menü konteyner tasarımı
const MenuContainer = styled.aside`
  z-index: 2999;
  width: 300px;
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  background: var(--color-grey-1);
  color: var(--menu-text, #333);
  box-shadow: ${({ isOpen }) =>
    isOpen ? "var(--menu-shadow, -5px 0 15px rgba(0, 0, 0, 0.1))" : "none"};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-left: 1px solid var(--menu-border, rgba(0, 68, 102, 0.1));
  visibility: ${({ isOpen, hasTransitionEnded }) =>
    isOpen || !hasTransitionEnded ? "visible" : "hidden"};
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background 0.3s ease;

  @media (min-width: 960px) {
    display: none;
  }

  @media (max-width: 350px) {
    width: 85%;
  }

  /* Dark Mode Styles */
  .dark-mode & {
    --menu-bg: rgba(30, 35, 45, 0.95);
    --menu-text: #e1e1e1;
    --menu-border: rgba(135, 249, 205, 0.1);
    --menu-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
    --close-btn-bg: rgba(255, 255, 255, 0.05);
    --close-btn-color: #e1e1e1;
    --close-btn-hover-bg: rgba(255, 255, 255, 0.1);
  }
`;

const MenuContents = styled.div`
  padding: 32px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .top-section {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-top: 24px;
  }

  .bottom-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 24px;
  }

  .buttons-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`;

const NavButton = styled.button`
  font-size: 18px;
  background: transparent;
  border: none;
  color: var(--nav-text, var(--color-grey-600, #555));
  padding: 12px 16px;
  text-align: left;
  border-radius: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: var(--nav-hover-bg, rgba(0, 68, 102, 0.05));
    color: var(--nav-hover-text, var(--color-grey-900, #222));
  }

  svg {
    width: 20px;
    height: 20px;
  }

  /* Dark Mode Styles */
  .dark-mode & {
    --nav-text: #b3b9c5;
    --nav-hover-bg: rgba(135, 249, 205, 0.1);
    --nav-hover-text: #ffffff;
  }
`;

const PrimaryButton = styled.button`
  background: var(--primary-btn-bg, #004466);
  color: var(--primary-btn-text, #87f9cd);
  border: 2px solid var(--primary-btn-border, #87f9cd);
  width: 100%;
  height: 55px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: var(--primary-btn-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));

  &:hover {
    background: var(--primary-btn-hover-bg, #87f9cd);
    color: var(--primary-btn-hover-text, #004466);
    transform: translateY(-2px);
    box-shadow: var(--primary-btn-hover-shadow, 0 6px 10px rgba(0, 0, 0, 0.1));
  }

  &:active {
    transform: translateY(1px);
    box-shadow: var(--primary-btn-active-shadow, 0 2px 3px rgba(0, 0, 0, 0.1));
  }

  svg {
    width: 20px;
    height: 20px;
  }

  /* Dark Mode Styles */
  .dark-mode & {
    --primary-btn-bg: #004466;
    --primary-btn-text: #87f9cd;
    --primary-btn-border: #87f9cd;
    --primary-btn-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    --primary-btn-hover-bg: #87f9cd;
    --primary-btn-hover-text: #00334d;
    --primary-btn-hover-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryButton = styled.button`
  color: var(--secondary-btn-text, var(--color-grey-800, #333));
  width: 100%;
  height: 55px;
  border-radius: 16px;
  border: 2px solid var(--secondary-btn-border, var(--color-grey-300, #ddd));
  background: var(--secondary-btn-bg, white);
  font-size: 18px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--secondary-btn-hover-bg, #004466);
    color: var(--secondary-btn-hover-text, #87f9cd);
    border-color: var(--secondary-btn-hover-border, #004466);
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  /* Dark Mode Styles */
  .dark-mode & {
    --secondary-btn-text: #e1e1e1;
    --secondary-btn-border: #424752;
    --secondary-btn-bg: #2a303c;
    --secondary-btn-hover-bg: #004466;
    --secondary-btn-hover-text: #87f9cd;
    --secondary-btn-hover-border: #87f9cd;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: var(
    --divider-bg,
    linear-gradient(
      to right,
      rgba(0, 68, 102, 0.05),
      rgba(0, 68, 102, 0.2),
      rgba(0, 68, 102, 0.05)
    )
  );
  margin: 20px 0;

  /* Dark Mode Styles */
  .dark-mode & {
    --divider-bg: linear-gradient(
      to right,
      rgba(135, 249, 205, 0.05),
      rgba(135, 249, 205, 0.15),
      rgba(135, 249, 205, 0.05)
    );
  }
`;

// Hamburger menü bileşeni
const MainPageHamburger = ({ setMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTransitionEnded, setHasTransitionEnded] = useState(true);
  const menuRef = useRef();
  const iconRef = useRef();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    if (!isOpen) {
      setHasTransitionEnded(false);
    }
    setIsOpen(!isOpen);
    setMenuOpen(!isOpen);
  };

  useEffect(() => {
    async function checkUserStatus() {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser);
    }
    checkUserStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setHasTransitionEnded(true);
      }, 400); // Animasyon süresiyle eşleştirildi
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleFaqClick = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      setMenuOpen(false);
    }
  };

  const handleAboutClick = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      setMenuOpen(false);
    }
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
    setIsOpen(false);
    setMenuOpen(false);
  };

  const handleLogInClick = () => {
    navigate("/login");
    setIsOpen(false);
    setMenuOpen(false);
  };

  const handleContinueClick = () => {
    navigate("/dashboard");
    setIsOpen(false);
    setMenuOpen(false);
  };

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

  // Kapatma butonu için ikon
  const IconClose = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
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
    <>
      <MenuIcon ref={iconRef} isOpen={isOpen} onClick={toggleMenu}>
        <svg
          className={`ham ${isOpen ? "active" : ""}`}
          viewBox="0 0 100 100"
          width="42"
        >
          <path
            className="line top"
            d="m 30,33 h 40 c 3.7,0 7.5,3.1 7.5,8.6 0,5.5 -2.7,8.4 -7.5,8.4 h -20"
          />
          <path className="line middle" d="m 30,50 h 40" />
          <path
            className="line bottom"
            d="m 70,67 h -40 c 0,0 -7.5,-0.8 -7.5,-8.4 0,-7.5 7.5,-8.6 7.5,-8.6 h 20"
          />
        </svg>
      </MenuIcon>

      <MenuContainer
        isOpen={isOpen}
        hasTransitionEnded={hasTransitionEnded}
        ref={menuRef}
      >
        {/* Kapatma Butonu */}
        <CloseButton onClick={toggleMenu} aria-label="Menüyü Kapat">
          <IconClose />
        </CloseButton>

        <MenuContents>
          <div className="top-section">
            <Logo variant="mainpageham" />

            <div className="buttons-section">
              {isLoggedIn ? (
                // Kullanıcı giriş yapmışsa "Devam Et" butonu gösteriyoruz
                <PrimaryButton onClick={handleContinueClick}>
                  <IconContinue /> Devam Et
                </PrimaryButton>
              ) : (
                // Kullanıcı giriş yapmamışsa "Başlayalım" ve "Oturum Aç" butonlarını gösteriyoruz
                <>
                  <PrimaryButton onClick={handleSignUpClick}>
                    <IconRocket /> Başlayalım
                  </PrimaryButton>
                  <SecondaryButton onClick={handleLogInClick}>
                    <IconUser /> Oturum Aç
                  </SecondaryButton>
                </>
              )}
            </div>
          </div>

          <div className="bottom-section">
            <BlogLogo style={{ marginTop: "auto" }} variant="mainpage3" />
            <Divider />

            <NavButton onClick={handleAboutClick}>
              <IconInfo /> Hakkımızda
            </NavButton>

            <NavButton onClick={handleFaqClick}>
              <IconHelp /> Sık Sorulan Sorular
            </NavButton>

            <Divider />

            <DarkModeToggle />
          </div>
        </MenuContents>
      </MenuContainer>
    </>
  );
};

MainPageHamburger.propTypes = {
  setMenuOpen: PropTypes.func.isRequired,
};

export default MainPageHamburger;
