import { styled } from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import BlogLogo from "./BlogLogo";
import DarkModeToggle from "./DarkModeToggle"
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

const BottomSection = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border-top: 1px solid var(--color-grey-600);
padding-top: 12px;
margin-top: auto;
margin-bottom: 12px;
`;


function Sidebar() {
  return (
    <StyledSidebar>
      <Logo variant="dash" />
      <MainNav />
      {/* <Uploader /> */}
      <BottomSection>
      <DarkModeToggle />
      <BlogLogo variant="sidebar"/>
      </BottomSection>
    </StyledSidebar>
  );
}

export default Sidebar;
