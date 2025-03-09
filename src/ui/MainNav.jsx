/* eslint-disable no-unused-vars */
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { HiDocument, HiPlus } from "react-icons/hi2";
import { MdClose, MdDelete } from "react-icons/md"; // Silme ikonu için MdDelete eklendi
import AllDocs from "./AllDocs";
import { useContext, useEffect, useState } from "react";
import { useDocuments } from "../context/DocumentsContext";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserSelectionsNav,
  fetchUserSelectionsDash,
} from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import { useVisaApplications } from "../context/VisaApplicationContext";

import toast, { Toaster } from "react-hot-toast";
import { deleteVisaApplication } from "../services/apiDeleteVisaApp";
import ModalDocs from "./ModalDocs";

// Glow Button animasyonu için gerekli keyframes
const glowing = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
`;

// Silme animasyonu
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

// Modal için animasyonlar
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

// Glow efektli buton
const GlowButton = styled.button`
  width: 220px;
  height: 50px;
  border: none;
  outline: none;
  font-weight: bold;
  color: var(--color-grey-913);
  background: var(--color-grey-914);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;

  &:before {
    content: "";
    background: linear-gradient(
      -45deg,
      #004466,
      #004466,
      #87f9cd,
      #87f9cd,
      #87f9cd,
      #004466,
      #004466
    );
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    animation: ${glowing} 20s linear infinite;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    border-radius: 10px;
  }

  &:after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--color-grey-914);
    left: 0;
    top: 0;
    border-radius: 10px;
  }

  &:hover {
    color: #004466;
  }

  &:hover:after {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    color: #000;
  }

  &:active:after {
    background: transparent;
  }

  @media (max-width: 1300px) {
    width: 180px;
  }

  @media (max-width: 1050px) {
    width: 150px;
    font-size: 14px;
  }
`;

const NavList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
  @media (max-width: 710px) {
    display: none;
  }
`;

