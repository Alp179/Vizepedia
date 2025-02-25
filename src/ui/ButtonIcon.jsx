import styled from "styled-components";

const ButtonIcon = styled.button`
  background: none;
  border: none;
  padding: 0.6rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  &:focus {
    outline: none;
  }
  &:hover {
    backdrop-filter: blur(40px);

  }

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-grey-924);
    &:hover {
      opacity: 0.5;
    }
  }
`;

export default ButtonIcon;
