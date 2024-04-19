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
