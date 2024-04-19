/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { styled } from "styled-components";
import UserAvatar from "../features/authentication/UserAvatar";

import {
  HiPencil,
  HiSquare2Stack,
  HiTrash,
  HiUserCircle,
} from "react-icons/hi2";
import Modal from "./Modal";
import Menus from "./Menus";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/authentication/useLogout";

const StyledProfileButton = styled.button`
  font-size: 1.6rem;
  font-weight: 500;
  background: none;
  border: none;
  padding: 1.2rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  
`;

function ProfileButton({ cabin }) {
  const navigate = useNavigate();
  const { logout, isLoading } = useLogout();
  return (
    <Menus>
      <Menus.Toggle id="user-menu" onProfile={true}></Menus.Toggle>
      <Menus.List id="user-menu">
        <Menus.Button icon={<HiUserCircle />} onClick={logout}>
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
