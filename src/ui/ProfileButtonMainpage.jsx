// src/ui/ProfileButton.jsx

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useLogout } from "../features/authentication/useLogout";
import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";

const ProfileContainer = styled.div`
  position: relative;
  
  @media (max-width: 960px) {
    display: none;
  }
`;

const AvatarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  padding: 0.8rem 1rem;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 68, 102, 0.05);
  }
`;

const Avatar = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background-color: var(--color-grey-200, #eee);
  color: var(--color-grey-700, #333);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-700, #333);
`;

const UserEmail = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500, #777);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-grey-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(0, 68, 102, 0.1);
  width: 240px;
  padding: 8px 0;
  z-index: 3000;
  backdrop-filter: blur(10px);
  transform-origin: top right;
  transition: all 0.2s ease;
  
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.95)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 18px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 1.4rem;
  color: var(--color-grey-700, #333);
  
  &:hover {
    background: rgba(0, 68, 102, 0.05);
  }

  svg {
    margin-right: 12px;
    color: var(--color-grey-500, #777);
    width: 20px;
    height: 20px;
  }
`;

function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useLogout();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Dışarı tıklandığında menüyü kapatmak için useEffect
  useEffect(() => {
    function handleClickOutside(e) {
      // Eğer menü açıksa ve tıklama menuRef dışına yapılmışsa menüyü kapat
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    
    // Global document click event'ini dinle
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup function - component unmount edildiğinde listener'ı kaldır
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // isOpen değiştiğinde effect'i yeniden çalıştır

  // Buton tıklaması için toggle fonksiyonu
  const toggleMenu = (e) => {
    e.stopPropagation(); // Event propagation'ı durdur
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/account");
    setIsOpen(false);
  };

  // Kullanıcı adının baş harfini almak için
  const getInitial = () => {
    if (!user) return "";
    
    const { user_metadata, email } = user;
    const fullName = user_metadata?.full_name;
    
    return fullName 
      ? fullName.charAt(0).toUpperCase() 
      : email.charAt(0).toUpperCase();
  };

  // Kullanıcı adını veya e-postasını almak için
  const getDisplayName = () => {
    if (!user) return "";
    
    const { user_metadata, email } = user;
    return user_metadata?.full_name || email;
  };

  // Kullanıcı e-postasını almak için
  const getEmail = () => {
    if (!user) return "";
    return user.email;
  };

  // SVG ikonları
  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgb(229, 57, 53)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <ProfileContainer ref={menuRef}>
      <AvatarButton onClick={toggleMenu}>
        <Avatar>{getInitial()}</Avatar>
        <UserInfo>
          <Username>{getDisplayName()}</Username>
          <UserEmail>{getEmail()}</UserEmail>
        </UserInfo>
      </AvatarButton>
      
      <DropdownMenu isOpen={isOpen}>
        <MenuItem onClick={handleProfileClick}>
          <ProfileIcon />
          Profil Ayarları
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon /><p style={{color: "rgb(229, 57, 53)"}}>
          Oturumu Kapat
          </p>
        </MenuItem>
      </DropdownMenu>
    </ProfileContainer>
  );
}

export default ProfileButton;