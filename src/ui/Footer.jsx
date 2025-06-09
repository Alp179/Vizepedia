import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../services/supabase";
import { getCurrentUser } from "../services/apiAuth";

// Yükleniyor göstergesi için styled bileşen
const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DavetiyeButton = styled.div`
  background: #00ffa2;
  color: #004466;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  margin-left: auto;
  margin-right: auto;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 160px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
    min-width: 120px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 520px) {
    padding: 10px 12px;
    font-size: 13px;
    min-width: 100px;
    margin-bottom: 10px; /* Alt margin ekle */
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

// Yükleniyor göstergesi için özel stil
const FooterButton = styled.div`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

// Footer wrapper'a daha iyi overflow kontrolü
const FooterWrapper = styled.div`
  width: 100%;
  max-width: 100vw;
  overflow: hidden; /* Hem X hem Y overflow'u kontrol et */
  box-sizing: border-box;

  .footer {
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px 15px; /* Üst-alt padding ekle */
    
    /* Footer header section */
    .footer-header-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 34px;
      margin-bottom: 40px;
      
      @media (max-width: 768px) {
        gap: 24px;
        margin-bottom: 30px;
      }
      
      @media (max-width: 520px) {
        gap: 20px;
        margin-bottom: 25px;
      }
    }
    
    .footer-header {
      text-align: center;
      line-height: 1.4;
      
    }
  }

  .footer-wrap {
    display: flex;
    justify-content: space-around;
    align-items: flex-start; /* Center yerine flex-start kullan */
    max-width: 80%;
    margin: 0 auto;
    gap: 20px;
    flex-wrap: wrap;
    box-sizing: border-box;
    
    @media (max-width: 1024px) {
      max-width: 90%;
      flex-direction: column;
      align-items: center;
      gap: 25px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      max-width: 95%;
      flex-direction: column;
      align-items: center;
      gap: 25px;
      text-align: center;
    }

    @media (max-width: 520px) {
      max-width: 100%;
      padding: 0 10px;
      gap: 20px;
    }
  }

  /* Logo section */
  .footer-logo-section {
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      order: 1;
    }
  }

  /* Links section */
  .footer-links-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 200px;

    @media (max-width: 768px) {
      order: 3;
      min-width: auto;
      gap: 15px;
    }

    @media (max-width: 520px) {
      gap: 12px;
    }
  }

  .footer-links-row {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;

    @media (max-width: 768px) {
      gap: 25px;
    }

    @media (max-width: 520px) {
      gap: 20px;
    }

    
  }

  .footer-legal-row {
    display: flex;
    gap: 30px;
    font-size: 14px;
    flex-wrap: wrap;
    justify-content: center;

    @media (max-width: 768px) {
      gap: 25px;
    }

    @media (max-width: 520px) {
      gap: 20px;
      font-size: 13px;
    }

    @media (max-width: 380px) {
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }

  /* Davetiye button section */
  .footer-button-section {
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      order: 2;
    }
  }

  /* Social section */
  .footer-social-section {
    display: flex;
    gap: 25px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      order: 4;
      justify-content: center;
    }

    @media (max-width: 520px) {
      gap: 20px;
    }

    a {
      flex-shrink: 0;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
      }
      
      svg {
        @media (max-width: 520px) {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  /* Footer divider */
  .footer-divider {
    margin: 30px 0;
    
    @media (max-width: 768px) {
      margin: 25px 0;
    }
    
    @media (max-width: 520px) {
      margin: 20px 0;
    }
  }

  /* Footer links hover effect */
  .footer-links {
    cursor: pointer;
    transition: color 0.2s ease;
    white-space: nowrap;
    
    &:hover {
      opacity: 0.7;
    }
    
    @media (max-width: 520px) {
      font-size: 14px;
    }
  }

  /* Tüm elementlere box-sizing uygula */
  * {
    box-sizing: border-box;
  }
`;

