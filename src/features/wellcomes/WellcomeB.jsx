// WellcomeB.js

import { useState } from "react"; // useState import edin
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import CountrySelection from "./CountrySelection";

function WellcomeB() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(""); // Seçilen ülkeyi takip etmek için durum

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  return (
    <>
      <Heading as="h1">Vize almak istediğiniz ülkeyi seçiniz</Heading>
      <CountrySelection onCountryChange={handleCountryChange} />
      <Button
        onClick={() => navigate("/wellcome-3")}
        disabled={!selectedCountry} // Seçilen ülke yoksa butonu etkisizleştir
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeB;
