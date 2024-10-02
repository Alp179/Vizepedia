import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import Heading from "../../ui/Heading";
import CountrySelection from "./CountrySelection";
import Button from "../../ui/Button";
import { useState, useEffect } from "react";
import styled from "styled-components";

function WellcomeB() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections();
  const [selectedCountry, setSelectedCountry] = useState(state.country);

  // Anonim kullanıcı kontrolü için localStorage
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";

  const handleCountryChange = (country) => {
    setSelectedCountry(country);

    // Eğer anonim kullanıcı ise, seçimi localStorage'a kaydet
    if (isAnonymous) {
      localStorage.setItem("selectedCountry", country);
    } else {
      // Kayıtlı kullanıcılar için state'i güncelle
      dispatch({ type: "SET_COUNTRY", payload: country });
    }
  };

  useEffect(() => {
    // Eğer anonim kullanıcı ise, localStorage'dan seçili ülkeyi al ve state'e yükle
    if (isAnonymous) {
      const savedCountry = localStorage.getItem("selectedCountry");
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
    }
  }, [isAnonymous]);

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
