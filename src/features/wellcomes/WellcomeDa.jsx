/* eslint-disable react/prop-types */
// WellcomeDa.jsx - Modal only version with auth user support
import { useState, useEffect } from "react";
import { useUserSelections } from "./useUserSelections";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import SponsorProfessionSelection from "./SponsorProfessionSelection";
import { AnonymousDataService } from "../../utils/anonymousDataService";
import { useUser } from "../authentication/useUser";

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

function WellcomeDa({ onModalNext }) {
  const { state, dispatch } = useUserSelections();
  const { user, userType } = useUser();
  const [selectedSponsorProfession, setSelectedSponsorProfession] = useState(
    state.sponsorProfession || ""
  );

  // Determine if we should save to sessionStorage (only for anonymous users)
  const shouldSaveToSessionStorage = !user || userType !== "authenticated";

  // Load from sessionStorage only if anonymous
  useEffect(() => {
    if (shouldSaveToSessionStorage) {
      const savedSelections = AnonymousDataService.getUserSelections();
      if (savedSelections && savedSelections.sponsorProfession && !selectedSponsorProfession) {
        setSelectedSponsorProfession(savedSelections.sponsorProfession);
        dispatch({ type: "SET_SPONSOR_PROFESSION", payload: savedSelections.sponsorProfession });
      }
    }
  }, [dispatch, selectedSponsorProfession, shouldSaveToSessionStorage]);

  const handleSponsorProfessionChange = (profession) => {
    setSelectedSponsorProfession(profession);
    dispatch({ type: "SET_SPONSOR_PROFESSION", payload: profession });

    // Only save to sessionStorage for anonymous users
    if (shouldSaveToSessionStorage) {
      const existingSelections = AnonymousDataService.getUserSelections();
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        sponsorProfession: profession,
      });
    }
  };

  const handleNext = () => {
    console.log("WellcomeDa handleNext called");
    console.log("selectedSponsorProfession:", selectedSponsorProfession);
    console.log("shouldSaveToSessionStorage:", shouldSaveToSessionStorage);
    
    if (selectedSponsorProfession && onModalNext) {
      console.log("Calling onModalNext from WellcomeDa");
      onModalNext();
    } else {
      console.log("Cannot proceed - selectedSponsorProfession:", selectedSponsorProfession, "onModalNext:", !!onModalNext);
    }
  };

  // Excluded professions list
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