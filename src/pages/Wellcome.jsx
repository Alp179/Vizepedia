import { styled } from "styled-components";

import Heading from "../ui/Heading";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const StyledInput = styled.input`
  width: 400px;
  padding: 8px;
  color: #004466;
  background-color: lightgreen;
  border-radius: 11px;
  border: 2px solid #ebebec;
  @media (max-width: 500px) {
    width: 280px;
  }
`;
const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
`;

function Wellcome() {
  const navigate = useNavigate();

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Vizepedia’ya hoş geldiniz</Heading>
        <h4 style={{textAlign: "center"}}>
          Vize alma sürecindeki karmaşıklığı ortadan kaldırmak için buradayız!
          Akıcı ve kolay bir vize başvuru deneyimi için hazır olun.
        </h4>
        <StyledInput placeholder="Ad (isteğe bağlı)"></StyledInput>
        <Button size="question" onClick={() => navigate("/wellcome-1")}>Devam et</Button>
      </QuestionContainer>
    </>
  );
}

export default Wellcome;
