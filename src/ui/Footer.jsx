import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { getCurrentUser } from "../services/apiAuth";

// Simple animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Main footer wrapper
const FooterWrapper = styled.footer`
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ffa2, transparent);
  }

  .dark-mode & {
    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  }
`;

// Container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 40px;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 40px 16px 30px;
  }
`;

// Header section
const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff, #00ffa2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

// Main CTA Button
const MainButton = styled.button`
  background: linear-gradient(135deg, #00ffa2, #004466);
  color: #000;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 25px rgba(0, 255, 162, 0.3);

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-3px)")};
    box-shadow: ${(props) =>
      props.disabled
        ? "0 8px 25px rgba(0, 255, 162, 0.3)"
        : "0 12px 35px rgba(0, 255, 162, 0.4)"};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-1px)")};
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 16px;
  }
`;

// Loading spinner
const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Divider
const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  margin: 50px 0;

  @media (max-width: 768px) {
    margin: 40px 0;
  }
`;

const ContentGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 800px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const BrandText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
  text-align: center;
`;

const LinksSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const SectionTitle = styled.h3`
  color: #00ffa2;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const NavigationSection = styled.div``;

const NavLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: #00ffa2;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover {
    color: #00ffa2;
    transform: translateY(-2px);
  }

  &:hover::after {
    width: 80%;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 6px 12px;
  }
`;

const LegalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LegalLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 400px;
`;

const LegalLink = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.05);
  }
`;

// Action section - Grid pozisyonu güncellendi
const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const ActionTitle = styled.h3``;

const InviteButton = styled.button`
  background: #00ffa2;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 255, 162, 0.3);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 162, 0.4);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const SocialTitle = styled.h4`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;

  &:hover {
    background: #00ffa2;
    color: #000;
    transform: translateY(-3px);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

function Footer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser);
    }
    checkLoginStatus();
  }, []);

  // FIXED: Now redirects to /dashboard instead of wellcome pages
  const handleButtonClick = async () => {
    if (isLoggedIn) {
      window.scrollTo(0, 0);
      navigate("/dashboard");
      return;
    }
    await handleAnonymousSignIn();
  };

  // FIXED: Simplified anonymous sign in that goes directly to dashboard
  const handleAnonymousSignIn = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      // DON'T set isAnonymous flag immediately - let dashboard determine the state
      // localStorage.setItem("isAnonymous", "true"); // ← REMOVED

      // Initialize empty anonymous user data for potential onboarding
      localStorage.setItem("anonymousUserData", JSON.stringify({}));

      console.log("Redirecting to dashboard for anonymous user");

      window.scrollTo(0, 0);

      // Always redirect to dashboard - dashboard will handle the three scenarios:
      // 1. No onboarding → Static Dashboard
      // 2. Onboarding complete + anonymous → Anonymous Dashboard
      // 3. Onboarding complete + authenticated → Authenticated Dashboard
      navigate("/dashboard");

      setIsLoading(false);
    } catch (error) {
      console.error("Anonymous sign in error:", error.message);
      setIsLoading(false);
    }
  };

  const handleMainPageClick = () => {
    window.scrollTo(0, 0);
    navigate("/mainpage");
  };

  const handleAboutUsClick = () => {
    window.scrollTo(0, 0);
    // Ensure canonical URL is used
    window.location.href = 'https://www.vizepedia.com/hakkimizda';
  };

  const handleBlogClick = () => {
    window.scrollTo(0, 0);
    navigate("/blog");
  };

  const handleKvkkClick = () => {
    window.scrollTo(0, 0);
    navigate("/kisisel-verilerin-korunmasi");
  };

  const handleCerezPolitikasiClick = () => {
    window.scrollTo(0, 0);
    navigate("/cerez-politikasi");
  };

  const handleDavetiyeClick = () => {
    window.scrollTo(0, 0);
    navigate("/davetiye-olustur");
  };

  const handlePrivacyPolicyClick = () => {
    window.scrollTo(0, 0);
    navigate("/gizlilik-politikasi");
  };

  const handleTermsClick = () => {
    window.scrollTo(0, 0);
    navigate("/kullanim-sartlari");
  };

  const handleDisclaimerClick = () => {
    window.scrollTo(0, 0);
    navigate("/yasal-uyari");
  };

  const handleContactClick = () => {
    window.scrollTo(0, 0);
    navigate("/iletisim");
  };

  const handleSitemapClick = () => {
    window.scrollTo(0, 0);
    navigate("/site-haritasi");
  };

  return (
    <FooterWrapper>
      <Container>
        {/* Header Section */}
        <HeaderSection>
          <Title>Vize başvurusu yapmak hiç bu kadar kolay olmamıştı.</Title>
          <MainButton onClick={handleButtonClick} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                Yükleniyor...
              </>
            ) : (
              <>
                {isLoggedIn ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    Devam et
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                    </svg>
                    Hemen başlayın
                  </>
                )}
              </>
            )}
          </MainButton>
        </HeaderSection>

        <Divider />

        {/* Main Content */}
        <ContentGrid>
          {/* Logo Section */}
          <LogoSection>
            <Logo variant="footer" />
            <BlogLogo variant="footer" />
            <BrandText>Güvenilir Vize Rehberiniz</BrandText>
          </LogoSection>

          {/* Links Section */}
          <LinksSection>
            <NavigationSection>
              <SectionTitle>Keşfet</SectionTitle>
              <NavLinks>
                <NavLink onClick={handleMainPageClick}>Ana Sayfa</NavLink>
                <NavLink onClick={handleAboutUsClick}>Hakkımızda</NavLink>
                <NavLink onClick={handleBlogClick}>Blog</NavLink>
              </NavLinks>
            </NavigationSection>

            <LegalSection>
              <SectionTitle>Yasal ve İletişim</SectionTitle>
              <LegalLinks>
                <LegalLink onClick={handlePrivacyPolicyClick}>
                  Gizlilik Politikası
                </LegalLink>
                <LegalLink onClick={handleKvkkClick}>KVKK</LegalLink>
                <LegalLink onClick={handleTermsClick}>
                  Kullanım Şartları
                </LegalLink>
                <LegalLink onClick={handleDisclaimerClick}>
                  Yasal Uyarı
                </LegalLink>
                <LegalLink onClick={handleCerezPolitikasiClick}>
                  Çerez Politikası
                </LegalLink>
                <LegalLink onClick={handleContactClick}>İletişim</LegalLink>
                <LegalLink onClick={handleSitemapClick}>
                  Site Haritası
                </LegalLink>
              </LegalLinks>
            </LegalSection>
          </LinksSection>

          {/* Action Section */}
          <ActionSection>
            <ActionTitle>Araçlar</ActionTitle>
            <InviteButton onClick={handleDavetiyeClick}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="m3 4 9 7 9-7" />
              </svg>
              Davetiye Oluşturucu
            </InviteButton>

            <SocialSection>
              <SocialTitle>Takip Et</SocialTitle>
              <SocialLinks>
                <SocialLink
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                </SocialLink>

                <SocialLink
                  href="https://instagram.com/vizepediacom"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </SocialLink>

                <SocialLink
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                  </svg>
                </SocialLink>
              </SocialLinks>
            </SocialSection>
          </ActionSection>
        </ContentGrid>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;
