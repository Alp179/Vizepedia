import { styled } from "styled-components";
import HeaderMenu from "./HeaderMenu";

import ProfileButton from "./ProfileButton";

const StyledHeader = styled.header`
  padding: 1.2rem 4.8rem;
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  @media (max-width: 500px) {
    display: none;
  }
`;

function Header() {
  return (
    <StyledHeader>
      <ProfileButton size="large" variaton="primary" />
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
