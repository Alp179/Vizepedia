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
      @media (max-width: 1425px) {
        margin-left: -100px;
      }
      @media (max-width: 710px) {
        margin-left: -100px;
        width: 250px;
        @media (max-height: 830px) {
          font-size: 2.6rem;
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
        margin-top: 40px;
        font-size: 2.2rem;
      }
      @media (max-width: 450px) {
        margin-top: 30px;
        margin-bottom: 0px;
        width: 300px;
        font-size: 2rem;
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
      ${(props) =>
    props.as === "h7" &&
    css`
      font-size: 2.2rem;
      font-weight: bold;
      @media (max-width: 850px) {
        font-size: 2rem;
      }
      @media (max-width: 450px) {
        font-size: 1.8rem;
      }
    `}
        ${(props) =>
    props.as === "h8" &&
    css`
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      padding: 8px 0px 8px 0px;
      @media (max-height: 825px) {
        font-size: 18px;
      }
      @media (max-height: 770px) {
        padding-bottom: 0;
      }
    `}
          ${(props) =>
    props.as === "h9" &&
    css`
      text-align: center;
      font-size: 16px;
      margin: 4px 0 -4px 0;
      font-weight: bold;
      @media (max-height: 825px) {
        font-size: 12px;
      }
    `}

    line-height:1.4;
`;

export default Heading;
