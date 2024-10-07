import styled from "styled-components";
import BlogLogo from "./BlogLogo";
import Logo from "./Logo";
import Heading from "./Heading";
import Button from "./Button";
import DarkModeToggle from "./DarkModeToggle";

const StyledMainPageHeader = styled.div`
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
  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: 52px;
  justify-content: space-around;
  align-items: center;
  @media (max-width: 1200px) {
    gap: 32px;
  }
  @media (max-width: 360px) {
    gap: 16px;
  }
`;

function MainPageHeader() {
  return (
    <>
      <StyledMainPageHeader>
        <HeaderContents>
          <Logo variant="mainpage" />
          <Heading as="h10">Hakkımızda</Heading>
          <Heading as="h10">SSS</Heading>
          <BlogLogo variant="mainpage2" />
          <div style={{ display: "flex", gap: "16px", marginLeft: "auto" }}>
            <Button variation="mainpage2">Oturum Aç</Button>
            <Button variation="mainpage">Başlayalım</Button>
            <DarkModeToggle />
          </div>
        </HeaderContents>
      </StyledMainPageHeader>
    </>
  );
}

export default MainPageHeader;
