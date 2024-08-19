import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";

const LoginLayout = styled.main`
  min-height: 100vh;
  background-color: var(--color-grey-50);
  overflow: auto;
`;

const Container = styled.div`
  margin-top: 100px;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 4rem;
  @media (max-height: 800px) {
    margin-top: 40px;
    gap: 3rem;
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
