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
    width: 270px;
  }
`;

function Wellcome() {
  const navigate = useNavigate();

  function handleNextStep() {
    // Eğer kullanıcı anonimse localStorage'daki bilgiyi kontrol et
    const isAnonymous = localStorage.getItem("isAnonymous");

    if (isAnonymous === "true") {
      // Anonim kullanıcı ise, bir sonraki soru ekranına yönlendir
      navigate("/wellcome-1");
    } else {
      // Normal kullanıcılar için de ilerleme sağlanır
      navigate("/wellcome-1");
    }
  }

  return (
    <QuestionContainer>
      <Heading as="h5">Vizepedia’ya hoş geldiniz</Heading>
      <HeadingWidth>
        Vize alma sürecindeki karmaşıklığı ortadan kaldırmak için buradayız!
        Akıcı ve kolay bir vize başvuru deneyimi için hazır olun.
      </HeadingWidth>
      <StyledInput placeholder="Ad (isteğe bağlı)"></StyledInput>
      <Button variation="question" onClick={handleNextStep}>
        Devam et
      </Button>
    </QuestionContainer>
  );
}

export default Wellcome;
