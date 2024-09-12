import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  ${(props) =>
    props.variant === "login" &&
    css`
      margin-right: auto;
      margin-left: auto;
      width: 125px;
      height: auto;
      @media (max-width: 370px) {
        width: 100px;
      }
    `}

  ${(props) =>
    props.variant === "dash" &&
    css`
      margin-right: auto;
      margin-left: auto;
      text-align: center;
      width: 80%;
      height: auto;
      @media (max-width: 710px) {
        display: none;
      }
    `}
    ${(props) =>
    props.variant === "mainpage" &&
    css`
      width: 165px;
      height: auto;
      flex-shrink: 0;
      @media (max-width: 1200px) {
        width: 120px;
      }
      @media (max-width: 732px) {
        width: 98px;
      }
    `}
      ${(props) =>
    props.variant === "mainpage2" &&
    css`
      width: 165px;
      height: auto;
      flex-shrink: 0;
      @media (max-width: 1200px) {
        width: 120px;
      }
      @media (max-width: 870px) {
        display: none;
      }
    `}
    ${(props) =>
    props.variant === "blogpage1" &&
    css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 165px;
      height: auto;
      flex-shrink: 0;
      @media (max-width: 1300px) {
        left: 20%;
        width: 140px;
        position: relavite;
        top: none;
        left: none;
      }
    `}
    ${(props) =>
      props.variant === "blogpage2" &&
      css`
        width: 165px;
        height: auto;
        flex-shrink: 0;
        @media (max-width: 1300px) {
          display: none;
        }
      `}
        ${(props) =>
    props.variant === "bulten" &&
    css`
      width: 227px;
      height: 65px;
      @media (max-width: 370px) {
        width: 180px;
        height: 40px;
      }
    `}

    ${(props) =>
    props.variant === "footer" &&
    css`
      width: 154px;
      height: 44px;
    `}
`;

const Img = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

function Logo({ variant }) {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/Varl_k_20_light_8x.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL1Zhcmxfa18yMF9saWdodF84eC5wbmciLCJpYXQiOjE3MjA5ODI4MjQsImV4cCI6NjgwNzk1NTYyNH0.q3TYM9XCjpsVsD7gQxFaQfRHTKqxhjHwLDzagSY1YY8&t=2024-07-14T18%3A47%3A05.607Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/Varl_k_20_8x.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL1Zhcmxfa18yMF84eC5wbmciLCJpYXQiOjE3MjA5ODIzNjUsImV4cCI6NzU2ODI3NTE2NX0.uo2NgeaGhKZjiNKp5qq4ikIZTlDCkRCZ21ENwcwldLE&t=2024-07-14T18%3A39%3A25.590Z";

  return (
    <StyledLogo variant={variant}>
      <Img src={src} alt="Logo" />
    </StyledLogo>
  );
}

Logo.propTypes = {
  variant: PropTypes.string, // Define the expected type for `variant`
};

export default Logo;
