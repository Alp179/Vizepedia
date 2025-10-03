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
import { useUser } from "../features/authentication/useUser";
import MultiStepOnboardingModal from "../ui/MultiStepOnboardingModal";

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

const GetStartedButton = styled.button`
  width: 200px;
  height: 50px;
  border: 2px solid #00ffa2;
  outline: none;
  font-weight: bold;
  color: var(--color-grey-913);
  background: linear-gradient(135deg, #004466, #0066aa);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 16px;
  transition: all 0.3s ease;

  @media (max-width: 1300px) {
    width: 180px;
  }

  @media (max-width: 1050px) {
    width: 150px;
    font-size: 14px;
  }

  &:hover {
    background: #00ffa2;
    color: #004466;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 162, 0.3);
  }
`;

const LoginButton = styled.button`
  width: 140px;
  height: 50px;
  border: 2px solid transparent;
  outline: none;
  font-weight: bold;
  color: #004466;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 16px;
  transition: all 0.3s ease;

  @media (max-width: 1300px) {
    width: 130px;
  }

  @media (max-width: 1050px) {
    width: 120px;
    font-size: 14px;
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #004466;
    transform: translateY(-1px);
  }
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, rgba(0, 68, 102, 0.15), rgba(0, 255, 162, 0.15));
  padding: 10px 20px;
  border-radius: 16px;
  border: 2px solid rgba(0, 255, 162, 0.4);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 68, 102, 0.1);

  span {
    color: #004466;
    font-weight: 600;
    font-size: 1.4rem;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 1050px) {
    span {
      font-size: 1.2rem;
    }
  }
    @media (max-width: 900px) {
    display: none;
    }
`;

// Loading state for migration
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  span {
    color: var(--color-grey-913);
    font-weight: 500;
    font-size: 1.4rem;
  }
`;

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

const NavDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  padding: 10px 18px;
  background: linear-gradient(135deg, rgba(0, 68, 102, 0.2), rgba(0, 255, 162, 0.2));
  border: 2px solid rgba(0, 255, 162, 0.5);
  border-radius: 16px;
  color: #004466;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 68, 102, 0.1);

  &:hover {
    background: linear-gradient(135deg, rgba(0, 255, 162, 0.3), rgba(0, 68, 102, 0.2));
    border-color: #00ffa2;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 255, 162, 0.2);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    stroke: #004466;
  }

  @media (max-width: 1050px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 200px;
  background: var(--color-grey-1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 68, 102, 0.2);
  border: 2px solid rgba(0, 255, 162, 0.3);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  z-index: 3000;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 255, 162, 0.15), rgba(0, 68, 102, 0.1));
    color: #003355;
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 255, 162, 0.2);
  }

  svg {
    width: 18px;
    height: 18px;
    color: #00ffa2;
  }
`;

