/* eslint-disable react/prop-types */
import { styled } from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // location bilgisini alıyoruz
  const { isAuthenticated, isLoading } = useUser();
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";

  useEffect(() => {
    if (!isAuthenticated && !isAnonymous && !isLoading) {
      navigate("/login");
    }

    // Modalın tetiklendiği bir durumu kontrol ediyoruz
    const modalOpen = location.state?.modalOpen;

    if (isAnonymous && location.pathname.startsWith("/dashboard") && !modalOpen) {
      navigate("/wellcome");
    }
  }, [isAuthenticated, isAnonymous, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  return isAuthenticated || isAnonymous ? children : null;
}

export default ProtectedRoute;
