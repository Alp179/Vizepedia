/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { useUser } from "./useUser";
import Button from "../../ui/Button";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  /* color: var(--color-grey-600); */
`;

const Avatar = styled.img`
  display: flexbox;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

const UserName = styled.span`
  z-index: 2990;
  color: white;  /* Beyaz renk */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);  /* Siyah gölge */
`;


function UserAvatar() {
  const { user } = useUser();
  const { fullName, avatar } = user.user_metadata;
  return (
    <StyledUserAvatar>
      <Avatar
        src={avatar || "default-user.jpg"}
        alt={`Avatar of ${fullName}`}
      />
      <UserName>{fullName}</UserName>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
