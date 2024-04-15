import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";

const LoginLayout = styled.main`
  background-color: var(--color-grey-50);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: flex-start;
  gap: 3.2rem;
`;

function Login() {
  return (
    <LoginLayout>
      <Logo />
      <Heading as="h4">Login your account</Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;
