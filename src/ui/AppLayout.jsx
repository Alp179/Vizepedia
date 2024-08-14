import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileMenu from "./MobileMenu"; // Yeni hamburger menü komponenti
import styled from "styled-components";

const StyledAppLayout = styled.div`
  overflow: clip;
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100dvh;
  background: var(--color-grey-1);
  @media (max-width: 1300px) {
    grid-template-columns: 22rem 1fr;
  }
  @media (max-width: 1050px) {
    grid-template-columns: 19rem 1fr;
  }
  @media (max-width: 830px) {
    grid-template-columns: 17rem 1fr;
  }
  @media (max-width: 710px) {
    grid-template-columns: 0 1fr;
  }
`;

const Main = styled.main`
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: clip;
  z-index: 1000;
  backdrop-filter: blur(0px);
  padding: 10rem 4.8rem 6.4rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  @media (max-width: 710px) {
    padding-top: 4rem;
  }
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
  max-width: 120rem;
  margin: 0 0 0 100px;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  @media (max-width: 710px) {
    height: 100vh;
  }
`;

const MobileMenuContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <MobileMenuContainer>
        <MobileMenu /> {/* Hamburger menü komponenti */}
      </MobileMenuContainer>
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
