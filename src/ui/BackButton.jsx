import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useVisaApplications } from "../context/VisaApplicationContext";
import { useEffect, useState } from "react"; // useState ve useEffect ekledik

const BackButtonWrapper = styled.div`
  position: fixed;
  top: 10px;
  left: 10%;
  z-index: 2991;
  transform: scale(1.2);

  @media (max-width: 710px) {
    top: 10px;
    left: 7%;
    transform: scale(1.1);
  }

  @media (max-width: 450px) {
    top: 15px;
    left: 5%;
    transform: scale(0.9);
  }
`;

const StyledBackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  color: var(--color-grey-600);
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 24px; /* %15 daha büyük font */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--color-grey-800);
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(0);
  }

  svg {
    width: 35px; /* %15 daha büyük ikon */
    height: 35px; /* %15 daha büyük ikon */
    margin-right: 10px;
  }
`;

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applications } = useVisaApplications();
  const [isFirstApplication, setIsFirstApplication] = useState(true);

  // Kullanıcının ilk başvuru durumunu belirle
  useEffect(() => {
    // Mevcut başvurusu var mı?
    const hasExistingApplications = applications && applications.length > 0;
    // Yeni başvuru sürecinin başında mı?
    const isStartingNewApplication = location.pathname === "/wellcome-2";

    if (hasExistingApplications && isStartingNewApplication) {
      // Kullanıcının önceden başvurusu var ve yeni bir başvuru başlatıyor
      setIsFirstApplication(false);
    } else {
      // Kullanıcının önceden başvurusu yok veya farklı bir sayfada
      setIsFirstApplication(true);
    }
  }, [applications, location.pathname]);

  // Kullanıcı seçimlerini temizleyen işlev
  const clearUserSelections = () => {
    // Sadece userSelections ve wellcomesAnswered temizlenir
    localStorage.removeItem("userSelections");
    localStorage.removeItem("wellcomesAnswered");

    console.log("Kullanıcı seçimleri temizlendi");
  };

  // Tüm localStorage ve çerezleri temizleyen işlev
  const clearAllStorageAndCookies = () => {
    // Kullanıcı oturumunu korumak istiyorsak
    const isAnonymous = localStorage.getItem("isAnonymous"); // Anonim durumunu koru

    // Tüm localStorage temizle
    localStorage.clear();

    // Anonim durumunu geri yükle (oturumu korumak istiyorsak)
    if (isAnonymous) {
      localStorage.setItem("isAnonymous", isAnonymous);
    }

    // Tüm çerezleri temizle
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // Tarayıcı özel oturum depolamasını temizle
    sessionStorage.clear();

    console.log("Tüm localStorage ve çerezler temizlendi");
  };

  const handleBackClick = (e) => {
    e.preventDefault();

    // İlk başvuru sürecinde wellcome-2 sayfasındayken (veri girişi başlamadan önce)
    if (location.pathname === "/wellcome-2") {
      if (!isFirstApplication) {
        // İkinci veya daha sonraki başvurular için sadece seçimleri temizle
        clearUserSelections();
      } else {
        // İlk başvuru için tüm localStorage'ı temizle
        clearAllStorageAndCookies();
      }
    }
    // Eğer ilk sorudan (wellcome-1) geri dönüyorsa
    else if (location.pathname === "/wellcome-1") {
      // Kullanıcı ilk sorudan geri döndüğünde her zaman tümünü temizle
      clearAllStorageAndCookies();
    }

    navigate(-1); // Bir adım geri git
  };

  // /wellcome sayfasındaysak butonu gösterme
  if (location.pathname === "/wellcome") {
    return null;
  }

  return (
    <BackButtonWrapper>
      <StyledBackButton onClick={handleBackClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Geri
      </StyledBackButton>
    </BackButtonWrapper>
  );
}

export default BackButton;
