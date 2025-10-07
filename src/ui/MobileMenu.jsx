// MobileMenu.jsx - Updated with MultiStepOnboardingModal
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { HiDocument, HiPlus } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/authentication/useLogout";
import { useVisaApplications } from "../context/VisaApplicationContext";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import AllDocs from "./AllDocs";
import toast, { Toaster } from "react-hot-toast";
import { deleteVisaApplication } from "../services/apiDeleteVisaApp";
import { useUser } from "../features/authentication/useUser";
import DarkModeToggle from "./DarkModeToggle";
import MultiStepOnboardingModal from "../ui/MultiStepOnboardingModal";

// İkon ve Animasyonlar
import {
  IconClose,
  IconLogout,
  IconUpgrade,
  HamburgerIcon,
} from "./MobileMenuIcons";

// Stil bileşenleri
import {
  MenuIcon,
  MenuContainer,
  MenuContents,
  ProfileInfoContainer,
  ProfileHeader,
  Avatar,
  UserDetails,
  UserName,
  UserEmail,
  NavButton,
  CreateAccountButton,
  ApplicationLink,
  AppInfo,
  AppTitle,
  AppSubtitle,
  ActionButton,
  Divider,
  Overlay,
  DocsModalOverlay,
  DocsModalContainer,
  DocsModalCloseButton,
  ModalOverlay,
  ConfirmationModal,
  ModalHeader,
  ModalContent,
  ModalActions,
  CancelButton,
  DeleteButton,
} from "./MobileMenuStyles";

const AccordionContent = styled.div`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-left: 20px;
  margin-top: ${props => props.isOpen ? '8px' : '0'};
  margin-bottom: ${props => props.isOpen ? '8px' : '0'};
  border-left: 2px solid rgba(0, 255, 162, 0.3);
`;

const SubNavButton = styled(NavButton)`
  font-size: 14px;
  padding: 10px 16px;
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
  }
`;

// Icon Components
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

const IconChevron = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
      transition: 'transform 0.3s ease'
    }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

IconChevron.propTypes = {
  isOpen: PropTypes.bool
};

const IconPages = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const IconHome = () => (
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
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
  </svg>
);