function Footer() {
  const navigate = useNavigate();
  // Yükleniyor durumu için state ekliyoruz
  const [isLoading, setIsLoading] = useState(false);
  // Kullanıcının oturum durumunu kontrol etmek için state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kullanıcının oturum durumunu kontrol et
  useEffect(() => {
    async function checkLoginStatus() {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser);
    }

    checkLoginStatus();
  }, []);

  // Başlayalım butonuna tıklandığında çalışacak fonksiyon
  const handleButtonClick = async () => {
    // Kullanıcı zaten giriş yapmışsa direkt dashboard'a yönlendir
    if (isLoggedIn) {
      window.scrollTo(0, 0);
      navigate("/dashboard");
      return;
    }

    // Giriş yapmamışsa anonim giriş işlemini başlat
    await handleAnonymousSignIn();
  };

  // Anonim giriş fonksiyonu ekliyoruz
  const handleAnonymousSignIn = async () => {
    try {
      // Eğer zaten yükleniyorsa, fonksiyondan çık
      if (isLoading) return;

      setIsLoading(true); // Yükleniyor durumunu başlat

      // Supabase anonim oturum açma fonksiyonu
      const { data, error } = await supabase.auth.signInAnonymously();
      localStorage.setItem("isAnonymous", "true"); // LocalStorage'a isAnonymous bilgisi ekliyoruz

      if (error) {
        console.error("Anonim oturum açma hatası:", error.message);
        setIsLoading(false); // Hata durumunda yükleniyor durumunu kapat
        return;
      }

      if (data) {
        // LocalStorage'da wellcomes sorularının cevaplanıp cevaplanmadığını kontrol ediyoruz
        const wellcomesAnswered =
          localStorage.getItem("wellcomesAnswered") || "false"; // Varsayılan olarak 'false'

        window.scrollTo(0, 0);
        if (wellcomesAnswered === "true") {
          // Eğer sorular cevaplanmışsa /dashboard'a yönlendir
          navigate("/dashboard");
        } else {
          // LocalStorage boşsa wellcome-2 (WellcomeA) sayfasına yönlendir
          navigate("/wellcome-2");
        }

        // Yükleniyor durumunu kapat (navigate işlemi gerçekleştiğinde otomatik kapanacak)
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Oturum açma sırasında hata oluştu:", error.message);
      setIsLoading(false); // Hata durumunda yükleniyor durumunu kapat
    }
  };

  const handleMainPageClick = () => {
    window.scrollTo(0, 0);
    navigate("/mainpage"); // /mainpage yoluna yönlendir
  };

  const handleBlogClick = () => {
    window.scrollTo(0, 0);
    navigate("/blog"); // /blog yoluna yönlendir
  };

  // KVKK sayfasına yönlendirme fonksiyonu
  const handleKvkkClick = () => {
    // Sayfayı en üste kaydır ve yönlendir
    window.scrollTo(0, 0);
    navigate("/kisisel-verilerin-korunmasi");
  };

  // Çerez Politikası sayfasına yönlendirme fonksiyonu
  const handleCerezPolitikasiClick = () => {
    // Sayfayı en üste kaydır ve yönlendir
    window.scrollTo(0, 0);
    navigate("/cerez-politikasi");
  };

  const handleDavetiyeClick = () => {
    window.scrollTo(0, 0);
    navigate("/davetiye-olustur");
  };

  // Yükleniyor ikonu
  const LoadingIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeDasharray="32"
        strokeDashoffset="8"
      />
    </svg>
  );

  // Devam et ikonu bileşeni
  const IconContinue = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      width="20"
      height="20"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const IconInvitation = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <path d="m3 4 9 7 9-7"/>
    </svg>
  );

  return (
    <FooterWrapper>
      <div className="footer">
        <div className="footer-header-section">
          <div className="footer-header">
            Vize başvurusu yapmak hiç bu kadar kolay olmamıştı.
          </div>
          <div className="ceper">
            <FooterButton
              className="footer-buton"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingIndicator>
                  <LoadingIcon />
                  Yükleniyor...
                </LoadingIndicator>
              ) : (
                <>
                  {isLoggedIn && (
                    <IconContinue style={{ marginRight: "8px" }} />
                  )}
                  {isLoggedIn ? "Devam et" : "Hemen başlayın"}
                </>
              )}
            </FooterButton>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-wrap">
          <div className="footer-logo-section">
            <Logo variant="footer" />
          </div>

          <div className="footer-links-section">
            <div className="footer-links-row">
              <div className="footer-links" onClick={handleMainPageClick}>
                Ana Sayfa
              </div>
              <div className="footer-links">Hakkında</div>
              <div className="footer-links" onClick={handleBlogClick}>
                Blog
              </div>
            </div>

            <div className="footer-legal-row">
              <div className="footer-links" onClick={handleKvkkClick}>
                KVKK
              </div>
              <div
                className="footer-links"
                onClick={handleCerezPolitikasiClick}
              >
                Çerez Politikası
              </div>
            </div>
          </div>

          <div className="footer-button-section">
            <DavetiyeButton onClick={handleDavetiyeClick}>
              <IconInvitation />
              Davetiye Oluşturucu
            </DavetiyeButton>
          </div>

          <div className="footer-social-section">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-facebook"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
              </svg>
            </a>

            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </a>

            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-youtube"
                viewBox="0 0 16 16"
              >
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </FooterWrapper>
  );
}

export default Footer;