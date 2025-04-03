import styled from "styled-components";

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
    <LoginLayout>
      <Container>
        <Logo variant="login" />
        <SignupForm />
      </Container>
    </LoginLayout>
  );
}

export default SignUp;
