/* eslint-disable react/prop-types */

import { styled } from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AnonymousDataService } from "../utils/anonymousDataService";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children, requireAuth = true }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();
  const isAnonymous = AnonymousDataService.isAnonymousUser();

  useEffect(
    function () {
      // Only redirect if authentication is strictly required
      if (requireAuth && !isAuthenticated && !isAnonymous && !isLoading) {
        navigate("/login");
      }
    },
    [isAuthenticated, isAnonymous, isLoading, navigate, requireAuth]
  );

  // While loading show a spinner
  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  // If authentication is required and user is not authenticated or anonymous
  if (requireAuth && !isAuthenticated && !isAnonymous) {
    return null; // Will redirect to login
  }

  // If authentication is not required or user is authenticated/anonymous
  return children;
}

export default ProtectedRoute;