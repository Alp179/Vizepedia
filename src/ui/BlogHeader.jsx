import { styled, keyframes } from "styled-components";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

// Ana logo için parlama animasyonu
const shineEffectMain = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(0, 68, 102, 0)) brightness(1);
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(0, 68, 102, 0.6)) brightness(1.1);
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(0, 68, 102, 0)) brightness(1);
  }
`;

// Ana logo için parlama animasyonu (dark mode)
const shineEffectMainDark = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(0, 255, 162, 0)) brightness(1);
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(0, 255, 162, 0.7)) brightness(1.2);
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(0, 255, 162, 0)) brightness(1);
  }
`;

// Blog logosu için parlama animasyonu
const shineEffectBlog = keyframes`
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

// Blog logosu için parlama animasyonu (dark mode)
const shineEffectBlogDark = keyframes`
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

const BlogLogo = styled.img`
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: absolute;
  top: 50%;
  left: 50%;
  width: 165px;
  transform: translate(-50%, -50%);
  height: auto;
  flex-shrink: 0;

  &:hover {
    transform: translate(-50%, -52%) scale(1.05);
    animation: ${(props) =>
        props.isDarkMode ? shineEffectBlogDark : shineEffectBlog}
      2s infinite;
  }

  @media (max-width: 1300px) {
    width: 140px;
  }
  @media (max-width: 1050px) {
    width: 120px;
  }
  @media (max-width: 910px) {
    width: 120px;
  }
  @media (max-width: 870px) {
    width: 100px!important;
  }
  @media (max-width: 380px) {
    width: 75px!important;
  }
`;

const Logo = styled.img`
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 165px;
  transform: translate(0, 0);
  height: auto;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    animation: ${(props) =>
        props.isDarkMode ? shineEffectMainDark : shineEffectMain}
      2s infinite;
  }

  @media (max-width: 1300px) {
    width: 140px;
    position: relative;
  }
  @media (max-width: 910px) {
    width: 120px;
  }
  @media (max-width: 732px) {
    width: 98px;
  }
  @media (max-width: 380px) {
    width: 80px;
  }
`;

const StyledHeader = styled.header`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 20px;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const HeaderContents = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 910px) {
    width: 90%;
  }
  @media (max-width: 550px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const DarkModeContainer = styled.div`
  margin-left: auto;
  display: flex;
  @media (max-width: 1300px) {
    align-self: flex-end;
  }
`;

function BlogHeader() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleLogoClick = () => {
    navigate("/mainpage");
  };

  const handleBlogLogoClick = () => {
    navigate("/blog");
  };

  const srcBlog = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-darkmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWRhcmttb2RlLnBuZyIsImlhdCI6MTcyODE0MTExNSwiZXhwIjo0NDI4OTY5NjM1NTE1fQ.DJfCjO8CPxbxmTwr9wacpvI3XFBcmFvjO-jvWVQfp9k&t=2024-10-05T15%3A11%3A56.016Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-lightmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWxpZ2h0bW9kZS5wbmciLCJpYXQiOjE3MjgxNDExMzIsImV4cCI6MzU2NDk2OTYzNTUzMn0.o5K7iHOeB2PbLuq24iVqbukYV2MLEjOXbCfECMLj20w&t=2024-10-05T15%3A12%3A13.053Z";

  const srcLogo = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/Varl_k_20_light_8x.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL1Zhcmxfa18yMF9saWdodF84eC5wbmciLCJpYXQiOjE3MjA5ODI4MjQsImV4cCI6NjgwNzk1NTYyNH0.q3TYM9XCjpsVsD7gQxFaQfRHTKqxhjHwLDzagSY1YY8&t=2024-07-14T18%3A47%3A05.607Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/Varl_k_20_8x.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL1Zhcmxfa18yMF84eC5wbmciLCJpYXQiOjE3MjA5ODIzNjUsImV4cCI6NzU2ODI3NTE2NX0.uo2NgeaGhKZjiNKp5qq4ikIZTlDCkRCZ21ENwcwldLE&t=2024-07-14T18%3A39%3A25.590Z";

  return (
    <StyledHeader>
      <HeaderContents>
        <Logo onClick={handleLogoClick} src={srcLogo} isDarkMode={isDarkMode} />
        <BlogLogo
          onClick={handleBlogLogoClick}
          src={srcBlog}
          isDarkMode={isDarkMode}
        />

        <DarkModeContainer>
          <DarkModeToggle />
        </DarkModeContainer>
      </HeaderContents>
    </StyledHeader>
  );
}

export default BlogHeader;
