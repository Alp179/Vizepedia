/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { HiDocument, HiPlus } from "react-icons/hi";
import { MdClose, MdDelete } from "react-icons/md"; // MdDelete ikonu eklendi
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/authentication/useLogout";
import { useVisaApplications } from "../context/VisaApplicationContext";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { useDocuments } from "../context/DocumentsContext";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import UserAvatar from "../features/authentication/UserAvatar";
import AllDocs from "./AllDocs";
import toast, { Toaster } from "react-hot-toast";
import { deleteVisaApplication } from "../services/apiDeleteVisaApp";
import { NavLink } from "react-router-dom";

// Animasyonlar
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const modalFadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

// Hamburger menü ikonu
const MenuIcon = styled.div.attrs((props) => ({
  style: { display: props.isDocsModalOpen ? "none" : "block" },
}))`
  background: ${(props) =>
    props.isOpen ? "transparent" : "rgba(255, 255, 255, 0.5)"};
  border-radius: 6px;
  display: flex;
  height: 42px;
  position: fixed;
  top: 20px;
  right: 12px;
  z-index: 2000; /* z-index değerini modallara göre daha düşük ayarladık */
  @media (min-width: 710px) {
    display: none;
  }
  .ham {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 400ms;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .hamRotate.active {
    transform: rotate(45deg);
  }
  .hamRotate180.active {
    transform: rotate(180deg);
  }
  .line {
    fill: none;
    transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
    stroke: ${(props) => (props.isOpen ? "var(--stroke-ham-1)" : "black")};
    stroke-width: 5.5;
    stroke-linecap: round;
  }

  .ham8 .top {
    stroke-dasharray: 40 160;
  }
  .ham8 .middle {
    stroke-dasharray: 40 142;
    transform-origin: 50%;
    transition: transform 400ms;
  }
  .ham8 .bottom {
    stroke-dasharray: 40 85;
    transform-origin: 50%;
    transition: transform 400ms, stroke-dashoffset 400ms;
  }
  .ham8.active .top {
    stroke-dashoffset: -64px;
  }
  .ham8.active .middle {
    transform: rotate(90deg);
  }
  .ham8.active .bottom {
    stroke-dashoffset: -64px;
  }
`;

// Ana menü konteyner
const MenuContainer = styled.div`
  z-index: 3000;
  position: fixed;
  top: 0;
  right: 0;
  width: 60%;
  opacity: var(--opacity-1);
  @media (max-width: 500px) {
    width: 80%;
  }
  height: 100vh;
  background: var(--color-grey-55);
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.52);
  z-index: 1100;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease-in-out;
  @media (min-width: 710px) {
    display: none;
  }
`;

// Menü başlık
const MenuHeader = styled.div`
  z-index: 3000;
  display: flex;
  justify-content: flex-start;
  gap: 42px;
  align-items: center;
  @media (max-width: 370px) {
    gap: 16px;
  }
  @media (max-width: 350px) {
    gap: 8px;
  }
`;

// Menü içerik
const MenuContent = styled.div`
  z-index: 3000;
  margin-top: 2.5rem;
  display: flex;
  height: 90%;
  flex-direction: column;
  gap: 8px;
`;

// Gezinme bağlantıları
const StyledNavLink = styled.div`
  width: 90%;
  gap: 16px;
  min-height: 60px;
  z-index: 3000;
  border-radius: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  padding: 0 8px;

  &:hover,
  &:active {
    background-color: var(--color-grey-3);
  }
`;

// Silme butonu
const ActionButton = styled.button`
  background-color: rgba(231, 76, 60, 0.15);
  border: none;
  color: #e74c3c;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: absolute;
  right: 15px;
  opacity: 1;

  & svg {
    width: 26px;
    height: 26px;
  }

  &:hover,
  &:active {
    background-color: rgba(231, 76, 60, 0.25);
    transform: scale(1.05);
  }

  @media (max-width: 370px) {
    width: 40px;
    height: 40px;
    right: 10px;
    & svg {
      width: 24px;
      height: 24px;
    }
  }
`;

// Mobil nav link container
const MobileNavLinkContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;

  .mobile-navlink {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 14px;
    margin: 10px 0;
    color: var(--color-grey-600);
    text-decoration: none;
    width: 100%;
    position: relative;
    padding-right: 60px; /* Silme butonu için daha fazla yer */
    transition: all 0.2s ease;
    font-size: 18px;

    &.mobile-navlink-active {
      background-color: var(--color-grey-920);
      color: var(--color-brand-600);
      font-weight: 600;
    }
  }
`;

// Overlay
const Overlay = styled.div`
  position: fixed;
  backdrop-filter: blur(4px);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backdrop-color);
  z-index: 1100;
  display: ${(props) =>
    props.isOpen || props.isDocsModalOpen ? "block" : "none"};
`;

// Dokümanlar modalı için overlay
const DocsModalOverlay = styled.div`
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
const DocsModalContainer = styled.div`
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

  @media (max-width: 450px) {
    width: 95%;
    padding: 2.5rem 1.5rem;
  }
`;

// Dokümanlar modalı için kapatma butonu
const DocsModalCloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-grey-905);
  color: var(--color-grey-600);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;

  &:hover {
    background-color: var(--color-grey-900);
    color: white;
  }
`;

// Silme işlemi onay modalı için overlay
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  opacity: 0;
  animation: ${fadeIn} 0.3s forwards;
`;

// Silme işlemi onay modalı için konteyner
const ConfirmationModal = styled.div`
  background-color: var(--color-grey-914);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 28px;
  width: 90%;
  max-width: 360px;
  animation: ${modalFadeIn} 0.3s ease;
  border: 1px solid var(--color-grey-920);

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Silme işlemi onay modalı için başlık
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: var(--color-grey-600);

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

// Silme işlemi onay modalı için içerik
const ModalContent = styled.p`
  color: var(--color-grey-600);
  font-size: 18px;
  line-height: 1.5;
  margin: 0 0 20px 0;
`;

// Silme işlemi onay modalı için butonlar
const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

// Genel buton stilini
const Button = styled.button`
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

// İptal butonu
const CancelButton = styled(Button)`
  background-color: var(--color-grey-920);
  color: var(--color-grey-600);

  &:hover {
    background-color: var(--color-grey-905);
  }
`;

// Silme butonu
const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

// Divider
const Divider = styled.div`
  height: 2px;
  width: 95%;
  background: var(--color-grey-600);
  margin: 12px auto 12px auto;
`;

// Uygulama bilgisi için stiller
const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 75%;
  overflow: hidden;
`;

const AppTitle = styled.span`
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  margin-bottom: 4px;
`;

const AppSubtitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  opacity: 0.9;
`;

