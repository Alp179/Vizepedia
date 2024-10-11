import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { HiDocument, HiPlus } from "react-icons/hi";
import { MdClose } from "react-icons/md";
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
import DarkModeToggle from "./DarkModeToggle";
import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import toast from "react-hot-toast";
import { deleteVisaApplication } from "../services/apiDeleteVisaApp";

const MenuIcon = styled.div.attrs((props) => ({
  style: { display: props.isDocsOpen ? "none" : "block" },
}))`
  background: ${(props) =>
    props.isOpen ? "transparent" : "rgba(255, 255, 255, 0.5)"};
  border-radius: 6px;
  display: flex;
  height: 42px;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 3000;
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

const MenuHeader = styled.div`
  z-index: 3000;
  display: flex;
  justify-content: flex-start;
  gap: 42px;
  align-items: center;
  @media (max-width: 330px) {
    gap: 16px;
  }
`;

const MenuContent = styled.div`
  z-index: 3000;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledNavLink = styled.div`
  width: 86%;
  z-index: 3000;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  &:hover {
    background-color: var(--color-grey-3);
  }
`;

const DeleteButton = styled.button`
  background: none;
  z-index: 3000;
  border: none;
  color: red;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    color: darkred;
  }
`;

const Overlay = styled.div`
  position: fixed;
  backdrop-filter: blur(4px);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backdrop-color);
  z-index: 1100;
  display: ${(props) => (props.isOpen || props.isDocsOpen ? "block" : "none")};
`;

const FullScreenModal = styled.div`
  z-index: 3000;
  position: fixed;
  top: 50%;
  left: 50%;
  background-color: var(--color-grey-51);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 100px);
  max-width: 450px;
  height: calc(100vh - 200px);
  max-height: 720px;
  justify-content: space-between;
  transform: ${(props) =>
    props.isClosing ? "translate(100%, -50%)" : "translate(-50%, -50%)"};
  transition: transform 0.3s ease-in-out;
  @media (max-width: 450px) {
    width: 90% !important;
    height: 75% !important;
  }
  @media (max-height: 700px) {
    height: 75%;
  }
  @media (max-width: 450px) {
    @media (max-height: 675px) {
      height: 80% !important;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 36px;
  cursor: pointer;
`;

const Divider = styled.div`
  height: 1px;
  width: 95%;
  background: var(--color-grey-600);
  margin: 8px auto 8px auto;
`;

const LogoContainer = styled.div`
margin-top: 12px;
margin-left: 12px;
display: flex;
flex-direction: column;
justify-content: center;
gap: 16px;
`

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { applications, dispatch: applicationsDispatch } =
    useVisaApplications();
  const { setSelectedDocument } = useSelectedDocument();
  const { state: completedDocuments } = useDocuments();
  const [userId, setUserId] = useState(null);
  const menuRef = useRef();
  const iconRef = useRef();

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

  useEffect(() => {
    const handleBackButton = (event) => {
      if (isDocsOpen) {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isDocsOpen]);

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

  /* eslint-disable no-unused-vars */
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

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDocsOpen(false);
      setIsClosing(false);
    }, 300);
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
        applicationsDispatch({ type: "DELETE_APPLICATION", payload: appId });
        toast.success("Vize başvurusu başarıyla silindi!");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Vize başvurusu silinemedi.");
      }
    }
  };

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
      <MenuIcon
        ref={iconRef}
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        isDocsOpen={isDocsOpen}
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
      <Overlay isOpen={isOpen} isDocsOpen={isDocsOpen} /> {/* Blur efekt */}
      <MenuContainer isOpen={isOpen} ref={menuRef}>
        <MenuHeader>
          <UserAvatar />
          <DarkModeToggle />
        </MenuHeader>
        <MenuContent>
          <StyledNavLink
            onClick={() => {
              setIsDocsOpen(true);
              setIsOpen(false);
            }}
          >
            <HiDocument /> Tüm Belgeler
          </StyledNavLink>
          <div className="mobile-scrolldiv">
            {applications.map((app) => (
              <div
                key={app.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <StyledNavLink
                  onClick={() => {
                    navigate(`/dashboard/${app.id}`);
                    setIsOpen(false);
                  }}
                >
                  {app.ans_country} Visa - {app.ans_purpose} -{" "}
                  {app.ans?.profession}
                </StyledNavLink>
                {applications.length > 1 && (
                  <DeleteButton onClick={() => handleDelete(app.id)}>
                    <MdClose size={20} />
                  </DeleteButton>
                )}
              </div>
            ))}
          </div>
          <StyledNavLink
            onClick={() => {
              navigate("/wellcome-2");
              setIsOpen(false);
            }}
          >
            <HiPlus /> Yeni
          </StyledNavLink>
          <StyledNavLink onClick={handleLogout}>Oturumu Kapat</StyledNavLink>
          <Divider />
          <LogoContainer>
            <Logo variant="mobilemenu" />
            <BlogLogo variant="mobilemenu" />
          </LogoContainer>
        </MenuContent>
      </MenuContainer>
      {isDocsOpen && (
        <FullScreenModal isClosing={isClosing}>
          <CloseButton
            onClick={() => {
              closeModal();
            }}
          >
            ×
          </CloseButton>
          <AllDocs />
        </FullScreenModal>
      )}
    </>
  );
};

export default MobileMenu;
