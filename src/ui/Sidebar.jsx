import { styled } from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
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
    z-index: -1;
  }
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo variant="dash" />
      <MainNav />
      {/* <Uploader /> */}
    </StyledSidebar>
  );
}

export default Sidebar;
