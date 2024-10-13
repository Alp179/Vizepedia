import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import MobileMenu from "./MobileMenu";
import styled from "styled-components";

const StyledHeader = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 40px;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const MobileMenuContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
  position: absolute;
  justify-content: space-around;
  width: 60%;
  top: 15px;
  left: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
`;

function DashboardMobileHeader() {
  return (
    <StyledHeader>
      <LogoContainer>
        <BlogLogo variant="dashmobile" />
        <Logo variant="dashmobile" />
      </LogoContainer>
      <MobileMenuContainer>
        <MobileMenu />
      </MobileMenuContainer>
    </StyledHeader>
  );
}

export default DashboardMobileHeader;
