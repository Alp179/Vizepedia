import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import Heading from "../../ui/Heading";
import CountrySelection from "./CountrySelection";
import Button from "../../ui/Button";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";

function WellcomeB() {
  const navigate = useNavigate();
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

  const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `;

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
          onClick={() => navigate("/wellcome-3")}
          disabled={!selectedCountry}
        >
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeB;