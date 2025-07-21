/* eslint-disable react/prop-types */
// WellcomeC.jsx - Modal only version
import { useState, useEffect } from "react";
import { useUserSelections } from "./useUserSelections";
import PurposeSelection from "./PurposeSelection";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

function WellcomeC({ onModalNext }) {
  const { state, dispatch } = useUserSelections();
  const [selectedPurpose, setSelectedPurpose] = useState(state.purpose);

  // Load from localStorage if available
  useEffect(() => {
    const savedSelections = AnonymousDataService.getUserSelections();
    if (savedSelections && savedSelections.purpose && !selectedPurpose) {
      setSelectedPurpose(savedSelections.purpose);
      dispatch({ type: "SET_PURPOSE", payload: savedSelections.purpose });
    }
  }, [dispatch, selectedPurpose]);

  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
    dispatch({ type: "SET_PURPOSE", payload: purpose });

    // Save to anonymous user service
    const existingSelections = AnonymousDataService.getUserSelections();
    AnonymousDataService.saveUserSelections({
      ...existingSelections,
      purpose,
    });
  };

  const handleContinue = () => {
    if (selectedPurpose) {
      // Generate application ID when user completes basic selections
      if (
        !localStorage.getItem(AnonymousDataService.STORAGE_KEYS.APPLICATION_ID)
      ) {
        AnonymousDataService.getApplicationId();
      }

      if (onModalNext) {
        onModalNext();
      }
    }
  };

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Gidiş amacınız</Heading>
        <PurposeSelection
          selectedPurpose={selectedPurpose}
          onPurposeChange={handlePurposeChange}
        />
        <Button
          variation="question"
          onClick={handleContinue}
          disabled={!selectedPurpose}
        >
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeC;