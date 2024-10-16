import { styled, keyframes } from "styled-components";
import HeaderMenu from "./HeaderMenu";
import ProfileButton from "./ProfileButton";
import ModalSignup from "../ui/ModalSignup";
import Spinner from "../ui/Spinner";
import { useEffect, useState } from "react";
import SignupForm from "../features/authentication/SignupForm";

const StyledHeader = styled.header`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 1.2rem 4.8rem;
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  @media (max-width: 710px) {
    display: none;
  }
`;

const glowing = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
`;

const HemenUyeOl = styled.button`
  width: 220px;
  height: 50px;
  border: none;
  outline: none;
  color: var(--color-grey-913);
  background: var(--color-grey-914);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;

  &:before {
    content: '';
    background: linear-gradient(-45deg, #004466,#004466, #87F9CD, #87F9CD, #87F9CD,   #004466, #004466 );
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    animation: ${glowing} 20s linear infinite ;
    opacity: 1;  // Opacity'yi 1 yaparak pasif durumda da animasyonu aktif hale getirdik
    transition: opacity 0.3s ease-in-out;
    border-radius: 10px;
  }

  &:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--color-grey-914);
    left: 0;
    top: 0;
    border-radius: 10px;
  }

  &:hover {
    color: #004466;
  }

  &:hover:after {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    color: #000;
  }

  &:active:after {
    background: transparent;
  }

  @media (max-width: 1300px) {
    width: 180px;
  }

  @media (max-width: 1050px) {
    width: 150px;
    font-size: 14px;
  }

`;

function Header() {
  const [isAnonymous, setIsAnonymous] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Başlangıçta localStorage'daki isAnonymous değerini kontrol ediyoruz
    const anonymousStatus = localStorage.getItem("isAnonymous") === "true";
    setIsAnonymous(anonymousStatus);
    setLoading(false);
  }, []);

  // localStorage'da isAnonymous değerinin değişip değişmediğini izleyelim
  useEffect(() => {
    const handleStorageChange = () => {
      const anonymousStatus = localStorage.getItem("isAnonymous") === "true";
      setIsAnonymous(anonymousStatus);
    };

    // localStorage'da değişiklik olduğunda handleStorageChange tetiklenecek
    window.addEventListener("storage", handleStorageChange);

    // Cleanup - event listener'ı bileşen kaldırıldığında temizleyelim
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) return <Spinner />;

  return (
    <StyledHeader>
      {isAnonymous ? (
        <ModalSignup>
          <ModalSignup.Open opens="signUpForm">
            <HemenUyeOl>
              Hemen Üye Ol
            </HemenUyeOl>
          </ModalSignup.Open>
          <ModalSignup.Window name="signUpForm">
            <SignupForm />
          </ModalSignup.Window>
        </ModalSignup>
      ) : (
        <ProfileButton size="large" variation="primary" />
      )}
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
