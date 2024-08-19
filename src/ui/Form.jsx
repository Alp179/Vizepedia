import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;
      height: 540px;
      width: 420px;
      margin-left: auto;
      margin-right: auto;
      filter: var(--color-box-0);
      box-shadow: var(--color-box-1);
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      @media (max-width: 450px) {
        width: 358px;
        height: 540px;
      }
      @media (max-width: 370px) {
        width: 100%!important;
        height: auto;

      }
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

Form.defaultProps = {
  type: "regular",
};
export default Form;
