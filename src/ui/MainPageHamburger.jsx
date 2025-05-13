import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import DarkModeToggle from "./DarkModeToggle";
import { getCurrentUser } from "../services/apiAuth";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import supabase from "../services/supabase"; // Supabase import ediyoruz
import ModalSignup from "../ui/ModalSignup"; // Modal bileşenini import ediyoruz
import SignupForm from "../features/authentication/SignupForm"; // Signup formunu import ediyoruz

// Modern ve daha minimalist hamburger ikonu
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

  /* Dark Mode Styles */
  .dark-mode & .line {
    stroke: ${(props) =>
      props.isOpen ? "var(--primary-color, #004466)" : "#ffffff"};
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

// Geliştirilmiş menü konteyner tasarımı - overflow-y: auto eklendi
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
  overflow-y: auto; /* Taşan içeriği kaydırılabilir yap */

  /* Kaydırma çubuğu stili */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 68, 102, 0.2);
    border-radius: 10px;
  }

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

// MenuContents - Düzenlendi, daha kompakt yapı için
const MenuContents = styled.div`
  padding: 26px 24px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;

  .top-section {
    display: flex;
    flex-direction: column;
    gap: 24px; /* 40px'den azaltıldı */
    margin-top: 24px;
  }

  .bottom-section {
    display: flex;
    flex-direction: column;
    gap: 16px; /* 24px'den azaltıldı */
    margin-top: 24px;
    margin-bottom: 16px; /* 24px'den azaltıldı */
  }

  .buttons-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (max-width: 600px) {
    padding: 24px 16px 16px;
  }

  @media (max-height: 700px) {
    .top-section {
      gap: 16px;
      margin-top: 16px;
    }

    .bottom-section {
      gap: 12px;
      margin-top: 16px;
      margin-bottom: 12px;
    }
  }

  @media (max-height: 600px) {
    padding-top: 16px;
    .top-section {
      gap: 12px;
      margin-top: 12px;
    }
  }
`;

