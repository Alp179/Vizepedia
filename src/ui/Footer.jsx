import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  const handleMainPageClick = () => {
    navigate("/mainpage"); // /mainpage yoluna yönlendir
  };

  const handleBlogClick = () => {
    navigate("/blog"); // /blog yoluna yönlendir
  };

  return (
    <div className="footer">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "34px",
        }}
      >
        <div className="footer-header">
          Vize başvurusu yapmak hiç bu kadar kolay olmamıştı.
        </div>
        <div className="ceper">
          <div className="footer-buton" onClick={handleSignUpClick}>Hemen başlayın</div>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div
        className="footer-wrap"
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          maxWidth: "80%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Logo variant="footer" />
        <div style={{ display: "flex", gap: "30px" }}>
          <div className="footer-links" onClick={handleMainPageClick}>Ana Sayfa</div>
          <div className="footer-links">Hakkında</div>
          <div className="footer-links" onClick={handleBlogClick}>Blog</div>
        </div>
        <div style={{ display: "flex", gap: "25px" }}>
          <img src="images/linkedin.png" />
          <img src="images/Facebook.png" />
          <img src="images/Instagram.png" />
          <img src="images/Youtube.png" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
