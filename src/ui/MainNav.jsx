/* eslint-disable no-unused-vars */
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { HiDocument, HiPlus } from "react-icons/hi2";
import { MdClose } from "react-icons/md"; // Çarpı işareti için icon import
import Button from "./Button";
import Modal from "./Modal";
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

import toast, { Toaster } from "react-hot-toast"; // React Hot Toast import
import { deleteVisaApplication } from "../services/apiDeleteVisaApp";

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

const StyledNavLink = styled(NavLink)`
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
    }
    @media (max-width: 1050px) {
      font-size: 14px;
    }
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
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

  &:hover .delete-button {
    display: flex;
    animation: ${fadeIn} 0.3s forwards;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  margin-left: 10px;
  position: absolute;
  right: 10px;
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;

  &:hover {
    color: darkred;
  }

  &:hover .icon {
    opacity: 0;
    transform: scale(0.5);
  }

  &:hover .tooltip {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }

  ${StyledNavLink}:hover & {
    display: flex;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  top: 0%;
  left: -15%;
  transform: translate(-50%, -50%) scale(0.5);
  background: red;
  color: white;
  padding: 1.5rem 1.7rem;
  border-radius: 3px;
  font-size: 1.3rem;
  opacity: 0;
  display: none;
  transition: opacity 1.3s ease-in-out, transform 1.3s ease-in-out;
`;

const ScrollableDiv = styled.div`
  overflow-y: auto;
  max-height: 250px;
  width: 110%;
  margin: 0 auto;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-brand-600);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
`;

function MainNav() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    state: { completedDocuments },
    dispatch: documentsDispatch,
  } = useDocuments();
  const { setSelectedDocument } = useSelectedDocument();
  const { applications, dispatch: applicationsDispatch } =
    useVisaApplications();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const userSelectionsQuery = useQuery({
    queryKey: ["userSelectionsNav", userId, id],
    queryFn: () => fetchUserSelectionsDash(userId, id),
    enabled: !!userId && !!id,
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
      (doc) => !completedDocuments[id] || !completedDocuments[id][doc.docName]
    );

    if (firstIncompleteIndex !== -1) {
      const selectedDocument = documentsQuery.data[firstIncompleteIndex];
      setSelectedDocument(selectedDocument);
      navigate(`/documents/${selectedDocument.id}`);
    }
  };

  const handleDelete = async (appId) => {
    const confirmDelete = await new Promise((resolve) => {
      toast(
        (t) => (
          <span>
            Bu vize başvurusunu silmek istediğinizden emin misiniz?
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

    if (confirmDelete) {
      try {
        await deleteVisaApplication(appId);
        // Başarıyla silindikten sonra, state'i güncelle
        applicationsDispatch({ type: "DELETE_APPLICATION", payload: appId });
        toast.success("Vize başvurusu başarıyla silindi!");
        // Sayfayı yeniden yükleyerek tüm sayfanın render edilmesini sağla
        navigate("/dashboard"); // Burada navigate kullanarak /dashboard'a yönlendiriyoruz
      } catch (error) {
        toast.error("Vize başvurusu silinemedi.");
      }
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
      <Button size="dash" variation="primary" onClick={continueToDocument}>
        Devam et
      </Button>
      <NavList>
        <li>
          <Modal>
            <Modal.Open opens="allDocs">
              <StyledNavLink>
                <HiDocument /> <span className="sidebartext">Tüm belgeler</span>
              </StyledNavLink>
            </Modal.Open>
            <Modal.Window name="allDocs">
              <AllDocs />
            </Modal.Window>
          </Modal>
        </li>
        <ScrollableDiv>
          {applications.map((app) => (
            <li key={app.id} style={{ display: "flex", alignItems: "center" }}>
              <StyledNavLink to={`/dashboard/${app.id}`}>
                {app.ans_country} - {app.ans_purpose} - {app.ans_profession}
                {applications.length > 1 && (
                  <DeleteButton
                    className="delete-button"
                    onClick={() => handleDelete(app.id)}
                  >
                    <MdClose size={20} className="icon" />
                    <Tooltip className="tooltip">Sil</Tooltip>
                  </DeleteButton>
                )}
              </StyledNavLink>
            </li>
          ))}
        </ScrollableDiv>
        <li>
          <StyledNavLink to="/wellcome-2">
            <HiPlus /> <span className="sidebartext">Yeni</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
