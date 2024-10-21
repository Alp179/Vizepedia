import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

const StyledBlogLogo = styled.div`
cursor: pointer;
transition: filter 0.5s ease, transform 0.5s ease; /* Renk ve dönüşüm animasyonu */

&:hover {
  filter: ${(props) =>
    props.isDarkMode
      ? "hue-rotate(280deg)"  /* Dark Mode: Renk tonu değişimi */
      : "hue-rotate(360deg)"}; /* Light Mode: Farklı renk tonu değişimi */
  transform: scale(1.05); /* Hafif büyütme efekti */
}
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
        width: 140px;
        position: relavite;
      }
      @media (max-width: 1050px) {
        transform: translate(-50%, -50%);
      }
      @media (max-width: 910px) {
        width: 120px;
      }
      @media (max-width: 710px) {
        width: 100px;
      }
      @media (max-width: 380px) {
        width: 80px;
        left: 45%;
      }
      @media (max-width: 350px) {
        left: 20%;
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
        width: 100px;
      }
      @media (max-width: 380px) {
        width: 75px;
      }
    `}

        ${(props) =>
    props.variant === "overview" &&
    css`
      width: 184px;
      height: auto;
      flex-shrink: 0;
      @media (max-width: 1250px) {
        width: 135px;
      }
      @media (max-width: 710px) {
        width: 123px;
        margin-top: 32px;
      }
      @media (max-width: 325px) {
        width: 110px;
      }
    `}

    ${(props) =>
    props.variant === "mainpage3" &&
    css`
      width: 140px;
      margin-left: auto;
      margin-right: auto;
      height: auto;
      @media (max-width: 600px) {
        width: 120px;
      }
    `}
      ${(props) =>
    props.variant === "dashdropdown" &&
    css`
      width: 105px;
      margin: 0 auto 4px auto;
      height: auto;
      flex-shrink: 0;
    `}
    ${(props) =>
    props.variant === "mobilemenu" &&
    css`
      width: 130px;
      height: auto;
    `}
    ${(props) =>
    props.variant === "sidebar" &&
    css`
      margin-left: auto;
      margin-right: auto;
      width: 80%;
      height: auto;
    `}
    ${(props) =>
    props.variant === "dashmobile" &&
    css`
    mix-blend-mode: difference;
      width: 130px;
      height: auto;
      flex-shrink: 0;
      @media (max-width: 550px) {
        width: 110px;
      }
      @media (max-width: 450px) {
        width: 85px;
      }
      @media (max-width: 380px) {
        width: 80px;
      }
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

function BlogLogo({ variant }) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/blog"); // Logo'ya tıklandığında /mainpage'e yönlendiriyoruz
  };

  const src = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-darkmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWRhcmttb2RlLnBuZyIsImlhdCI6MTcyODE0MTExNSwiZXhwIjo0NDI4OTY5NjM1NTE1fQ.DJfCjO8CPxbxmTwr9wacpvI3XFBcmFvjO-jvWVQfp9k&t=2024-10-05T15%3A11%3A56.016Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-lightmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWxpZ2h0bW9kZS5wbmciLCJpYXQiOjE3MjgxNDExMzIsImV4cCI6MzU2NDk2OTYzNTUzMn0.o5K7iHOeB2PbLuq24iVqbukYV2MLEjOXbCfECMLj20w&t=2024-10-05T15%3A12%3A13.053Z";

  return (
    <StyledBlogLogo onClick={handleLogoClick} variant={variant}>
      <Img src={src} alt="Blog-Logo" />
    </StyledBlogLogo>
  );
}

BlogLogo.propTypes = {
  variant: PropTypes.string, // Define the expected type for `variant`
};

export default BlogLogo;
