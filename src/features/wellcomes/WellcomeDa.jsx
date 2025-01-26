import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";

import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import SponsorProfessionSelection from "./SponsorProfessionSelection";

// Anonim kullanıcı seçimlerini kaydetmek için fonksiyon
function saveAnonymousUserSelections(selections) {
  const userSelections = {
    country: selections.country || "",
    purpose: selections.purpose || "",
    profession: selections.profession || "",
    vehicle: selections.vehicle || "",
    kid: selections.kid || "",
    accommodation: selections.accommodation || "",
    hasSponsor: selections.hasSponsor || false,
    sponsorProfession: selections.sponsorProfession || "",
  };

  // Seçimleri localStorage'a kaydet
  localStorage.setItem("userSelections", JSON.stringify(userSelections));
}

function WellcomeDa() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // Global state'e erişim ve güncelleme
  const [selectedSponsorProfession, setSelectedSponsorProfession] = useState(
    state.sponsorProfession
  );

  const handleSponsorProfessionChange = (profession) => {
    setSelectedSponsorProfession(profession);
    dispatch({ type: "SET_SPONSOR_PROFESSION", payload: profession });

    // Anonim kullanıcı seçimlerini kaydet
    saveAnonymousUserSelections({
      ...state,
      sponsorProfession: profession,
    });
  };

  const handleNext = () => {
    navigate("/wellcome-5"); // Kullanıcıyı bir sonraki adıma yönlendir
  };

  const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `;

  // Kaldırılacak meslekler listesi
  const excludedProfessions = ["Çocuk (0-6 yaş)", "Öğrenci"];

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Sponsorunuzun Mesleği</Heading>
        <SponsorProfessionSelection
          selectedProfession={selectedSponsorProfession}
          onProfessionChange={handleSponsorProfessionChange}
          filterProfessions={(professions) =>
            professions.filter(
              (profession) => !excludedProfessions.includes(profession)
            )
          }
        />
        <Button
          variation="question"
          onClick={handleNext}
          disabled={!selectedSponsorProfession}
        >
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeDa;
