import { Outlet } from "react-router-dom";
import styled from "styled-components";
import BlogHeader from "./BlogHeader";

const StyledBlogLayout = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(0, 255, 162, 0.4) 0%,
    rgba(0, 68, 102, 0.2) 10%,
    rgba(36, 0, 255, 0.2) 20%,
    rgba(248, 24, 225, 0.4) 30%,
    rgba(221, 251, 239, 1) 40%
  );
`;

function BlogPageLayout() {
  return (
    <>
      <StyledBlogLayout>
        <BlogHeader />
        <Outlet />
      </StyledBlogLayout>
    </>
  );
}

export default BlogPageLayout;