// Yeni silme butonu tasarımı
const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: absolute;
  right: 16px;
  margin-left: auto;
  opacity: 0;
  transform: scale(0.8);

  & svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    transform: scale(1.1);
  }

  @media (max-width: 1300px) {
    width: 28px;
    height: 28px;
    right: 8px;
    & svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  min-height: 65px;
  width: 90%;
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 50px; /* Silme butonu için daha fazla alan */

  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    background-color: transparent;
    position: relative;
    @media (max-width: 1300px) {
      gap: 0.6rem;
      font-size: 14px;
      width: 150px;
      padding-right: 40px;
    }
    @media (max-width: 1050px) {
      width: 130px;
      gap: 8px;
      font-size: 13px;
      padding-right: 36px;
    }
  }

  &.active:visited,
  &.active:link {
    width: 100%;
    background: var(--color-grey-905);
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }

  /* Hover durumunda silme butonunu göster */
  &:hover ${ActionButton} {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
`;

// Yeni modal overlay
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
  z-index: 1000;
  opacity: 0;
  animation: ${fadeIn} 0.3s forwards;
`;

// Yeni modal tasarımı
const ConfirmationModal = styled.div`
  background-color: var(--color-grey-914);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  animation: ${modalFadeIn} 0.3s ease;
  border: 1px solid var(--color-grey-920);

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: var(--color-grey-600);

  svg {
    margin-right: 12px;
    color: #e74c3c;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
`;

const ModalContent = styled.p`
  color: var(--color-grey-600);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--color-grey-920);
  color: var(--color-grey-600);

  &:hover {
    background-color: var(--color-grey-905);
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

const ScrollableDiv = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-grey-920);
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  width: 110%;
  margin: 0 auto;
  margin-left: -10px;
  @media (max-width: 1300px) {
    width: 112%;
  }
  @media (max-width: 1050px) {
    width: 117%;
    gap: 4px;
  }
  @media (max-height: 830px) {
    max-height: 250px;
  }
  @media (max-height: 700px) {
    max-height: 150px;
  }
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-920);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
`;

const AllDocsButton = styled(NavLink)`
  flex-shrink: 0;
  min-height: 65px;
  width: 90%;
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    background-color: transparent !important;
    position: relative;
    @media (max-width: 1300px) {
      gap: 0.6rem;
      font-size: 14px;
      width: 150px;
    }
    @media (max-width: 1050px) {
      width: 200px !important;
      margin-left: -10px;
      gap: 8px;
      font-size: 13px;
    }
  }

  &:hover {
    transform: scale(1.05);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: #004466;
    transition: all 0.3s;
  }

  &:hover svg {
    color: #00ffa2; /* İconun hover durumunda sarı renge dönüşmesi */
  }
`;

// Uygulama bilgisini görüntülemek için stil
const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 120px; /* Silme butonu için yer açmak için biraz daha dar */
  overflow: hidden;

  @media (max-width: 1300px) {
    max-width: 100px;
  }

  @media (max-width: 1050px) {
    max-width: 80px;
  }
`;

const AppTitle = styled.span`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AppSubtitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9em;
  opacity: 0.8;
`;

function MainNav() {
  const [userId, setUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const navigate = useNavigate();
  const { id: applicationId } = useParams();
  const {
    state: { completedDocuments },
    dispatch: documentsDispatch,
  } = useDocuments();
  const { setSelectedDocument } = useSelectedDocument();
  const {
    applications,
    refreshApplications,
    dispatch: applicationsDispatch,
  } = useVisaApplications();

  useEffect(() => {
    refreshApplications();
  }, [applicationId]);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const userSelectionsQuery = useQuery({
    queryKey: ["userSelectionsNav", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  const documentNames = userSelectionsQuery.data
    ? getDocumentsForSelections(userSelectionsQuery.data)
    : [];

  const documentsQuery = useQuery({
    queryKey: ["documentDetailsNav", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  const continueToDocument = () => {
    if (!documentsQuery.data) return;

    const firstIncompleteIndex = documentsQuery.data.findIndex(
      (doc) =>
        !completedDocuments[applicationId] ||
        !completedDocuments[applicationId][doc.docName]
    );

    if (firstIncompleteIndex !== -1) {
      const selectedDocument = documentsQuery.data[firstIncompleteIndex];
      setSelectedDocument(selectedDocument);
      navigate(`/documents/${selectedDocument.id}`);
    }
  };

  // Modal açma fonksiyonu
  const openDeleteModal = (appId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAppId(appId);
    setShowDeleteModal(true);
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

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <nav className="navbar-dash">
      <Toaster />
      <GlowButton onClick={continueToDocument}>Devam et</GlowButton>
      <NavList>
        <li>
          <ModalDocs>
            <ModalDocs.Open opens="allDocs">
              <AllDocsButton style={{ width: "100%" }}>
                <HiDocument
                  className="mainnavicons"
                  style={{ color: "var(--color-grey-924)" }}
                />
                <span className="sidebartext">Tüm belgeler</span>
              </AllDocsButton>
            </ModalDocs.Open>
            <ModalDocs.Window name="allDocs">
              <AllDocs style={{ color: "var(--color-grey-924)" }} />
            </ModalDocs.Window>
          </ModalDocs>
        </li>
        <ScrollableDiv>
          {applications.map((app) => (
            <li className="mainnav-buzlucam" key={app.id}>
              <StyledNavLink to={`/dashboard/${app.id}`}>
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
                    <MdDelete />
                  </ActionButton>
                )}
              </StyledNavLink>
            </li>
          ))}
        </ScrollableDiv>
        <li>
          <AllDocsButton to="/wellcome-2">
            <HiPlus
              className="mainnavicons"
              style={{ color: "var(--color-grey-924)" }}
            />
            <span className="sidebartext">Yeni</span>
          </AllDocsButton>
        </li>
      </NavList>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <ModalOverlay onClick={closeDeleteModal}>
          <ConfirmationModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <MdDelete size={24} />
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
    </nav>
  );
}

export default MainNav;
