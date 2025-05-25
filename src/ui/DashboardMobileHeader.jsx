import { useState, useEffect } from "react";
import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import styled from "styled-components";

const StyledHeader = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
  position: fixed;
  top: ${props => props.isVisible ? '0' : '-100px'}; /* Scroll durumuna göre konum */
  left: 0;
  width: 100%;
  padding: 20px;
  z-index: 2999; /* Diğer headerlar ile aynı seviye */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: top 0.3s ease-in-out; /* Smooth geçiş animasyonu */
`;

const LogoContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 320px) {
    width: 100%;
  }
`;

function DashboardMobileHeader() {
  // Scroll hide/show için state'ler
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll event handler
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Eğer sayfa tepesindeyse header'ı her zaman göster
      if (currentScrollY < 50) {
        setIsVisible(true);
      }
      // Scroll down - header'ı gizle (50px threshold)
      else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }
      // Scroll up - header'ı göster
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for performance
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  return (
    <StyledHeader isVisible={isVisible}>
      <LogoContainer>
        <BlogLogo variant="dashmobile" />
        <Logo variant="dashmobile" />
      </LogoContainer>
    </StyledHeader>
  );
}

export default DashboardMobileHeader;