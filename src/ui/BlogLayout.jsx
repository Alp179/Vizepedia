import { Outlet } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import BlogHeader from "./BlogHeader";

const BackgroundColor = styled.div`
  background: var(--color-grey-1);
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  position: relative;
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
  z-index: 0;
  position: absolute;
  top: 0;
  inset: -10px;
  left: 0;
  filter: blur(20px);
  opacity: 0.7;
  width: 100vw;
  height: 600px;
  @media (max-width: 850px) {
    height: 50vh;
  }
  @media (max-width: 450px) {
    height: 35vh;
  }
  background-image: repeating-linear-gradient(
      120deg,
      rgba(248, 24, 225, 0.6) 0%,       /* #F818E1 */
      rgba(248, 24, 225, 0.6) 7%,
      rgba(0, 68, 102, 0.6) 10%,        /* #004466 */
      rgba(0, 68, 102, 0.6) 12%,
      rgba(0, 255, 162, 0.6) 16%,       /* #00FFA2 */
      rgba(0, 255, 162, 0.6) 20%,
      rgba(248, 24, 225, 0.6) 25%       /* #F818E1 */
    ),
    repeating-linear-gradient(
      120deg,
      #004466 5%,                        /* #004466 */
      #00FFA2 10%,                       /* #00FFA2 */
      #F818E1 20%,                       /* #F818E1 */
      #004466 30%,                       /* #004466 */
      #00FFA2 40%                        /* #00FFA2 */
    );
  background-size: 300%, 200%;
  background-position: 50% 0;
  animation: ${auroraAnimation} 50s infinite linear;
  pointer-events: none;

  /* Alt kısımda şeffaf geçiş sağlayan maskeleme */
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
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