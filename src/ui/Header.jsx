import { styled } from "styled-components";
import HeaderMenu from "./HeaderMenu";
import ProfileButton from "./ProfileButton";
import ModalSignup from "../ui/ModalSignup";
import Spinner from "../ui/Spinner";
import { useEffect, useState } from "react";
import SignupForm from "../features/authentication/SignupForm";
import { useLogout } from "../features/authentication/useLogout";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const StyledHeader = styled.header`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 1.2rem 4.8rem;
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  @media (max-width: 710px) {
    display: none;
  }
`;

const HemenUyeOl = styled.button`
  width: 180px;
  height: 50px;
  border: 2px solid #00ffa2;
  outline: none;
  font-weight: bold;
  color: var(--color-grey-913);
  background: #004466;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 16px;

  @media (max-width: 1300px) {
    width: 160px;
  }

  @media (max-width: 1050px) {
    width: 130px;
    font-size: 14px;
  }

  &:hover {
    background: #00ffa2;
    color: #004466;
  }
`;

const LogoutButton = styled.button`
  width: 140px;
  height: 50px;
  border: 2px solid #e53935;
  outline: none;
  font-weight: bold;
  color: var(--color-grey-913);
  background: rgba(0, 68, 102, 0.8);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 1300px) {
    width: 130px;
  }

  @media (max-width: 1050px) {
    width: 120px;
    font-size: 14px;
  }

  &:hover {
    background: rgba(229, 57, 53, 0.8);
    color: white;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
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

function Header() {
  const [isAnonymous, setIsAnonymous] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useLogout();
  const navigate = useNavigate();

  // SVG icon for logout button
  const LogoutIcon = () => (
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
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

  // Anonim kullanıcı için çıkış yap işlemi
  const handleAnonymousLogout = () => {
    setShowLogoutModal(true);
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

  useEffect(() => {
    // Başlangıçta localStorage'daki isAnonymous değerini kontrol ediyoruz
    const anonymousStatus = localStorage.getItem("isAnonymous") === "true";
    setIsAnonymous(anonymousStatus);
    setLoading(false);
  }, []);

  // localStorage'da isAnonymous değerinin değişip değişmediğini izleyelim
  useEffect(() => {
    const handleStorageChange = () => {
      const anonymousStatus = localStorage.getItem("isAnonymous") === "true";
      setIsAnonymous(anonymousStatus);
    };

    // localStorage'da değişiklik olduğunda handleStorageChange tetiklenecek
    window.addEventListener("storage", handleStorageChange);

    // Cleanup - event listener'ı bileşen kaldırıldığında temizleyelim
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <StyledHeader>
        {isAnonymous ? (
          <ButtonContainer>
            <ModalSignup>
              <ModalSignup.Open opens="signUpForm">
                <HemenUyeOl>Hemen Üye Ol</HemenUyeOl>
              </ModalSignup.Open>
              <ModalSignup.Window name="signUpForm">
                <SignupForm />
              </ModalSignup.Window>
            </ModalSignup>

            <LogoutButton onClick={handleAnonymousLogout}>
              <LogoutIcon />
              Çıkış Yap
            </LogoutButton>
          </ButtonContainer>
        ) : (
          <ProfileButton size="large" variation="primary" />
        )}
        <HeaderMenu />
      </StyledHeader>

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

export default Header;
