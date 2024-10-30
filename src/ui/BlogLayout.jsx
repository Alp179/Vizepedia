import { Outlet } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import BlogHeader from "./BlogHeader";

const BackgroundColor = styled.div`
  background: var(--color-grey-1);
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  position: relative; /* Üst katmanın konumlandırmasını sağlamak için relative */
`;

const auroraAnimation = keyframes`
  0% {
    background-position: 0% 50%, 50% 50%;
  }
  50% {
    background-position: 100% 50%, 50% 50%;
  }
  100% {
    background-position: 0% 50%, 50% 50%;
  }
`;

const StyledBlogLayout = styled.div`
  z-index: 0; /* Arka plan renginin üzerinde olacak şekilde z-index ayarı */
  position: absolute;
  top: 0;
  inset: -10px;
  left: 0;
  filter: blur(10px);
  opacity: 0.6;
  width: 100vw;
  height: 400px; /* Ekranın üst %20'sini kaplayacak */
  background-image: repeating-linear-gradient(
      100deg,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.7) 7%,
      transparent 10%,
      transparent 12%,
      rgba(255, 255, 255, 0.7) 16%
    ),
    repeating-linear-gradient(
      100deg,
      #3b82f6 10%,
      #818cf8 15%,
      #60a5fa 20%,
      #a5b4fc 25%,
      #2563eb 30%
    );
  background-size: 300%, 200%;
  background-position: 50% 0;
  animation: ${auroraAnimation} 30s infinite linear;
  pointer-events: none;
`;

function BlogLayout() {
  return (
    <BackgroundColor>
      <StyledBlogLayout />
      <BlogHeader />
      <Outlet />
    </BackgroundColor>
  );
}

export default BlogLayout;
