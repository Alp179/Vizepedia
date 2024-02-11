import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import Heading from "../../ui/Heading";
import CountrySelection from "./CountrySelection";
import Button from "../../ui/Button";
import { useState } from "react";

function WellcomeB() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections();
  const [selectedCountry, setSelectedCountry] = useState(state.country);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    dispatch({ type: "SET_COUNTRY", payload: country });
  };

  return (
    <>
      <Heading as="h1">Vize almak istediğiniz ülkeyi seçiniz</Heading>
      <CountrySelection
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
      />
      <Button
        onClick={() => navigate("/wellcome-3")}
        disabled={!selectedCountry}
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeB;
