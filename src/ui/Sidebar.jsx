import { styled } from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import BlogLogo from "./BlogLogo";
// import Uploader from "../data/Uploader";

const StyledSidebar = styled.aside`
  z-index: 2990;
  background: var(--color-grey-2);
  padding: 3.2rem 2.4rem;
  box-shadow: 0px 4px 24px -1px rgba(0, 0, 0, 0.2);
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  @media (max-width: 710px) {
    display: none;
    z-index: -1;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 80%;
  margin: 20px auto 10px auto;
  background: var(--color-grey-600);
  @media (max-height: 800px) {
    margin: 10px auto 0 auto;
  }
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo variant="dash" />
      <MainNav />
      {/* <Uploader /> */}
      <Divider />
      <BlogLogo variant="sidebar"/>
    </StyledSidebar>
  );
}

export default Sidebar;