// ProfileInfoContainer - daha kompakt tasarım için güncellendi
const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 12px;

  @media (max-height: 830px) {
    margin-top: 8px;
    padding: 8px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;

  @media (max-height: 700px) {
    margin-bottom: 8px;
  }
`;

// Avatar - boyut düzenlemesi
const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.isAnonymous
      ? "var(--color-grey-400)"
      : "var(--color-grey-200, #eee)"};
  color: var(--color-grey-700, #333);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  flex-shrink: 0;

  @media (max-height: 830px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 18px;
  color: var(--color-grey-700, #333);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-height: 700px) {
    font-size: 16px;
  }
`;

const UserEmail = styled.span`
  font-size: 14px;
  color: var(--color-grey-500, #777);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-height: 700px) {
    font-size: 12px;
  }
`;

// NavButton - Daha kompakt
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

  @media (max-height: 700px) {
    padding: 8px 12px;
    font-size: 16px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// PrimaryButton ve SecondaryButton - height düzenlemesi
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
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:hover {
    background: ${(props) =>
      props.disabled
        ? "var(--primary-btn-bg, #004466)"
        : "var(--primary-btn-hover-bg, #87f9cd)"};
    color: ${(props) =>
      props.disabled
        ? "var(--primary-btn-text, #87f9cd)"
        : "var(--primary-btn-hover-text, #004466)"};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled
        ? "var(--primary-btn-shadow, 0 4px 6px rgba(0, 0, 0, 0.1))"
        : "var(--primary-btn-hover-shadow, 0 6px 10px rgba(0, 0, 0, 0.1))"};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(1px)")};
    box-shadow: ${(props) =>
      props.disabled
        ? "var(--primary-btn-shadow, 0 4px 6px rgba(0, 0, 0, 0.1))"
        : "var(--primary-btn-active-shadow, 0 2px 3px rgba(0, 0, 0, 0.1))"};
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-height: 700px) {
    height: 45px;
    font-size: 16px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-height: 600px) {
    height: 40px;
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

  @media (max-height: 700px) {
    height: 45px;
    font-size: 16px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-height: 600px) {
    height: 40px;
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

// ProfileButton - padding düzenlemesi
const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: var(--color-grey-700, #333);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: rgba(0, 68, 102, 0.1);
  }

  svg {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &.logout {
    color: #e53935;

    &:hover {
      background: rgba(229, 57, 53, 0.1);
    }
  }

  &.upgrade {
    color: #00ffa2;

    &:hover {
      background: rgba(0, 255, 162, 0.1);
    }
  }

  @media (max-height: 700px) {
    padding: 8px 12px;
    font-size: 14px;
    margin-bottom: 4px;

    svg {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }
`;

// Yükleniyor göstergesi
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

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

// Divider - Margin düzenlemesi
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
  margin: 16px 0;

  @media (max-height: 700px) {
    margin: 12px 0;
  }

  @media (max-height: 600px) {
    margin: 8px 0;
  }

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
  const { user } = useUser();
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false); // Yükleniyor durumu için state

  // Kullanıcının anonim olup olmadığını kontrol etmek için state
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Modal kontrol fonksiyonu
  const handleCloseMenu = () => {
    setIsOpen(false);
    setMenuOpen(false);
  };

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

      // Kullanıcının anonim olup olmadığını kontrol et
      const anonStatus = localStorage.getItem("isAnonymous") === "true";
      setIsAnonymous(anonStatus);
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

  // Anonim giriş fonksiyonu
  const handleAnonymousSignIn = async () => {
    try {
      // Eğer zaten yükleniyorsa, fonksiyondan çık
      if (isLoading) return;

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

        // Menüyü kapat
        setIsOpen(false);
        setMenuOpen(false);

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

  const handleProfileClick = () => {
    navigate("/account");
    setIsOpen(false);
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    localStorage.removeItem("isAnonymous"); // Logout olunca anonim bilgisini temizle
    localStorage.removeItem("wellcomesAnswered"); // wellcomes bilgisini de temizle
    setIsOpen(false);
    setMenuOpen(false);
  };

  // Kullanıcı bilgileri yardımcı fonksiyonları
  const getInitial = () => {
    if (isAnonymous) return "A"; // Anonim kullanıcılar için "A" harfi

    if (!user) return "";

    const { user_metadata, email } = user;
    const fullName = user_metadata?.full_name;

    return fullName
      ? fullName.charAt(0).toUpperCase()
      : email.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (isAnonymous) return "Anonim Kullanıcı";

    if (!user) return "";

    const { user_metadata, email } = user;
    return user_metadata?.full_name || email;
  };

  const getEmail = () => {
    if (isAnonymous) return "Oturum geçici";

    if (!user) return "";
    return user.email;
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

  const IconSettings = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const IconLogout = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  const IconUpgrade = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00ffa2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 16 12 12 8 16"></polyline>
      <line x1="12" y1="12" x2="12" y2="21"></line>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
      <polyline points="16 16 12 12 8 16"></polyline>
    </svg>
  );

  const IconLoading = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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
                <>
                  <PrimaryButton onClick={handleContinueClick}>
                    <IconContinue /> Devam Et
                  </PrimaryButton>

                  {/* Profil bilgileri bölümü */}
                  <ProfileInfoContainer>
                    <ProfileHeader>
                      <Avatar isAnonymous={isAnonymous}>{getInitial()}</Avatar>
                      <UserDetails>
                        <UserName>{getDisplayName()}</UserName>
                        <UserEmail>{getEmail()}</UserEmail>
                      </UserDetails>
                    </ProfileHeader>

                    {/* Anonim kullanıcı için Hesap Oluştur butonu ve modal */}
                    {isAnonymous ? (
                      <ModalSignup>
                        <ModalSignup.Open opens="hamburgerSignUpForm">
                          <ProfileButton className="upgrade">
                            <IconUpgrade />
                            Hesap Oluştur
                          </ProfileButton>
                        </ModalSignup.Open>
                        <ModalSignup.Window name="hamburgerSignUpForm">
                          <SignupForm onCloseModal={handleCloseMenu} />
                        </ModalSignup.Window>
                      </ModalSignup>
                    ) : (
                      <ProfileButton onClick={handleProfileClick}>
                        <IconSettings />
                        Profil Ayarları
                      </ProfileButton>
                    )}

                    <ProfileButton
                      className="logout"
                      onClick={handleLogoutClick}
                    >
                      <IconLogout />
                      Oturumu Kapat
                    </ProfileButton>
                  </ProfileInfoContainer>
                </>
              ) : (
                // Kullanıcı giriş yapmamışsa "Başlayalım" ve "Oturum Aç" butonlarını gösteriyoruz
                <>
                  <PrimaryButton
                    onClick={handleAnonymousSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner>
                        <IconLoading />
                        Yükleniyor...
                      </LoadingSpinner>
                    ) : (
                      <>
                        <IconRocket /> Başlayalım
                      </>
                    )}
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
