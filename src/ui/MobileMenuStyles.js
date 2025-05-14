// MobileMenuStyles.js
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { fadeIn, modalFadeIn, modalFadeOut } from "./MobileMenuIcons";

// Hamburger menü ikonu
export const MenuIcon = styled.div`
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
  position: fixed;
  top: 20px;
  right: 12px;
  display: ${(props) => (props.isDocsModalOpen ? "none" : "flex")};

  &:hover {
    background: rgba(0, 68, 102, 0.1);
  }

  @media (min-width: 710px) {
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

  .ham.active {
    transform: rotate(45deg);
  }

  
`;

// Ana menü konteyner
export const MenuContainer = styled.aside`
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
  overflow-y: auto;

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

  @media (min-width: 710px) {
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

// Kapatma butonu
export const CloseButton = styled.button`
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

// MenuContents
export const MenuContents = styled.div`
  padding: 26px 24px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;

  .top-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 24px;
  }

  .user-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;
  }

  .applications-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
    max-height: 40vh;
    overflow-y: auto;

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
  }

  .bottom-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: auto;
    margin-bottom: 16px;
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
      margin-bottom: 12px;
    }
  }
`;

// ProfileInfoContainer
export const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
 

  @media (max-height: 830px) {
    margin-top: 8px;
    padding: 8px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;

  @media (max-height: 700px) {
    margin-bottom: 8px;
  }
`;

// Avatar
export const Avatar = styled.div`
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

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const UserName = styled.span`
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

export const UserEmail = styled.span`
  font-size: 14px;
  color: var(--color-grey-500, #777);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-height: 700px) {
    font-size: 12px;
  }
`;

// Anonim Gösterge
export const AnonymousBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--anon-badge-bg, rgba(0, 68, 102, 0.1));
  padding: 8px 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  color: var(--anon-badge-text, var(--color-grey-600));
  font-size: 14px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

// NavButton - Navigasyon bağlantıları için
export const NavButton = styled.button`
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
  width: 100%;

  &:hover {
    background: var(--nav-hover-bg, rgba(0, 68, 102, 0.05));
    color: var(--nav-hover-text, var(--color-grey-900, #222));
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-height: 700px) {
    padding: 8px 12px;
    font-size: 16px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

// PrimaryButton
export const PrimaryButton = styled.button`
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
`;
// Hesap oluştur buton
export const CreateAccountButton = styled(PrimaryButton)`
  margin-top: 8px;
  margin-bottom: 8px;
  color: #00ffa2;
  border: 2px solid #00ffa2;
  background-color: #004466;

  &:hover {
    background-color: #00ffa2;
    color: #004466;
  }
`;

// ApplicationLink - Vize başvuruları için
export const ApplicationLink = styled(NavLink)`
  display: flex;
  align-items: center;
  position: relative;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--app-link-text, var(--color-grey-600));
  transition: all 0.2s ease;
  padding-right: 60px; /* Silme butonu için alan */
  margin: 4px 0;

  &:hover {
    background: var(--app-link-hover-bg, rgba(0, 68, 102, 0.05));
  }

  &.active {
    background-color: var(--app-link-active-bg, rgba(0, 68, 102, 0.1));
    color: var(--app-link-active-text, var(--color-grey-900));
    font-weight: 600;
  }
`;

// AppInfo
export const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const AppTitle = styled.span`
  font-weight: 600;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
  color: inherit;
`;

export const AppSubtitle = styled.span`
  font-size: 14px;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
`;

// ActionButton - Silme butonu
export const ActionButton = styled.button`
  position: absolute;
  right: 12px;
  background-color: rgba(231, 76, 60, 0.1);
  border: none;
  color: #e74c3c;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(231, 76, 60, 0.2);
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Divider
export const Divider = styled.div`
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

// Overlay
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 2950;
  opacity: ${(props) => (props.isOpen || props.isDocsModalOpen ? "1" : "0")};
  visibility: ${(props) =>
    props.isOpen || props.isDocsModalOpen ? "visible" : "hidden"};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

// Dokümanlar modalı için overlay
export const DocsModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${(props) => (props.isClosing ? modalFadeOut : modalFadeIn)} 0.3s
    ease forwards;
`;

// Dokümanlar modalı için konteyner
// Dokümanlar modalı için konteyner
export const DocsModalContainer = styled.div`
  background-color: var(--color-grey-51);
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: ${(props) => (props.isClosing ? modalFadeOut : modalFadeIn)} 0.3s
    ease forwards;

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

  @media (max-width: 450px) {
    width: 95%;
    padding: 2.5rem 1.5rem;
  }
`;

// Dokümanlar modalı için kapatma butonu
export const DocsModalCloseButton = styled.button`
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
  color: var(--color-grey-500);
  cursor: pointer;
  z-index: 9001;
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

// Modal bileşenleri
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  opacity: 0;
  animation: ${fadeIn} 0.3s forwards;
`;

export const ConfirmationModal = styled.div`
  background-color: var(--modal-bg, var(--color-grey-914, white));
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 28px;
  width: 90%;
  max-width: 360px;
  animation: ${modalFadeIn} 0.3s ease;
  border: 1px solid var(--modal-border, var(--color-grey-920, #e1e1e1));

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: var(--modal-header-text, var(--color-grey-600, #333));

  svg {
    margin-right: 16px;
    color: #e74c3c;
    width: 28px;
    height: 28px;
  }

  h3 {
    font-size: 22px;
    font-weight: 600;
    margin: 0;
  }
`;

export const ModalContent = styled.p`
  color: var(--modal-content-text, var(--color-grey-600, #555));
  font-size: 18px;
  line-height: 1.5;
  margin: 0 0 20px 0;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

// Butonlar
export const Button = styled.button`
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:focus {
    outline: none;
  }
`;

export const CancelButton = styled(Button)`
  background-color: var(--cancel-btn-bg, var(--color-grey-920, #f1f1f1));
  color: var(--cancel-btn-text, var(--color-grey-600, #555));

  &:hover {
    background-color: var(
      --cancel-btn-hover-bg,
      var(--color-grey-905, #e1e1e1)
    );
  }
`;

export const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

// Yükleniyor göstergesi
export const LoadingSpinner = styled.div`
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
