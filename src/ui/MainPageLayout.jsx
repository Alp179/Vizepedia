import { Outlet } from "react-router-dom";
import styled from "styled-components";
import MainPageHeader from "./MainPageHeader";
import { useState } from "react";

const StyledMainPage = styled.div`
  height: 100vh;
  overflow: hidden;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  background: var(--color-grey-1);
`;

const Main = styled.main`
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 100vh;
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
  padding-top: 100px;
  @media (max-width: 1225px) {
    margin: 32px 0 0 0;
  }
  @media (max-width: 870px) {
    padding-top: 50px;
  }
`;

function AppLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false); // Menü açık mı kontrol et
  return (
    <StyledMainPage>
      <MainPageHeader setMenuOpen={setMenuOpen} />
      <Main>
        <Container style={{ filter: isMenuOpen ? "blur(5px)" : "none" }}>
          <Outlet />
        </Container>
      </Main>
    </StyledMainPage>
  );
}

export default AppLayout;
