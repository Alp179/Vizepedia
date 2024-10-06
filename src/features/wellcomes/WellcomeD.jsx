import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import ProfessionSelection from "./ProfessionSelection";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";

// Anonim kullanıcı seçimlerini kaydetmek için fonksiyon
function saveAnonymousUserSelections(selections) {
  const userSelections = {
    country: selections.country || "", // Daha önceki adımda seçilen ülke
    purpose: selections.purpose || "", // Daha önceki adımda seçilen gidiş amacı
    profession: selections.profession, // Bu adımda seçilen meslek
    vehicle: selections.vehicle || "",
    kid: selections.kid || "",
    accommodation: selections.accommodation || "",
  };

  // Seçimleri localStorage'a kaydet
  localStorage.setItem("userSelections", JSON.stringify(userSelections));
}

function WellcomeD() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedProfession, setSelectedProfession] = useState(
    state.profession
  );

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    dispatch({ type: "SET_PROFESSION", payload: profession }); // Global state'i güncelleyin

    // Anonim kullanıcı seçimlerini kaydet
    saveAnonymousUserSelections({
      ...state,
      profession,
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
