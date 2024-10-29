import { Outlet } from "react-router-dom";
import styled from "styled-components";
import BlogHeader from "./BlogHeader";
import AuroraBackground from "./AuroraBackground";

const BackgroundColor = styled.div`
  background: var(--color-grey-1);
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  position: relative;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding-top: 300px; /* AuroraBackground yüksekliği kadar boşluk bırak */
`;

function BlogLayout() {
  return (
    <BackgroundColor>
      <AuroraBackground
        showRadialGradient={true}
        style={{
          background: `
            radial-gradient(circle at 20% 10%, rgba(248, 24, 225, 0.3), transparent 10%),
            radial-gradient(circle at 35% 10%, rgba(248, 24, 225, 0.3), transparent 10%),
            radial-gradient(circle at 5% 5%, rgba(0, 255, 162, 0.3), transparent 10%),
            radial-gradient(circle at 60% 25%, rgba(36, 0, 255, 0.3), transparent 10%),
            radial-gradient(circle at 60% 18%, rgba(36, 0, 255, 0.3), transparent 20%),
            radial-gradient(circle at 20% 5%, rgba(0, 255, 162, 0.3), transparent 10%),
            radial-gradient(circle at 50% 5%, rgba(0, 255, 162, 0.3), transparent 20%),
            radial-gradient(circle at 85% 3%, rgba(0, 255, 162, 0.3), transparent 20%),
            radial-gradient(circle at 20% 15%, rgba(0, 68, 102, 0.3), transparent 20%),
            radial-gradient(circle at 85% 8%, rgba(0, 68, 102, 0.3), transparent 20%)
          `,
          backgroundSize: "cover",
          backgroundAttachment: "local",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "300px", // Üst kısımda sabitlenmesini istediğimiz yükseklik
          zIndex: 0,
        }}
      />
      <ContentWrapper>
        <BlogHeader />
        <Outlet />
      </ContentWrapper>
    </BackgroundColor>
  );
}

export default BlogLayout;
