import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledMainPage = styled.div`
  min-height: 100vh;
  max-width: 100vw;
  display: flex;
  max-width: 100vw;
  flex-direction: column;
  background: var(--color-grey-1);
`;

const Main = styled.main`
  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
  @media (max-width: 710px) {
    &::-webkit-scrollbar {
      width: 0;
    }

    &::-webkit-scrollbar-track {
      background: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-brand-600);
      border-radius: 10px;
      border: 3px solid var(--color-grey-2);
    }
  }
`;

const Container = styled.div`
  max-width: 100vw;
  margin-top: 50px;
  @media (max-width: 1225px) {
    margin: 32px 0 0 0;
  }
`;


function AppLayout() {
  return (
    <StyledMainPage>
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledMainPage>
  );
}

export default AppLayout;
