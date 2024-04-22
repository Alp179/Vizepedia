import { Outlet } from "react-router-dom";

import Header from "./Header";
import { styled } from "styled-components";

import BackButton from "./BackButton";

const StyledAppLayout = styled.div`
  background: var(--color-grey-1);
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100dvh;
`;

const Main = styled.main`
  height: 100%;
  background-color: var(--color-grey-1);
  padding: 4rem 4.8rem 6.4rem;
  overflow: scroll;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function DocumentLayout() {
  return (
    <StyledAppLayout>
      <BackButton />
      <Main>
        <Header />
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default DocumentLayout;
