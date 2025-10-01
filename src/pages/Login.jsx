import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import SEO from "../components/SEO";

const LoginLayout = styled.main`
  min-height: 100vh;
  background-color: var(--color-grey-50);
  overflow: auto;
`;

const Container = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 32px;
  @media (max-width: 450px) {
    gap: 20px;
    margin-top: 45px;
  }
`;

function Login() {
  return (
    <>
      <SEO
  title="Giriş Yap – Vizepedia"
  description="Vizepedia hesabınıza giriş yapın."
  keywords="giriş, login, oturum aç, Vizepedia"
  url="/login" // ✓ Relative - normalizeUrl düzeltecek
  noindex={true} // ✓ Login sayfası indekslenmesin
/>
      <LoginLayout>
        <Container>
          <Logo variant="login" />
          <LoginForm />
        </Container>
      </LoginLayout>
    </>
  );
}

export default Login;
