import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button"; // Button bileşeninizi import edin

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // /wellcome sayfasındaysak butonu gösterme
  if (location.pathname === "/wellcome") {
    return null;
  }

  return (
    <Button
      type="back"
      size="back"
      onClick={(e) => {
        e.preventDefault();
        navigate(-1); // Bir adım geri git
      }}
    >
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
