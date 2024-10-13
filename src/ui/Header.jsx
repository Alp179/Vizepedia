import { styled } from "styled-components";
import HeaderMenu from "./HeaderMenu";
import ProfileButton from "./ProfileButton";
import ModalSignup from "../ui/ModalSignup";
import Button from "../ui/Button";
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
            <Button size="large" variation="primary">
              Hemen Üye Ol
            </Button>
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
