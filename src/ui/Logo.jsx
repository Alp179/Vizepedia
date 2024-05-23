import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  ${(props) =>
    props.variant === "login" &&
    css`
      margin-top: -50px;
      margin-right: auto;
      margin-bottom: -20px;
      margin-left: auto;
      width: 180px;
      height: auto;
      @media (max-width: 450px) {
        margin-top: -100px;
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
        display:none;
      }
    `}
`;

const Img = styled.img``;

function Logo({ variant }) {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode
    ? "src/data/img/logo-dark.png"
    : "src/data/img/logo-light.png";

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
