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
        mix-blend-mode: difference;
        margin-left: -100px;
        width: 250px;
        @media (max-height: 830px) {
          font-size: 2.6rem;
        }
      }
      @media (max-width: 360px) {
        margin-left: -120px;
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
      color: var(--color-grey-904);
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
      @media (max-width: 300px) {
        width: 270px !important;
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
      color: var(--color-grey-904);
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
      color: var(--color-grey-904);
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
      @media (max-width: 400px) {
        font-size: 16px;
      }
    `}
          ${(props) =>
    props.as === "h9" &&
    css`
      color: var(--color-grey-904);
      text-align: center;
      font-size: 16px;
      margin: 4px 0 -4px 0;
      font-weight: bold;
      @media (max-height: 825px) {
        font-size: 12px;
      }
      @media (max-width: 400px) {
        font-size: 14px;
      }
    `}
    ${(props) =>
    props.as === "h10" &&
    css`
      color: var(--color-grey-904);
      font-size: 20px;
      font-weight: 600;
      @media (max-width: 1200px) {
        font-size: 18px;
      }
      @media (max-width: 870px) {
        display: none;
      }
    `}
      ${(props) =>
    props.as === "h11" &&
    css`
      color: var(--color-grey-904);
      font-size: 72px;
      font-weight: 600;
      max-width: 1100px;
      @media (max-width: 1200px) {
        font-size: 48px;
      }
      @media (max-width: 732px) {
        font-size: 36px;
      }
      @media (max-width: 360px) {
        font-size: 28px;
      }
    `}

        ${(props) =>
    props.as === "h12" &&
    css`
      color: var(--color-grey-904);
      max-width: 700px;
      font-size: 22px;
      font-weight: 600;
      @media (max-width: 1200px) {
        font-size: 20px;
      }
      @media (max-width: 732px) {
        font-size: 16px;
      }
    `}
    ${(props) =>
      props.as === "h13" &&
      css`
        color: var(--color-grey-904);
        max-width: 500px;
        font-size: 26px;
        @media (max-width: 1200px) {
          font-size: 20px;
        }
        @media (max-width: 970px) {
          max-width: 300px;
        }
        @media (max-width: 580px) {
          font-size: 16px;
          max-width: 200px;
        }
        @media (max-width: 370px) {
          max-width: 180px;
        }
        @media (max-width: 350px) {
          max-width: 150px;
        }
      `}
      ${(props) =>
        props.as === "h14" &&
        css`
          color: var(--color-grey-904);
          font-size: 72px;
          font-weight: 600;
          max-width: 1100px;
          @media (max-width: 1200px) {
            font-size: 48px;
          }
          @media (max-width: 732px) {
            font-size: 36px;
          }
          @media (max-width: 500px) {
            display: none;
          }
          
        `}
    
  

    line-height:1.4;
`;

export default Heading;
