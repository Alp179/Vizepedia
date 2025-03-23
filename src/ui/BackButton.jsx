import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const BackButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 10%;
  z-index: 3000;
  transform: scale(1.2);

  @media (max-width: 710px) {
    top: 10px;
    left: 7%;
    transform: scale(1.1);
  }

  @media (max-width: 450px) {
    top: -5px;
    left: 5%;
    transform: scale(1);
  }

  @media (max-width: 350px) {
    top: 5px;
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

  // Tüm localStorage ve çerezleri temizleyen işlev
  const clearAllStorageAndCookies = () => {
    // Tüm localStorage temizle
    localStorage.clear();

    // Supabase oturum anahtarını özel olarak temizle
    const supabaseKey = Object.keys(localStorage).find((key) =>
      key.includes("-auth-token")
    );
    if (supabaseKey) {
      localStorage.removeItem(supabaseKey);
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
  };

  const handleBackClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/wellcome-1") {
      // Yalnızca /wellcome-1'deyken çerezleri ve localStorage temizle
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
