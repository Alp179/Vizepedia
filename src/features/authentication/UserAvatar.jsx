/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { useUser } from "./useUser";

const StyledUserAvatar = styled.div`
  display: flex;
  margin-right: 16px;
  gap: 1rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
`;

const Avatar = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-grey-200);
  color: var(--color-grey-700);
  font-size: 1.8rem;
  font-weight: 700;
`;

const UserName = styled.span`
  z-index: 2990;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

function UserAvatar() {
  const { user } = useUser();
  const { user_metadata, email } = user || {};
  const fullName = user_metadata?.full_name;

  // Kullanıcının isminin ilk harfi, yoksa email'in ilk harfi alınır
  const initial = fullName
    ? fullName.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase();

  return (
    <StyledUserAvatar>
      <Avatar>{initial}</Avatar>{" "}
      {/* Artık sadece ismin veya email'in ilk harfi gösteriliyor */}
      <UserName>{fullName || email}</UserName>{" "}
      {/* Eğer kullanıcı adı varsa, yoksa e-posta göster */}
    </StyledUserAvatar>
  );
}

export default UserAvatar;
