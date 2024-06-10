import styled, { css } from "styled-components";

// const test = css`
//   text-align: center;
// background-color: yellow;
// `;

const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      @media (max-width: 1100px) {
        margin-left: -50px;
      }
      @media (max-width: 710px) {
        margin-top: 40px;
        margin-left: -100px;
        @media (max-height: 830px) {
          font-size: 2.4rem;
          margin-bottom: -30px;
        }
      }
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
      @media (max-width: 750px) {
        font-size: 1.5rem;
      }
      @media (min-width: 750px) {
        @media (max-height: 800px) {
          font-size: 1.5rem;
        }
      }
    `}

    ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}

    ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
      @media (max-width: 450px) {
        font-size: 2.5rem;
      }
    `}
    ${(props) =>
    props.as === "h5" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
      @media (max-width: 850px) {
        font-size: 2.5rem;
      }
      @media (max-width: 710px) {
        margin-top: 90px;
        font-size: 2.2rem;
      }
    `}
    ${(props) =>
      props.as === "h6" &&
      css`
        font-size: 3rem;
        font-weight: 600;
        text-align: center;
        @media (min-width: 750px) {
          @media (max-height: 800px) {
            font-size: 2.2rem;
          }
        }
        @media (max-width: 750px) {
          font-size: 2.2rem;
        }
      `}
    

    line-height:1.4;
`;

export default Heading;
