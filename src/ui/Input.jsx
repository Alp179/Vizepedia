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
  @media (max-height: 725px) {
    width: 250px!important;
    height: 38px!important;
  }
  @media (max-width: 370px) {
    width: calc(100vw - 20px)!important;
  }
`;

export default Input;
