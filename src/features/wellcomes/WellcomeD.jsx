import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import ProfessionSelection from "./ProfessionSelection";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";

function WellcomeD() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedProfession, setSelectedProfession] = useState(state.profession);

  // Anonim kullanıcı kontrolü için localStorage
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);

    // Eğer anonim kullanıcı ise meslek seçimini localStorage'a kaydet
    if (isAnonymous) {
      localStorage.setItem("selectedProfession", profession);
    } else {
      // Kayıtlı kullanıcılar için state'i güncelle
      dispatch({ type: "SET_PROFESSION", payload: profession });
    }
  };

  useEffect(() => {
    // Eğer anonim kullanıcı ise localStorage'dan meslek seçimini yükleyin
    if (isAnonymous) {
      const savedProfession = localStorage.getItem("selectedProfession");
      if (savedProfession) {
        setSelectedProfession(savedProfession);
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
        <Heading as="h5">Mesleğinizi seçiniz</Heading>
        <ProfessionSelection
          selectedProfession={selectedProfession}
          onProfessionChange={handleProfessionChange}
        />
        <Button
          variation="question"
          onClick={() => navigate("/wellcome-5")}
          disabled={!selectedProfession}
        >
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeD;
