/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiDocument,
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineUser,
  HiOutlineUsers,
  HiPlus,
} from "react-icons/hi2";
import Button from "./Button";
import Modal from "./Modal";
import AllDocs from "./AllDocs";
import { useContext, useEffect, useState } from "react";
import { DocumentsContext, useDocuments } from "../context/DocumentsContext";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelections } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
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
  }

  /* This works because react-router places the active class on the active NavLink */
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
`;

function MainNav() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { state: completedDocuments, dispatch } = useDocuments();
  const { setSelectedDocument } = useSelectedDocument();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const userSelectionsQuery = useQuery({
    queryKey: ["userSelections", userId],
    queryFn: () => fetchUserSelections(userId),
    enabled: !!userId,
  });

  const documentNames = userSelectionsQuery.data
    ? getDocumentsForSelections(userSelectionsQuery.data)
    : [];

  const documentsQuery = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  const continueToDocument = () => {
    if (!documentsQuery.data) return;
    const firstIncompleteIndex = documentsQuery.data.findIndex(
      (doc) => !completedDocuments[doc.docName]
    );

    if (firstIncompleteIndex !== -1) {
      const selectedDocument = documentsQuery.data[firstIncompleteIndex];
      setSelectedDocument(selectedDocument);
      navigate("/documents");
    }
  };

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <nav>
      <Button size="large" variation="primary" onClick={continueToDocument}>
        Devam et
      </Button>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiPlus /> <span>Yeni</span>
          </StyledNavLink>
        </li>
        <li>
          <Modal>
            <Modal.Open opens="allDocs">
              <StyledNavLink to="/dashboard">
                <HiDocument /> <span>Tüm belgeler</span>
              </StyledNavLink>
            </Modal.Open>
            <Modal.Window name="allDocs">
              <AllDocs />
            </Modal.Window>
          </Modal>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
