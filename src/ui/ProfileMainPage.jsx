/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { styled } from "styled-components";
import { HiUserCircle } from "react-icons/hi2";
import Menus from "./Menus2";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/authentication/useLogout";
import toast from "react-hot-toast"; // React Hot Toast import
import Logo from "./Logo";
import BlogLogo from "./BlogLogo";
import Button from "./Button";
import { useUser } from "../features/authentication/useUser";

const Divider = styled.div`
  height: 1px;
  width: 80%;
  margin: 12px auto 12px auto;
  background: var(--color-grey-600);
`;

const MobileDisplay = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
`;

const UserName = styled.p`
max-width: 80%;
  font-weight: bold;
  text-shadow: none;
  margin-left: 20px;
  margin-top: 10px;
  font-size: 14px;
`;

function ProfileMainPage({ cabin }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { user_metadata, email } = user || {};
  const fullName = user_metadata?.full_name;
  const { logout, isLoading } = useLogout();
  const handleLogout = async () => {
    const confirmLogout = await new Promise((resolve) => {
      toast(
        (t) => (
          <span className="handle-delete">
            <p style={{ textAlign: "center" }}>
              Oturumu kapatmak istediğinizden emin misiniz?
            </p>
            <br />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                style={{
                  display: "flex",
                  borderRadius: "8px",
                  marginRight: "8px",
                  color: "white",
                  backgroundColor: "#A40013",
                  width: "60px",
                  height: "30px",
                  border: "none",
                }}
              >
                Evet
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                style={{
                  borderRadius: "8px",
                  width: "60px",
                  height: "30px",
                  border: "none",
                  color: "black",
                }}
              >
                Hayır
              </button>
            </div>
          </span>
        ),
        {
          duration: Infinity,
        }
      );
    });

    if (confirmLogout) {
      logout();
    }
  };

  return (
    <Menus>
      <Menus.Toggle id="user-menu" onProfile={true}></Menus.Toggle>
      <Menus.List id="user-menu">
        <MobileDisplay>
          <UserName>{fullName || email}</UserName>{" "}
          {/* Eğer kullanıcı adı varsa, yoksa e-posta göster */}
          <Divider />
        </MobileDisplay>
        <Menus.Button icon={<HiUserCircle />} onClick={handleLogout}>
          Oturumu Kapat
        </Menus.Button>
        <Menus.Button
          icon={<HiUserCircle />}
          onClick={() => navigate("/account")}
        >
          Profil Ayarları
        </Menus.Button>
        <Button variation="mainpage3">Devam Et</Button>
        <Divider />
        <Logo variant="dashdropdown" />
        <BlogLogo variant="dashdropdown" />
      </Menus.List>
    </Menus>
  );
}

export default ProfileMainPage;
