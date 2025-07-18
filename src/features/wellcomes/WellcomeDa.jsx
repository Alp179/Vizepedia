import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import SponsorProfessionSelection from "./SponsorProfessionSelection";
import { AnonymousDataService } from "../../utils/anonymousDataService";

function WellcomeDa() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections();
  const [selectedSponsorProfession, setSelectedSponsorProfession] = useState(
    state.sponsorProfession || ""
  );

  // Load from localStorage if available
  useEffect(() => {
    const savedSelections = AnonymousDataService.getUserSelections();
    if (savedSelections && savedSelections.sponsorProfession && !selectedSponsorProfession) {
      setSelectedSponsorProfession(savedSelections.sponsorProfession);
      dispatch({ type: "SET_SPONSOR_PROFESSION", payload: savedSelections.sponsorProfession });
    }
  }, [dispatch, selectedSponsorProfession]);

  const handleSponsorProfessionChange = (profession) => {
    setSelectedSponsorProfession(profession);
    dispatch({ type: "SET_SPONSOR_PROFESSION", payload: profession });

    // Save to anonymous user service
    const existingSelections = AnonymousDataService.getUserSelections();
    AnonymousDataService.saveUserSelections({
      ...existingSelections,
      sponsorProfession: profession,
    });
  };

  const handleNext = () => {
    navigate("/wellcome-5");
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
