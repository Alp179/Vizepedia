import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

// Renklerin mor bölümünde parlama animasyonu
const shineEffect = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(102, 51, 255, 0)) brightness(1);
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(102, 51, 255, 0.6)) brightness(1.2);
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(102, 51, 255, 0)) brightness(1);
  }
`;

// Light mod için parlama animasyonu
const shineEffectLight = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(208, 204, 214, 0)) brightness(1);
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(208, 204, 214, 0.6)) brightness(1.2);
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(208, 204, 214, 0)) brightness(1);
  }
`;

const StyledBlogLogo = styled.div`
  cursor: pointer;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;

  &:hover {
    transform: scale(1.05);
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

      &:hover {
        transform: translate(-50%, -50%) scale(1.05);
      }

      @media (max-width: 1300px) {
        width: 140px;
        position: relavite;
      }
      @media (max-width: 1050px) {
        transform: translate(-50%, -50%);

        &:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }
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
      @media (max-width: 890px) {
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
      width: 165px;
      margin: auto;
      height: auto;
      @media (max-width: 600px) {
        width: 70%;
      }
      @media (max-height: 830px) {
        width: 130px;
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
      @media (max-width: 350px) {
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
  transition: all 0.5s ease;

  /* Blog logosu için özel efekt */
  ${(props) =>
    props.isDarkMode
      ? css`
          /* Dark modda hover efekti */
          ${StyledBlogLogo}:hover & {
            animation: ${shineEffect} 2s infinite;
            transform: translateY(-2px);
          }
        `
      : css`
          /* Light modda hover efekti */
          ${StyledBlogLogo}:hover & {
            animation: ${shineEffectLight} 2s infinite;
            transform: translateY(-2px);
          }
        `}
`;

function BlogLogo({ variant }) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/blog"); // Logo'ya tıklandığında /blog'a yönlendiriyoruz
  };

  const src = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-darkmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWRhcmttb2RlLnBuZyIsImlhdCI6MTcyODE0MTExNSwiZXhwIjo0NDI4OTY5NjM1NTE1fQ.DJfCjO8CPxbxmTwr9wacpvI3XFBcmFvjO-jvWVQfp9k&t=2024-10-05T15%3A11%3A56.016Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-lightmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWxpZ2h0bW9kZS5wbmciLCJpYXQiOjE3MjgxNDExMzIsImV4cCI6MzU2NDk2OTYzNTUzMn0.o5K7iHOeB2PbLuq24iVqbukYV2MLEjOXbCfECMLj20w&t=2024-10-05T15%3A12%3A13.053Z";

  return (
    <StyledBlogLogo
      onClick={handleLogoClick}
      variant={variant}
      isDarkMode={isDarkMode}
    >
      <Img src={src} alt="Blog-Logo" isDarkMode={isDarkMode} />
    </StyledBlogLogo>
  );
}

BlogLogo.propTypes = {
  variant: PropTypes.string,
};

export default BlogLogo;
