import styled from "styled-components";

import { Outlet } from "react-router-dom";
import Header from "./Header";

import BackButton from "./BackButton";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function QuestionsLayout() {
  // const navigate = useNavigate();

  return (
    <LoginLayout>
      <BackButton>Geri Dön</BackButton>
      <Header />
      <Outlet />
    </LoginLayout>
  );
}

export default QuestionsLayout;
