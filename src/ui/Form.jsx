import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;
      height: 540px;
      width: 420px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      margin-left: auto;
      margin-right: auto;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: 20px;
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}

  ${(props) =>
    props.type === "light-mode" &&
    css`
      filter: drop-shadow(10px 40px 220px #07ff9c);
      box-shadow: 100px 35px 3000px -100px #004466;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

Form.defaultProps = {
  type: "regular",
};
export default Form;
