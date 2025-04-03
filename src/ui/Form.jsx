import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 40px 24px;
      max-width: 420px;
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
        padding: 22px 12px;
        @media (max-height: 800px) {
          padding: 16px 12px;
        }
      }
      @media (max-width: 380px) {
        width: 100vw!important;
        height: auto;

      }
     
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
