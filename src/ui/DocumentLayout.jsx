import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header";
import BackButton from "./BackButton";

const StyledAppLayout = styled.div`
  background: var(--color-grey-1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%; // Genişliği %100 yaparak tam ekran kaplamasını sağlıyoruz
`;

const Main = styled.main`
  background-color: var(--color-grey-1);
  padding: 4rem 4.8rem 6.4rem;
  width: 100%; // Genişliği %100 yaparak tam ekran kaplamasını sağlıyoruz
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: space-between;
  flex: 1;
`;

const Container = styled.div`
  width: 70%; // Genişliği %100 yaparak tam ekran kaplamasını sağlıyoruz
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  @media (max-width: 500px) {
    width: 100%;
    gap: 0;
    margin: 0px;
  }
`;

function DocumentLayout() {
  return (
    <StyledAppLayout>
      <BackButton />
      <Header /> {/* Header bileşeni burada üstte olacak */}
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default DocumentLayout;
