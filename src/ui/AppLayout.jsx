import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { styled } from "styled-components";

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
  backdrop-filter: blur(0px);
  padding: 4rem 4.8rem 6.4rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 100px;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
