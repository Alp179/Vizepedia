import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";

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
    <LoginLayout>
      <Container>
        <Logo variant="login" />
        <LoginForm />
      </Container>
    </LoginLayout>
  );
}

export default Login;
