/* eslint-disable no-unused-vars */
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { HiDocument, HiPlus } from "react-icons/hi2";
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

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
  @media (max-width: 1300px) {
    gap: 0.4rem;
    margin-left: -10px;
  }
  @media (max-width: 1050px) {
    margin-top: 10px;
    margin-left: -17px;
  }
  @media (max-width: 710px) {
    display:none;
    width: 0;
  }
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
`;

function MainNav() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    state: { completedDocuments },
    dispatch,
  } = useDocuments();
  const { setSelectedDocument } = useSelectedDocument();
  const { applications } = useVisaApplications();

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

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <nav className="navbar-dash">
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
        {applications.map((app) => (
          <li key={app.id}>
            <StyledNavLink to={`/dashboard/${app.id}`}>
              {app.ans_country} Visa - {app.ans_purpose} - {app.ans_profession}
            </StyledNavLink>
          </li>
        ))}
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
