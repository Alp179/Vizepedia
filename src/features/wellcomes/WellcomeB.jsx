/* eslint-disable react/prop-types */
// WellcomeB.jsx - Modal only version with auth user support
import { useUserSelections } from "./useUserSelections";
import Heading from "../../ui/Heading";
import CountrySelection from "./CountrySelection";
import Button from "../../ui/Button";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";
import { useUser } from "../authentication/useUser";

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

function WellcomeB({ onModalNext }) {
  const { state, dispatch } = useUserSelections();
  const { user, userType } = useUser();
  const [selectedCountry, setSelectedCountry] = useState(state.country);

  // Determine if we should save to sessionStorage (only for anonymous users)
  const shouldSaveToSessionStorage = !user || userType !== "authenticated";

  // Load from sessionStorage only if anonymous
  useEffect(() => {
    if (shouldSaveToSessionStorage) {
      const savedSelections = AnonymousDataService.getUserSelections();
      if (savedSelections && savedSelections.country && !selectedCountry) {
        setSelectedCountry(savedSelections.country);
        dispatch({ type: "SET_COUNTRY", payload: savedSelections.country });
      }
    }
  }, [dispatch, selectedCountry, shouldSaveToSessionStorage]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    dispatch({ type: "SET_COUNTRY", payload: country });

    // Only save to sessionStorage for anonymous users
    if (shouldSaveToSessionStorage) {
      AnonymousDataService.saveUserSelections({
        country,
      });
    }
  };

  const handleContinue = () => {
    console.log("WellcomeB handleContinue called");
    console.log("selectedCountry:", selectedCountry);
    console.log("user:", user);
    console.log("shouldSaveToSessionStorage:", shouldSaveToSessionStorage);
    
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