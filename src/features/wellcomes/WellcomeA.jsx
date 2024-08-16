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
    gap: 24px;
  `;

  const HeadingWidth = styled.p`
    color: var(--color-grey-904);
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    @media (max-width: 450px) {
      font-size: 16px;
      width: 300px;
    }
  `;

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Vizepedia’ya hoş geldiniz</Heading>
        <HeadingWidth>
          Lütfen seyahat amacınızı, mesleğinizi, konaklama türünüzü ve seyahat
          aracınızı aşağıdaki alanlarda belirtin. Bu bilgiler doğru belgeleri
          sunmamız için önemlidir ve size en iyi şekilde rehberlik edebilmemize
          yardımcı olacaktır.
        </HeadingWidth>
        <Button variation="question" onClick={() => navigate("/wellcome-2")}>
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeA;
