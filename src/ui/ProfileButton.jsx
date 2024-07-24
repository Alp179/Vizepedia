/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { styled } from "styled-components";
import { HiUserCircle } from "react-icons/hi2";
import Modal from "./Modal";
import Menus from "./Menus";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/authentication/useLogout";
import toast from "react-hot-toast"; // React Hot Toast import

const StyledProfileButton = styled.button`
  font-size: 1.6rem;
  z-index: 3000;
  font-weight: 500;
  background: none;
  border: none;
  padding: 1.2rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
  @media (max-width: 500px) {
    display: none;
  }
`;

function ProfileButton({ cabin }) {
  const navigate = useNavigate();
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    const confirmLogout = await new Promise((resolve) => {
      toast(
        (t) => (
          <span>
            Oturumu kapatmak istediğinizden emin misiniz?
            <br />
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              style={{
                marginRight: "8px",
                color: "white",
                backgroundColor: "red",
                padding: "5px",
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
              style={{ padding: "5px", border: "none" }}
            >
              Hayır
            </button>
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
        <Menus.Button icon={<HiUserCircle />} onClick={handleLogout}>
          Oturumu Kapat
        </Menus.Button>
        <Menus.Button
          icon={<HiUserCircle />}
          onClick={() => navigate("/account")}
        >
          Profil Ayarları
        </Menus.Button>
      </Menus.List>
    </Menus>
  );
}

export default ProfileButton;
