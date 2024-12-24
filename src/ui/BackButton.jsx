import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button"; // Button bileşeninizi import edin

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
    <Button type="back" size="back" onClick={handleBackClick}>
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
        style={{ marginRight: "5px" }}
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Geri
    </Button>
  );
}

export default BackButton;
