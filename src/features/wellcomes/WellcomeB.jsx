/* eslint-disable react/prop-types */
// WellcomeB.jsx - Modal only version
import { useUserSelections } from "./useUserSelections";
import Heading from "../../ui/Heading";
import CountrySelection from "./CountrySelection";
import Button from "../../ui/Button";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

function WellcomeB({ onModalNext }) {
  const { state, dispatch } = useUserSelections();
  const [selectedCountry, setSelectedCountry] = useState(state.country);

  // Load from localStorage if available
  useEffect(() => {
    const savedSelections = AnonymousDataService.getUserSelections();
    if (savedSelections && savedSelections.country && !selectedCountry) {
      setSelectedCountry(savedSelections.country);
      dispatch({ type: "SET_COUNTRY", payload: savedSelections.country });
    }
  }, [dispatch, selectedCountry]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    dispatch({ type: "SET_COUNTRY", payload: country });

    // Save to anonymous user service
    AnonymousDataService.saveUserSelections({
      country,
    });
  };

  const handleContinue = () => {
    console.log("WellcomeB handleContinue called");
    console.log("selectedCountry:", selectedCountry);
    console.log("onModalNext type:", typeof onModalNext);
    
    if (selectedCountry && onModalNext) {
      console.log("Calling onModalNext from WellcomeB");
      onModalNext();
    } else {
      console.log("Cannot proceed - selectedCountry:", selectedCountry, "onModalNext:", !!onModalNext);
    }
  };

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Vize almak istediğiniz ülke</Heading>
        <CountrySelection
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
        />
        <Button
          variation="question"
          onClick={handleContinue}
          disabled={!selectedCountry}
        >
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeB;