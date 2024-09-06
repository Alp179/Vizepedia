import { styled } from "styled-components";
import Logo from "./Logo";
import DarkModeToggle from "./DarkModeToggle";

const StyledHeader = styled.header`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 2.5rem 4.8rem;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  }
`;

const HeaderContents = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

const BlogInput = styled.input`
  height: 44px;
  width: 256px;
  border: 2px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: 20px;
  background: transparent;
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  }
`;

function BlogHeader() {
  return (
    <StyledHeader>
      <HeaderContents>
        <Logo variant="mainpage" />
        <Logo variant="blogpage1" />
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
        >
          <BlogInput />
          <DarkModeToggle />
        </div>
      </HeaderContents>
    </StyledHeader>
  );
}

export default BlogHeader;
