import styled from "styled-components";

export const Input = styled.input`
  height: 44px;
  width: 371px;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  @media (max-width: 450px) {
    width: 306px;
    height: 44px;
  }
`;

export default Input;
