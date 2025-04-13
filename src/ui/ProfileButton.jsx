import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useLogout } from "../features/authentication/useLogout";
import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const ProfileContainer = styled.div`
  position: relative;
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
  background-color: ${(props) =>
    props.isAnonymous
      ? "var(--color-grey-400)"
      : "var(--color-grey-200, #eee)"};
  color: var(--color-grey-700, #333);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Username = styled.span`
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-grey-900, #111);
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
`;

const UserEmail = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-700, #444);
  font-weight: 500;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 240px;
  padding: 8px 0;
  z-index: 3000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform-origin: top right;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

  transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.95)")};
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};

  &:before {
    content: "";
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(45deg);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-left: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
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
  font-weight: 600;
  color: var(--color-grey-900, #111);
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  width: calc(100% - 16px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  svg {
    margin-right: 12px;
    color: var(--color-grey-500, #777);
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }
`;

// Modal bileşenleri
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 24px;
  max-width: 450px;
  width: 90%;
  animation: fadeInScale 0.3s ease;

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ModalIcon = styled.div`
  color: #ff7700;
  flex-shrink: 0;
`;

const ModalTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ModalText = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: #555;
  margin: 0 0 24px 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ModalButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(props) =>
    props.primary
      ? `
    background: #004466;
    color: white;
    
    &:hover {
      background: #003355;
    }
  `
      : `
    background: #f5f5f5;
    color: #333;
    
    &:hover {
      background: #e5e5e5;
    }
  `}
`;

function ProfileButton({ isAnonymous }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useLogout();
  const { user } = useUser();
  const navigate = useNavigate();

  // prop olarak gelen isAnonymous değerini kontrol et ve gerekirse düzelt
  const [actualIsAnonymous, setActualIsAnonymous] = useState(isAnonymous);

  useEffect(() => {
    // Kullanıcının gerçekten anonim olup olmadığını kontrol et
    const checkAnonymousStatus = () => {
      // Eğer kullanıcının email'i varsa kesinlikle anonim kullanıcı değildir
      if (user && user.email) {
        if (isAnonymous === true) {
          console.log("Kullanıcı email'e sahip, anonim değil:", user.email);
          setActualIsAnonymous(false);
        } else {
          setActualIsAnonymous(isAnonymous);
        }
      } else {
        // Email yoksa localStorage kontrolü yap
        const storedAnonymousStatus =
          localStorage.getItem("isAnonymous") === "true";
        setActualIsAnonymous(storedAnonymousStatus);
      }
    };

    checkAnonymousStatus();
  }, [user, isAnonymous]);

  // useEffect ile dışarı tıklandığında menüyü kapatmak için event listener
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

  // Çıkış yap butonuna tıklayınca modal göster
  const handleLogoutClick = () => {
    // Eğer kullanıcı anonim ise modal göster
    if (actualIsAnonymous) {
      setShowLogoutModal(true);
      setIsOpen(false); // Dropdown menüyü kapat
    } else {
      // Normal kullanıcı ise direkt çıkış yap
      logout();
      localStorage.removeItem("isAnonymous");
      localStorage.removeItem("wellcomesAnswered");
      setIsOpen(false);
    }
  };

  // Gerçekten çıkış yapma işlemi
  const handleConfirmLogout = () => {
    logout();
    localStorage.removeItem("isAnonymous");
    localStorage.removeItem("wellcomesAnswered");
    setShowLogoutModal(false);
  };

  // Üye olma sayfasına yönlendirme
  const handleSignUp = () => {
    setShowLogoutModal(false);
    navigate("/sign-up");
  };

  // Modal dışına tıklama ile kapatma
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowLogoutModal(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/account");
    setIsOpen(false);
  };

  // Kullanıcı adının baş harfini almak için
  const getInitial = () => {
    if (actualIsAnonymous) return "A"; // Anonim kullanıcılar için "A" harfi

    if (!user) return "";

    const { user_metadata, email } = user;
    const fullName = user_metadata?.full_name;

    return fullName
      ? fullName.charAt(0).toUpperCase()
      : email.charAt(0).toUpperCase();
  };

  // Kullanıcı adını veya e-postasını almak için
  const getDisplayName = () => {
    if (actualIsAnonymous) return "Anonim Kullanıcı";

    if (!user) return "";

    const { user_metadata, email } = user;
    return user_metadata?.full_name || email;
  };

  // Kullanıcı e-postasını almak için
  const getEmail = () => {
    if (actualIsAnonymous) return "Oturum geçici";

    if (!user) return "";
    return user.email;
  };

  // SVG ikonları
  const LogoutIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(229, 57, 53)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  const ProfileIcon = () => (
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

  const UpgradeIcon = () => (
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

  const WarningIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );

  return (
    <>
      <ProfileContainer ref={menuRef}>
        <AvatarButton onClick={toggleMenu} isAnonymous={actualIsAnonymous}>
          <Avatar isAnonymous={actualIsAnonymous}>{getInitial()}</Avatar>
          <UserInfo>
            <Username>{getDisplayName()}</Username>
            <UserEmail>{getEmail()}</UserEmail>
          </UserInfo>
        </AvatarButton>

        <DropdownMenu isOpen={isOpen}>
          {actualIsAnonymous && (
            <MenuItem
              onClick={() => {
                navigate("/sign-up");
                setIsOpen(false);
              }}
            >
              <UpgradeIcon />
              <p style={{ color: "#00a67d", fontWeight: "700" }}>
                Hesap Oluştur
              </p>
            </MenuItem>
          )}

          {!actualIsAnonymous && (
            <MenuItem onClick={handleProfileClick}>
              <ProfileIcon />
              Profil Ayarları
            </MenuItem>
          )}

          <MenuItem onClick={handleLogoutClick}>
            <LogoutIcon />
            <p style={{ color: "rgb(229, 57, 53)", fontWeight: "700" }}>
              Oturumu Kapat
            </p>
          </MenuItem>
        </DropdownMenu>
      </ProfileContainer>

      {/* Logout Onay Modalı */}
      {showLogoutModal &&
        createPortal(
          <ModalOverlay onClick={handleOverlayClick}>
            <ModalContent>
              <ModalHeader>
                <ModalIcon>
                  <WarningIcon />
                </ModalIcon>
                <ModalTitle>Dikkat</ModalTitle>
              </ModalHeader>
              <ModalText>
                Üye olmadan oturumu kapatırsanız ilerlemeniz kaybolacak.
              </ModalText>
              <ModalActions>
                <ModalButton onClick={handleSignUp}>Üye Ol</ModalButton>
                <ModalButton primary onClick={handleConfirmLogout}>
                  Anladım, Çıkış Yap
                </ModalButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>,
          document.body
        )}
    </>
  );
}

ProfileButton.propTypes = {
  isAnonymous: PropTypes.bool,
};

ProfileButton.defaultProps = {
  isAnonymous: false,
};

export default ProfileButton;
