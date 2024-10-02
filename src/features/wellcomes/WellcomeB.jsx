import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import Heading from "../../ui/Heading";
import CountrySelection from "./CountrySelection";
import Button from "../../ui/Button";
import { useState } from "react";
import styled from "styled-components";

function WellcomeB() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections();
  const [selectedCountry, setSelectedCountry] = useState(state.country);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    dispatch({ type: "SET_COUNTRY", payload: country });
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
        <Heading as="h5">Vize almak istediğiniz ülkeyi seçiniz</Heading>
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
