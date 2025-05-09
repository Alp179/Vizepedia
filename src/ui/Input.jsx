import styled from "styled-components";

export const Input = styled.input`
  margin: 0 auto;
  height: 44px;
  width: 360px;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  @media (max-width: 450px) {
    width: 350px;
    height: 38px;
    @media (max-height: 800px) {
      width: 306px ;
      height: 36px ;
      font-size: 13px;
    }
  }
  @media (max-width: 450px) {
    @media (max-width: 380px) {
      width: calc(100vw - 20px) ;
    }
  }
`;

export default Input;
