import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import styled from "styled-components";

const StyledHeader = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const LogoContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 320px) {
    width: 100%;
  }
`;

function DashboardMobileHeader() {
  return (
    <StyledHeader>
      <LogoContainer>
        <BlogLogo variant="dashmobile" />
        <Logo variant="dashmobile" />
      </LogoContainer>
    </StyledHeader>
  );
}

export default DashboardMobileHeader;
