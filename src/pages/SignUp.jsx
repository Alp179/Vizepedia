import styled from "styled-components";
import SignUpForm from "../features/authentication/SignUpForm";
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
  @media (max-width: 370px) {
    gap: 1.6rem;
  }
`;

function SignUp() {
  return (
    <LoginLayout>
      <Container>
        <Logo variant="login" />
        <SignUpForm />
      </Container>
    </LoginLayout>
  );
}

export default SignUp;
