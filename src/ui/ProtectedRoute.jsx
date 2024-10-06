/* eslint-disable react/prop-types */

import { styled } from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
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
  // 1 Load the authenticated user
  const { isAuthenticated, isLoading } = useUser();

  // 2 Check if user is an anonymous user
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";

  //3 IF there is no authentication and not anonymous, redirect the user
  useEffect(
    function () {
      if (!isAuthenticated && !isAnonymous && !isLoading) navigate("/login");
    },
    [isAuthenticated, isAnonymous, isLoading, navigate]
  );

  //4 While loading show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  //5 If there is a user or anonymous access, render the children
  if (isAuthenticated || isAnonymous) return children;
}

export default ProtectedRoute;
