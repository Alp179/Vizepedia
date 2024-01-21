import styled from "styled-components";

import Wellcome from "../pages/Wellcome";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function QuestionsLayout() {
  return (
    <LoginLayout>
      <Wellcome />
    </LoginLayout>
  );
}

export default QuestionsLayout;
