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
      onClick={(e) => {
        e.preventDefault();
        navigate(-1); // Bir adım geri git
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