const IconSettings = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "26px", height: "26px", color: "var(--color-grey-924)" }}
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
    style={{ width: "26px", height: "26px", color: "rgb(229, 57, 53)" }}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const MobileMenu = () => {
  // State yönetimi
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  // Tüm Belgeler modalı için state yönetimi
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isDocsModalClosing, setIsDocsModalClosing] = useState(false);

  const navigate = useNavigate();
  const { logout } = useLogout();
  const { applications, dispatch: applicationsDispatch } =
    useVisaApplications();
  const { setSelectedDocument } = useSelectedDocument();
  const { state: completedDocuments } = useDocuments();
  const [userId, setUserId] = useState(null);
  const menuRef = useRef();
  const iconRef = useRef();

  // Kullanıcı bilgilerini ve dışarı tıklama olayını yönetme
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });

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

  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isDocsModalOpen) {
        closeDocsModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDocsModalOpen]);

  // Kullanıcı seçimleri ve belge bilgilerini alma
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

  // Belgeye devam etme fonksiyonu
  const continueToDocument = () => {
    if (!documentsQuery.data) return;

    const firstIncompleteIndex = documentsQuery.data.findIndex(
      (doc) => !completedDocuments[doc.docName]
    );

    if (firstIncompleteIndex !== -1) {
      const selectedDocument = documentsQuery.data[firstIncompleteIndex];
      setSelectedDocument(selectedDocument);
      navigate(`/documents/${selectedDocument.id}`);
      setIsOpen(false);
    }
  };

  // Tüm Belgeler modalını açma fonksiyonu
  const openDocsModal = () => {
    setIsDocsModalOpen(true);
    setIsOpen(false); // Ana menüyü kapat
    document.body.style.overflow = "hidden"; // Scroll'u kilitle
  };

  // Tüm Belgeler modalını kapatma fonksiyonu
  const closeDocsModal = () => {
    setIsDocsModalClosing(true);

    // Animasyon tamamlandıktan sonra modalı kapat
    setTimeout(() => {
      setIsDocsModalOpen(false);
      setIsDocsModalClosing(false);
      document.body.style.overflow = ""; // Scroll kilidini kaldır
    }, 300);
  };

  // Modal açma fonksiyonu
  const openDeleteModal = (appId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAppId(appId);
    setShowDeleteModal(true);
    setIsOpen(false); // Menüyü kapat ki modal görünebilsin
  };

  // Modal kapatma fonksiyonu
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAppId(null);
  };

  // Silme işlemi
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

  // Oturum kapatma işlemi
  const handleLogout = async () => {
    const confirmLogout = await new Promise((resolve) => {
      toast(
        (t) => (
          <span>
            Oturumu kapatmak istediğinizden emin misiniz?
            <br />
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              style={{
                marginRight: "8px",
                color: "white",
                backgroundColor: "red",
                padding: "5px",
                border: "none",
              }}
            >
              Evet
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              style={{ padding: "5px", border: "none" }}
            >
              Hayır
            </button>
          </span>
        ),
        {
          duration: Infinity,
        }
      );
    });

    if (confirmLogout) {
      logout();
      setIsOpen(false);
    }
  };

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <>
      <Toaster />
      <MenuIcon
        ref={iconRef}
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        isDocsModalOpen={isDocsModalOpen}
      >
        <svg
          className={`ham hamRotate ham8 ${isOpen ? "active" : ""}`}
          viewBox="0 0 100 100"
          width="40"
        >
          <path
            className="line top"
            d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
          />
          <path className="line middle" d="m 30,50 h 40" />
          <path
            className="line bottom"
            d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
          />
        </svg>
      </MenuIcon>
      <Overlay isOpen={isOpen} isDocsModalOpen={isDocsModalOpen} />
      <MenuContainer isOpen={isOpen} ref={menuRef}>
        <MenuHeader>
          <UserAvatar />
        </MenuHeader>
        <MenuContent>
          <StyledNavLink style={{ marginLeft: "12px" }} onClick={openDocsModal}>
            <HiDocument size={26} style={{ color: "var(--color-grey-924)" }} />
            <span style={{ fontSize: "18px" }}>Tüm Belgeler</span>
          </StyledNavLink>
          <div className="mobile-scrolldiv">
            {applications.map((app) => (
              <MobileNavLinkContainer key={app.id}>
                <NavLink
                  to={`/dashboard/${app.id}`}
                  className={({ isActive }) =>
                    isActive
                      ? "mobile-navlink mobile-navlink-active"
                      : "mobile-navlink"
                  }
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <AppInfo>
                    <AppTitle>{app.ans_country}</AppTitle>
                    <AppSubtitle>
                      {app.ans_purpose} - {app.ans_profession}
                    </AppSubtitle>
                  </AppInfo>
                </NavLink>
                {applications.length > 1 && (
                  <ActionButton
                    onClick={(e) => openDeleteModal(app.id, e)}
                    aria-label="Vize başvurusunu sil"
                    title="Vize başvurusunu sil"
                  >
                    <MdDelete />
                  </ActionButton>
                )}
              </MobileNavLinkContainer>
            ))}
          </div>
          <StyledNavLink
            style={{ marginLeft: "12px" }}
            onClick={() => {
              navigate("/wellcome-2");
              setIsOpen(false);
            }}
          >
            <HiPlus size={26} style={{ color: "var(--color-grey-924)" }} />
            <span style={{ fontSize: "18px" }}>Yeni</span>
          </StyledNavLink>

          <Divider />
          
            <StyledNavLink
              style={{ marginLeft: "12px" }}
              onClick={handleLogout}
            >
               <IconLogout />
              <span style={{color: "rgb(229, 57, 53)"}}>
               
                Oturumu Kapat
              </span>
            </StyledNavLink>
            <StyledNavLink
              style={{ marginLeft: "12px" }}
              onClick={handleLogout}
            >
              <IconSettings />
              <span style={{ fontSize: "18px" }}>
                
                Profil Ayarları
              </span>
            </StyledNavLink>
          
        </MenuContent>
      </MenuContainer>

      {/* Silme Onay Modalı */}
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

      {/* Yeni Tüm Belgeler Modal */}
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
              &times;
            </DocsModalCloseButton>

            <AllDocs />
          </DocsModalContainer>
        </DocsModalOverlay>
      )}
    </>
  );
};

export default MobileMenu;