const IconBlog = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const IconInfo = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const IconMessage = () => (
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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconLock = () => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTransitionEnded, setHasTransitionEnded] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isDocsModalClosing, setIsDocsModalClosing] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useLogout();
  const { applications, dispatch: applicationsDispatch } = useVisaApplications();

  const [userId, setUserId] = useState(null);
  const menuRef = useRef();
  const iconRef = useRef();
  const { user, userType } = useUser();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });

    const anonStatus = localStorage.getItem("isAnonymous") === "true";
    setIsAnonymous(anonStatus);

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isDocsModalOpen) {
          closeDocsModal();
        } else if (showOnboardingModal) {
          setShowOnboardingModal(false);
        } else if (isPagesOpen) {
          setIsPagesOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDocsModalOpen, showOnboardingModal, isPagesOpen, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setHasTransitionEnded(true);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      setHasTransitionEnded(false);
    }
  }, [isOpen]);

  const userSelectionsQuery = useQuery({
    queryKey: ["userSelectionsNav", userId],
    queryFn: () => fetchUserSelectionsDash(userId),
    enabled: !!userId,
  });

  const documentNames = userSelectionsQuery.data
    ? getDocumentsForSelections(userSelectionsQuery.data)
    : [];

  const documentsQuery = useQuery({
    queryKey: ["documentDetailsNav", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  const handleProfileClick = () => {
    navigate("/account");
    setIsOpen(false);
  };

  const getInitial = () => {
    if (isAnonymous) return "A";
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

  const openDocsModal = () => {
    setIsDocsModalOpen(true);
    setIsOpen(false);
    document.body.style.overflow = "hidden";
  };

  const closeDocsModal = () => {
    setIsDocsModalClosing(true);
    setTimeout(() => {
      setIsDocsModalOpen(false);
      setIsDocsModalClosing(false);
      document.body.style.overflow = "";
    }, 300);
  };

  const openDeleteModal = (appId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAppId(appId);
    setShowDeleteModal(true);
    setIsOpen(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAppId(null);
  };

  const handleDelete = async () => {
    if (!selectedAppId) return;
    try {
      await deleteVisaApplication(selectedAppId);
      applicationsDispatch({
        type: "DELETE_APPLICATION",
        payload: selectedAppId,
      });
      toast.success("Vize başvurusu başarıyla silindi!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        iconTheme: {
          primary: "#00ffa2",
          secondary: "#333",
        },
      });
      navigate("/dashboard");
      closeDeleteModal();
    } catch (error) {
      toast.error("Vize başvurusu silinemedi.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      closeDeleteModal();
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("isAnonymous");
    localStorage.removeItem("wellcomesAnswered");
    setIsOpen(false);
  };

  const handleGetStarted = () => {
    setShowOnboardingModal(true);
    setIsOpen(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);
    console.log("Onboarding completed, refreshing page to update dashboard");
    window.location.reload();
  };

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const getNewVisitorInitial = () => "👋";
  const getNewVisitorName = () => "Hoş Geldiniz!";
  const getNewVisitorEmail = () => "Vize başvuru sürecinizi başlatın";

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  const isNewVisitor = userType === "new_visitor" && !isAnonymous;

  return (
    <>
      <Toaster />
      <MenuIcon
        ref={iconRef}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        isDocsModalOpen={isDocsModalOpen}
      >
        <HamburgerIcon isOpen={isOpen} />
      </MenuIcon>

      <Overlay
        isOpen={isOpen}
        isDocsModalOpen={isDocsModalOpen}
        onClick={() => isOpen && setIsOpen(false)}
      />

      <MenuContainer
        isOpen={isOpen}
        hasTransitionEnded={hasTransitionEnded}
        ref={menuRef}
      >
        <MenuContents>
          <div className="top-section">
            {isNewVisitor ? (
              <>
                <ProfileInfoContainer>
                  <ProfileHeader>
                    <Avatar>{getNewVisitorInitial()}</Avatar>
                    <UserDetails>
                      <UserName>{getNewVisitorName()}</UserName>
                      <UserEmail>{getNewVisitorEmail()}</UserEmail>
                    </UserDetails>
                  </ProfileHeader>
                </ProfileInfoContainer>

                <NavButton 
                  onClick={() => setIsPagesOpen(!isPagesOpen)}
                  style={{ justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconPages />
                    <span>Sayfalar</span>
                  </div>
                  <IconChevron isOpen={isPagesOpen} />
                </NavButton>

                <AccordionContent isOpen={isPagesOpen}>
                  <SubNavButton 
                    onClick={() => {
                      navigate('/');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconHome />
                    <span>Ana Sayfa</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/blog');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconBlog />
                    <span>Blog</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/hakkimizda');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconInfo />
                    <span>Hakkımızda</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/iletisim');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconMessage />
                    <span>İletişim</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/gizlilik-politikasi');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconLock />
                    <span>Yasal & Gizlilik</span>
                  </SubNavButton>
                </AccordionContent>

                <CreateAccountButton onClick={handleGetStarted}>
                  <IconUpgrade />
                  Hemen Başlayın
                </CreateAccountButton>

                <NavButton onClick={handleLogin}>
                  <IconLogout />
                  <span>Giriş Yap</span>
                </NavButton>

                <Divider />
              </>
            ) : (
              <>
                <ProfileInfoContainer>
                  <ProfileHeader>
                    <Avatar isAnonymous={isAnonymous}>{getInitial()}</Avatar>
                    <UserDetails>
                      <UserName>{getDisplayName()}</UserName>
                      <UserEmail>{getEmail()}</UserEmail>
                    </UserDetails>
                  </ProfileHeader>
                </ProfileInfoContainer>

                {isAnonymous && (
                  <CreateAccountButton onClick={handleGetStarted}>
                    <IconUpgrade />
                    Hesap Oluştur
                  </CreateAccountButton>
                )}

                <NavButton 
                  onClick={() => setIsPagesOpen(!isPagesOpen)}
                  style={{ justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconPages />
                    <span>Sayfalar</span>
                  </div>
                  <IconChevron isOpen={isPagesOpen} />
                </NavButton>

                <AccordionContent isOpen={isPagesOpen}>
                  <SubNavButton 
                    onClick={() => {
                      navigate('/');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconHome />
                    <span>Ana Sayfa</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/blog');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconBlog />
                    <span>Blog</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/hakkimizda');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconInfo />
                    <span>Hakkımızda</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/iletisim');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconMessage />
                    <span>İletişim</span>
                  </SubNavButton>
                  
                  <SubNavButton 
                    onClick={() => {
                      navigate('/gizlilik-politikasi');
                      setIsOpen(false);
                      setIsPagesOpen(false);
                    }}
                  >
                    <IconLock />
                    <span>Yasal & Gizlilik</span>
                  </SubNavButton>
                </AccordionContent>

                <NavButton onClick={openDocsModal}>
                  <HiDocument size={22} />
                  <span>Tüm Belgeler</span>
                </NavButton>

                <Divider />

                <div className="applications-section">
                  {applications.map((app) => (
                    <ApplicationLink
                      key={app.id}
                      to={`/dashboard/${app.id}`}
                      className={({ isActive }) => (isActive ? "active" : "")}
                      onClick={() => setIsOpen(false)}
                    >
                      <AppInfo>
                        <AppTitle>{app.ans_country}</AppTitle>
                        <AppSubtitle>
                          {app.ans_purpose} - {app.ans_profession}
                        </AppSubtitle>
                      </AppInfo>
                      {applications.length > 1 && (
                        <ActionButton
                          onClick={(e) => openDeleteModal(app.id, e)}
                          aria-label="Vize başvurusunu sil"
                          title="Vize başvurusunu sil"
                        >
                          <MdDelete size={20} />
                        </ActionButton>
                      )}
                    </ApplicationLink>
                  ))}
                </div>

                <NavButton onClick={handleGetStarted}>
                  <HiPlus size={22} />
                  <span>Yeni Başvuru</span>
                </NavButton>
              </>
            )}
          </div>

          <div className="bottom-section">
            <Divider />

            {!isAnonymous && !isNewVisitor && (
              <NavButton onClick={handleProfileClick}>
                <IconSettings />
                <span>Profil Ayarları</span>
              </NavButton>
            )}

            {!isNewVisitor && (
              <NavButton onClick={handleLogout} style={{ color: "#e74c3c" }}>
                <IconLogout />
                <span>Oturumu Kapat</span>
              </NavButton>
            )}

            <Divider />

            <DarkModeToggle />
          </div>
        </MenuContents>
      </MenuContainer>

      {showDeleteModal && (
        <ModalOverlay onClick={closeDeleteModal}>
          <ConfirmationModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <MdDelete size={28} />
              <h3>Vize Başvurusunu Sil</h3>
            </ModalHeader>
            <ModalContent>
              Bu vize başvurusunu silmek istediğinizden emin misiniz? Bu işlem
              geri alınamaz.
            </ModalContent>
            <ModalActions>
              <CancelButton onClick={closeDeleteModal}>İptal</CancelButton>
              <DeleteButton onClick={handleDelete}>Sil</DeleteButton>
            </ModalActions>
          </ConfirmationModal>
        </ModalOverlay>
      )}

      {isDocsModalOpen && (
        <DocsModalOverlay
          isClosing={isDocsModalClosing}
          onClick={closeDocsModal}
        >
          <DocsModalContainer
            isClosing={isDocsModalClosing}
            onClick={(e) => e.stopPropagation()}
          >
            <DocsModalCloseButton onClick={closeDocsModal}>
              <IconClose />
            </DocsModalCloseButton>

            <AllDocs />
          </DocsModalContainer>
        </DocsModalOverlay>
      )}

      <MultiStepOnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleOnboardingComplete}
      />
    </>
  );
};

export default MobileMenu;