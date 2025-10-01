import styled from "styled-components";
import SEO from "../components/SEO";
import Logo from "../ui/Logo";
import SignupForm from "../features/authentication/SignupForm";

const LoginLayout = styled.main`
  min-height: 100vh;
  background-color: var(--color-grey-50);
  overflow: auto;
`;

const Container = styled.div`
  margin-top: 60px;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 4rem;
  @media (max-width: 450px) {
    gap: 20px;
    margin-top: 45px;
  }
`;

function SignUp() {
  return (
    <>
    <SEO
        title="Kayıt Ol – Vizepedia"
        description="Vizepedia'ya ücretsiz kayıt olun ve vize başvurunuzu başlatın."
        keywords="kayıt ol, üye ol, hesap oluştur, sign up, Vizepedia"
        url="/sign-up"
        noindex={false} // ✓ Kayıt sayfası indekslenebilir (yeni kullanıcılar için)
      />
    <LoginLayout>
      <Container>
        <Logo variant="login" />
        <SignupForm />
      </Container>
    </LoginLayout>
  </>);
}

export default SignUp;
