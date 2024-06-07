import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header";
import BackButton from "./BackButton";
import MobileMenu from "./MobileMenu";

const StyledAppLayout = styled.div`
  background: var(--color-grey-1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const Main = styled.main`
  background: var(--color-grey-1);
  padding: 4rem 4.8rem 6.4rem;
  width: 100%; // Genişliği %100 yaparak tam ekran kaplamasını sağlıyoruz
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: space-between;
  flex: 1;
`;

const Container = styled.div`
  width: 800px; 
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  @media (max-width: 1100px) {
    width: 85%;
  }
  @media (max-width: 680px) {
    width: 100%;
    gap: 0;
    margin: 0px;
  }
`;

function DocumentLayout() {
  return (
    <StyledAppLayout>
      <BackButton />
      <Header /> 
      <MobileMenu />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default DocumentLayout;