function Header() {
  const { user, isLoading: userLoading } = useUser();
  
  const [isAnonymous, setIsAnonymous] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  
  const { logout } = useLogout();
  const navigate = useNavigate();

  // SVG icons
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

  const LoadingIcon = () => (
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
      style={{ animation: 'spin 1s linear infinite' }}
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
        strokeDasharray="32"
        strokeDashoffset="8"
      />
    </svg>
  );

  

function NavigationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <NavDropdown>
  <DropdownButton 
    isOpen={isOpen}
    onClick={() => setIsOpen(!isOpen)}
  >
        Sayfalar
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </DropdownButton>
      
      <DropdownMenu isOpen={isOpen}>
        <DropdownItem onClick={() => handleNavigation('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          Ana Sayfa
        </DropdownItem>
        
        <DropdownItem onClick={() => handleNavigation('/blog')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Blog
        </DropdownItem>
        
        <DropdownItem onClick={() => handleNavigation('/hakkimizda')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Hakkımızda
        </DropdownItem>
        
        <DropdownItem onClick={() => handleNavigation('/iletisim')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          İletişim
        </DropdownItem>
        
        <DropdownItem onClick={() => handleNavigation('/gizlilik-politikasi')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Yasal & Gizlilik
        </DropdownItem>
      </DropdownMenu>
    </NavDropdown>
  );}



  // Event handlers
  const handleAnonymousLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    // UPDATED: Clear sessionStorage instead of localStorage
    sessionStorage.removeItem("isAnonymous");
    sessionStorage.removeItem("wellcomesAnswered");
    setShowLogoutModal(false);
  };

  const handleSignUp = () => {
    setShowLogoutModal(false);
    navigate("/sign-up");
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowLogoutModal(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    setShowOnboardingModal(true);
  };

  const handleOnboardingComplete = (newApplicationId) => {
    setShowOnboardingModal(false);
    console.log("Onboarding completed with new application ID:", newApplicationId);
    
    if (newApplicationId) {
      // Navigate to the new application dashboard
      window.location.href = `/dashboard/${newApplicationId}`;
    } else {
      // Fallback: refresh current page
      window.location.reload();
    }
  };

  // UPDATED: Enhanced useEffect with sessionStorage migration flag detection
  useEffect(() => {
    const updateUserState = () => {
      // UPDATED: Check sessionStorage instead of localStorage
      const anonymousStatus = sessionStorage.getItem("isAnonymous") === "true";
      setIsAnonymous(anonymousStatus);
      setLoading(false);
      
      // CRITICAL: Close any open modals when user becomes authenticated
      if (user && !anonymousStatus) {
        console.log("User is now authenticated, closing any open modals");
        setShowLogoutModal(false);
        setShowOnboardingModal(false);
        
        // Force close any ModalSignup that might be open
        const modalSignupOverlay = document.querySelector('[data-modal-signup-overlay]');
        if (modalSignupOverlay) {
          modalSignupOverlay.click();
        }
        
        // Alternative: dispatch a custom event to close modals
        window.dispatchEvent(new CustomEvent('closeAllModals'));
      }
      
      console.log("Header state updated:", {
        user: user,
        isAnonymous: anonymousStatus,
        userLoading: userLoading
      });
    };

    updateUserState();

    const handleStorageChange = () => {
      updateUserState();
    };

    // UPDATED: Listen to sessionStorage changes (though sessionStorage doesn't fire storage events across tabs like localStorage)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, userLoading]);

  // CRITICAL: Enhanced user type detection with migration safety
  const getUserType = () => {
    // UPDATED: Check sessionStorage for migration status
    const isMigrating = sessionStorage.getItem("userMigrating") === "true";
    if (isMigrating) return "migrating";
    
    // If still loading user data, show loading
    if (userLoading || loading) return "loading";
    
    // UPDATED: Check sessionStorage for anonymous status FIRST
    const anonymousStatus = sessionStorage.getItem("isAnonymous") === "true";
    
    // If user is marked as anonymous in sessionStorage, they are anonymous
    if (anonymousStatus) return "anonymous";
    
    // If user exists in auth context, they are authenticated
    if (user) return "authenticated";
    
    // If no user and not anonymous, it's new visitor
    return "new_visitor";
  };

  const currentUserType = getUserType();

  // Show spinner while loading
  if (currentUserType === "loading") {
    return <Spinner />;
  }

  console.log("Header rendering with userType:", currentUserType, {
    user: user,
    isAnonymous: isAnonymous,
    userLoading: userLoading
  });

  return (
    <>
      <StyledHeader>
        <NavigationDropdown />
        {/* Show migration loading state */}
        {currentUserType === "migrating" ? (
          <LoadingContainer>
            <LoadingIcon />
            <span>Hesabınız hazırlanıyor...</span>
          </LoadingContainer>
        ) : currentUserType === "new_visitor" ? (
          <ButtonContainer>
            <WelcomeMessage>
              <span>👋 Vize Paneline Hoş Geldiniz!</span>
            </WelcomeMessage>
            <GetStartedButton onClick={handleGetStarted}>
              Hemen Başlayın
            </GetStartedButton>
            <LoginButton onClick={handleLogin}>Giriş Yap</LoginButton>
          </ButtonContainer>
        ) : currentUserType === "anonymous" ? (
          <ButtonContainer>
            <ModalSignup>
              <ModalSignup.Open opens="signUpForm">
                <HemenUyeOl>Hemen Üye Ol</HemenUyeOl>
              </ModalSignup.Open>
              <ModalSignup.Window name="signUpForm">
                <SignupForm onCloseModal={() => {
                  // Force close modal when signup is successful
                  console.log("SignupForm requested modal close");
                }} />
              </ModalSignup.Window>
            </ModalSignup>

            <LogoutButton onClick={handleAnonymousLogout}>
              <LogoutIcon />
              Çıkış Yap
            </LogoutButton>
          </ButtonContainer>
        ) : (
          // Authenticated user
          <>
            <ProfileButton size="large" variation="primary" />
            <HeaderMenu />
          </>
        )}
      </StyledHeader>

      <MultiStepOnboardingModal 
        isOpen={showOnboardingModal}
        onClose={handleOnboardingComplete}
      />

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