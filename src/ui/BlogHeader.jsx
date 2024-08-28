import { styled } from "styled-components";
import Logo from "./Logo";

const StyledHeader = styled.header`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 2.5rem 4.8rem;
  display: flex;
  justify-content: space-around;
  gap: 2.4rem;
  align-items: center;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  }
`;

const BlogInput = styled.input`
  height: 44px;
  width: 371px;
  border: 2px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: 20px;
  background: transparent;
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  @media (max-width: 450px) {
    width: 306px;
    height: 44px;
  }
  @media (max-width: 370px) {
    width: calc(100vw - 20px);
  }
`;


function BlogHeader() {
  return (
    <StyledHeader>
        <Logo variant="mainpage" />
        <Logo variant="mainpage" />
        <BlogInput />
    </StyledHeader>
  );
}

export default BlogHeader;
