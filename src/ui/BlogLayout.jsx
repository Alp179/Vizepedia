import { Outlet } from "react-router-dom";
import styled from "styled-components";
import BlogHeader from "./BlogHeader";

const StyledBlogLayout = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, rgba(221, 251, 239, 1) 40%);
  padding-top: 100px; /* Header'ın altında boşluk bırakır */
  overflow-x: hidden; /* Yatay kaydırmayı engeller */
`;

function BlogLayout() {
  return (
    <StyledBlogLayout>
      <BlogHeader />
      <Outlet />
    </StyledBlogLayout>
  );
}

export default BlogLayout;
