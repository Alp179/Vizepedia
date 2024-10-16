import { Outlet } from "react-router-dom";
import styled from "styled-components";
import BlogHeader from "./BlogHeader";

const BackgroundColor = styled.div`
  background: var(--color-grey-1);
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
`;

const StyledBlogLayout = styled.div`
  z-index: 1000;
  background: radial-gradient(
      circle at 20% 10%,
      rgba(248, 24, 225, 0.3),
      transparent 10%
    ),
    radial-gradient(circle at 35% 10%, rgba(248, 24, 225, 0.3), transparent 10%),
    radial-gradient(circle at 5% 5%, rgba(0, 255, 162, 0.3), transparent 10%),
    radial-gradient(circle at 60% 25%, rgba(36, 0, 255, 0.3), transparent 10%),
    radial-gradient(circle at 60% 18%, rgba(36, 0, 255, 0.3), transparent 20%),
    radial-gradient(circle at 20% 5%, rgba(0, 255, 162, 0.3), transparent 10%),
    radial-gradient(circle at 50% 5%, rgba(0, 255, 162, 0.3), transparent 20%),
    radial-gradient(circle at 85% 3%, rgba(0, 255, 162, 0.3), transparent 20%),
    radial-gradient(circle at 20% 15%, rgba(0, 68, 102, 0.3), transparent 20%),
    radial-gradient(circle at 85% 8%, rgba(0, 68, 102, 0.3), transparent 20%);
  background-size: cover;
  background-attachment: local; /* Sabit kalması için */
  position: relative; /* Radial-gradient'in pozisyonunu ayarlamak için relative yapıyoruz */
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
`;

function BlogLayout() {
  return (
    <BackgroundColor>
      <StyledBlogLayout>
        <BlogHeader />
        <Outlet />
      </StyledBlogLayout>
    </BackgroundColor>
  );
}

export default BlogLayout;
