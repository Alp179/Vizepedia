import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import PurposeSelection from "./PurposeSelection";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import styled from "styled-components";

function WellcomeC() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedPurpose, setSelectedPurpose] = useState(state.purpose);

  // Anonim kullanıcı kontrolü için localStorage
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";

  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);

    // Eğer anonim kullanıcı ise, seçimi localStorage'a kaydet
    if (isAnonymous) {
      localStorage.setItem("selectedPurpose", purpose);
    } else {
      // Kayıtlı kullanıcılar için state'i güncelle
      dispatch({ type: "SET_PURPOSE", payload: purpose });
    }
  };

  useEffect(() => {
    // Eğer anonim kullanıcı ise, localStorage'dan seçili amaca ulaş ve state'e yükle
    if (isAnonymous) {
      const savedPurpose = localStorage.getItem("selectedPurpose");
      if (savedPurpose) {
        setSelectedPurpose(savedPurpose);
      }
    }
  }, [isAnonymous]);

  const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `;

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Gidiş amacınızı seçiniz</Heading>
        <PurposeSelection
          selectedPurpose={selectedPurpose}
          onPurposeChange={handlePurposeChange}
        />
        <Button
          variation="question"
          onClick={() => navigate("/wellcome-4")}
          disabled={!selectedPurpose}
        >
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeC;
