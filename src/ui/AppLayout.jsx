import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import DashboardMobileHeader from "./DashboardMobileHeader";
import MobileMenu from "./MobileMenu";
import SlideShow from "./SlideShow";

const StyledAppLayout = styled.div`
  overflow: clip;
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  max-width: 100vw; /* Viewport genişliğini aşmasını engelle */
  background: var(--color-grey-1);
  box-sizing: border-box; /* Box-sizing ekle */
  
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
    grid-template-columns: none;
    grid-template-rows: none;
    /* Mobilde overflow kontrolü */
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
  }
`;

const Main = styled.main`
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: clip;
  z-index: 1;
  backdrop-filter: blur(0px);
  padding: 10rem 0 0 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-sizing: border-box; /* Box-sizing ekle */
  
  @media (max-width: 710px) {
    padding-top: 4rem;
    /* Mobil overflow kontrolü */
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
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
  box-sizing: border-box; /* Box-sizing ekle */
  
  @media (max-width: 1550px) {
    margin-left: 150px;
  }
  
  @media (max-width: 710px) {
    width: 100%;
    max-width: 100vw; /* Viewport sınırı */
    margin-left: auto;
    margin-right: auto;
    padding: 0 10px; /* Yan padding ekle */
    /* Mobilde overflow kontrolü */
    overflow-x: hidden;
  }
  
  @media (max-width: 450px) {
    padding: 0 5px; /* Daha küçük padding */
  }
`;

const MobileMenuContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
  
  /* Mobil overflow kontrolü */
  @media (max-width: 710px) {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    box-sizing: border-box;
  }
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <DashboardMobileHeader />
      <MobileMenuContainer>
        <MobileMenu />
      </MobileMenuContainer>
      <Main>
        <Container>
          <Outlet />
        </Container>
        <SlideShow />
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;