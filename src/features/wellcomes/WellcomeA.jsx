import { useNavigate } from "react-router-dom";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import styled from "styled-components";

function WellcomeA() {
  const navigate = useNavigate();

  const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
  `;

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Vizepedia’ya hoş geldiniz</Heading>
        <h4 style={{textAlign: "center"}}>
          Lütfen seyahat amacınızı, mesleğinizi, konaklama türünüzü ve seyahat
          aracınızı aşağıdaki alanlarda belirtin. Bu bilgiler doğru belgeleri
          sunmamız için önemlidir ve size en iyi şekilde rehberlik edebilmemize
          yardımcı olacaktır.
        </h4>
        <Button size="question" onClick={() => navigate("/wellcome-2")}>
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeA;
