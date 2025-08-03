// MobileMenu.jsx - Updated with MultiStepOnboardingModal
import { useState, useEffect, useRef } from "react";
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
// NEW: Import MultiStepOnboardingModal instead of ModalSignup
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

const MobileMenu = () => {
  // PRESERVED: All existing state
  const [isOpen, setIsOpen] = useState(false);
  const [hasTransitionEnded, setHasTransitionEnded] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isDocsModalClosing, setIsDocsModalClosing] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  // NEW: Multi-step onboarding modal state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const navigate = useNavigate();
  const { logout } = useLogout();
  const { applications, dispatch: applicationsDispatch } =
    useVisaApplications();

  const [userId, setUserId] = useState(null);
  const menuRef = useRef();
  const iconRef = useRef();
  const { user, userType } = useUser();

  // PRESERVED: All existing useEffect hooks
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
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setHasTransitionEnded(true);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      setHasTransitionEnded(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isDocsModalOpen) {
          closeDocsModal();
        } else if (showOnboardingModal) {
          setShowOnboardingModal(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDocsModalOpen, showOnboardingModal, isOpen]);

  // PRESERVED: All existing queries
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

  // PRESERVED: All existing handlers
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

  // UPDATED: Use MultiStepOnboardingModal for all "get started" actions
  const handleGetStarted = () => {
    setShowOnboardingModal(true);
    setIsOpen(false); // Close mobile menu
  };

  // NEW: Handle onboarding completion - same as MainNav.jsx
  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);

    // Force page refresh to update dashboard
    console.log("Onboarding completed, refreshing page to update dashboard");
    window.location.reload();
  };

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  // NEW: Handlers for new visitors (non-breaking additions)
  const getNewVisitorInitial = () => "👋";
  const getNewVisitorName = () => "Hoş Geldiniz!";
  const getNewVisitorEmail = () => "Vize başvuru sürecinizi başlatın";

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

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  // NEW: Check for new visitors (ADDITIVE logic)
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
            {/* NEW: Special profile section for new visitors */}
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

                {/* UPDATED: Use handleGetStarted instead of ModalSignup */}
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
                {/* PRESERVED: Existing profile section for other users */}
                <ProfileInfoContainer>
                  <ProfileHeader>
                    <Avatar isAnonymous={isAnonymous}>{getInitial()}</Avatar>
                    <UserDetails>
                      <UserName>{getDisplayName()}</UserName>
                      <UserEmail>{getEmail()}</UserEmail>
                    </UserDetails>
                  </ProfileHeader>
                </ProfileInfoContainer>

                {/* UPDATED: Anonymous user account creation with MultiStepOnboardingModal */}
                {isAnonymous && (
                  <CreateAccountButton onClick={handleGetStarted}>
                    <IconUpgrade />
                    Hesap Oluştur
                  </CreateAccountButton>
                )}

                <NavButton onClick={openDocsModal}>
                  <HiDocument size={22} />
                  <span>Tüm Belgeler</span>
                </NavButton>

                <Divider />

                {/* PRESERVED: Applications section */}
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

                {/* UPDATED: New application button uses MultiStepOnboardingModal */}
                <NavButton onClick={handleGetStarted}>
                  <HiPlus size={22} />
                  <span>Yeni Başvuru</span>
                </NavButton>
              </>
            )}
          </div>

          <div className="bottom-section">
            <Divider />

            {/* PRESERVED: Profile settings for non-anonymous users */}
            {!isAnonymous && !isNewVisitor && (
              <NavButton onClick={handleProfileClick}>
                <IconSettings />
                <span>Profil Ayarları</span>
              </NavButton>
            )}

            {/* PRESERVED: Logout button (hidden for new visitors) */}
            {!isNewVisitor && (
              <NavButton onClick={handleLogout} style={{ color: "#e74c3c" }}>
                <IconLogout />
                <span>Oturumu Kapat</span>
              </NavButton>
            )}

            <Divider />

            {/* PRESERVED: Dark Mode Toggle */}
            <DarkModeToggle />
          </div>
        </MenuContents>
      </MenuContainer>

      {/* PRESERVED: Delete confirmation modal */}
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

      {/* PRESERVED: Documents modal */}
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

      {/* NEW: Multi-step onboarding modal - replaces ModalSignup */}
      <MultiStepOnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleOnboardingComplete}
      />
    </>
  );
};

export default MobileMenu;
