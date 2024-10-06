import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import PurposeSelection from "./PurposeSelection";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import styled from "styled-components";

// Anonim kullanıcı seçimlerini kaydetmek için fonksiyon
function saveAnonymousUserSelections(selections) {
  const userSelections = {
    country: selections.country || "", // Daha önceki adımda seçilen ülke
    purpose: selections.purpose, // Bu adımda seçilen gidiş amacı
    profession: selections.profession || "",
    vehicle: selections.vehicle || "",
    kid: selections.kid || "",
    accommodation: selections.accommodation || "",
  };

  // Seçimleri localStorage'a kaydet
  localStorage.setItem("userSelections", JSON.stringify(userSelections));
}

function WellcomeC() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedPurpose, setSelectedPurpose] = useState(state.purpose);

  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
    dispatch({ type: "SET_PURPOSE", payload: purpose }); // Global state'i güncelleyin
    
    // Anonim kullanıcı seçimlerini kaydet
    saveAnonymousUserSelections({
      ...state,
      purpose,
    });
  };

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
