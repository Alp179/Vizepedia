import { useNavigate } from "react-router-dom";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";

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
    @media (max-width: 300px) {
      width: 270px!important;
    }
  `;

  const handleContinue = () => {
    // Initialize anonymous user if not already done
    if (!AnonymousDataService.isAnonymousUser()) {
      AnonymousDataService.saveUserSelections({});
    }
    navigate("/wellcome-2");
  };

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Vizepedia&apos;ya hoş geldiniz</Heading>
        <HeadingWidth>
          Lütfen seyahat amacınızı, mesleğinizi, konaklama türünüzü ve seyahat
          aracınızı aşağıdaki alanlarda belirtin. Bu bilgiler doğru belgeleri
          sunmamız için önemlidir ve size en iyi şekilde rehberlik edebilmemize
          yardımcı olacaktır.
        </HeadingWidth>
        <Button variation="question" onClick={handleContinue}>
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeA;