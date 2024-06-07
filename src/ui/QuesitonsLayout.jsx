import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import BackButton from "./BackButton";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 7rem;
  background: var(--color-grey-1);
`;

const Container = styled.div`
  width: 60%;
  margin: 0 auto;
`;

function QuestionsLayout() {
  // const navigate = useNavigate();

  return (
    <LoginLayout>
      <BackButton>Geri Dön</BackButton>
      <MobileMenu />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </LoginLayout>
  );
}

export default QuestionsLayout;
