import { Outlet } from "react-router-dom";

import Header from "./Header";
import { styled } from "styled-components";

import BackButton from "./BackButton";

const StyledAppLayout = styled.div`
  background: var(--color-grey-1);
  display: flex;
  height: 100%;
  max-width: 100%;
`;

const Main = styled.main`
  background-color: var(--color-grey-1);
  padding: 4rem 4.8rem 6.4rem;
  max-height: 100%;
  width: 100%;
  display: flex;
  margin-left: 50px;
  margin-top: -40px;
  flex-direction: column;
  gap: 50px;
  justify-content: space-between;
 
`;

const Container = styled.div`
  width: 70%;
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
