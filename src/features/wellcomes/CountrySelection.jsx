/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useCountries } from "./useCountries";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";

// Stil tanımlamaları
const StyledSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 150px;
  height: 150px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5); /* Buzlu cam efekti */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  position: relative;
  border: ${({ isSelected }) => (isSelected ? "2px solid #3498db" : "none")};
`;

const StyledSelect = styled.select`
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  appearance: none;
  color: #4d4442;
  cursor: pointer;
  position: absolute;
  bottom: 10px;

  &::-ms-expand {
    display: none;
  }
`;

const RadioLabel = styled.label`
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.5); /* Buzlu cam efekti */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  position: relative;
  border: ${({ checked }) => (checked ? "2px solid #3498db" : "none")};

  @media (max-width: 450px) {
    font-size: 16px;
  }

  input[type="radio"] {
    display: none;
  }

  img {
    width: 80px; /* Bayrak boyutlarını büyütüyoruz */
    height: 50px;
    margin-bottom: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1000px; /* Genişlik sınırı */

  @media (max-width: 500px) {
    justify-content: space-around; /* Mobil ekranlarda düzgün sıralama için */
  }
`;

function CountrySelection({ selectedCountry, onCountryChange }) {
  const { isLoading, schCounData, mainCounData } = useCountries();
  const [flags, setFlags] = useState({});
  const [schengenFlag, setSchengenFlag] = useState("https://flagcdn.com/eu.svg");
  const [schengenSelected, setSchengenSelected] = useState(false);

  useEffect(() => {
    if (!schCounData || !mainCounData) return;

    const fetchFlags = async () => {
      const flagUrls = {};
      for (let country of [...schCounData, ...mainCounData]) {
        const countryName = country.schCountryNames || country.mainCountryNames;
        const code = countryToCode[countryName];
        if (code) {
          flagUrls[countryName] = `https://flagcdn.com/${code}.svg`;
        }
      }
      setFlags(flagUrls);
    };

    fetchFlags();
  }, [schCounData, mainCounData]);

  useEffect(() => {
    if (schCounData && schCounData.some((country) => country.schCountryNames === selectedCountry)) {
      setSchengenFlag(flags[selectedCountry]);
      setSchengenSelected(true);
    } else {
      setSchengenFlag("https://flagcdn.com/eu.svg");
      setSchengenSelected(false);
    }
  }, [selectedCountry, flags, schCounData]);

  // Event handler güncellemesi
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    onCountryChange(selectedValue);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <StyledSelectContainer isSelected={schengenSelected}>
        <img src={schengenFlag} alt="Schengen flag" />
        <StyledSelect value={selectedCountry} onChange={handleChange}>
          <option value="">{schengenSelected ? "" : "Schengen Ülkeleri"}</option>
          {schCounData.map((country) => (
            <option key={country.id} value={country.schCountryNames}>
              {country.schCountryNames}
            </option>
          ))}
        </StyledSelect>
      </StyledSelectContainer>

      {mainCounData.map((country) => {
        const countryName = country.mainCountryNames;
        return (
          <RadioLabel key={country.id} checked={selectedCountry === countryName}>
            <input
              type="radio"
              name={countryName}
              value={countryName}
              checked={selectedCountry === countryName}
              onChange={handleChange}
            />
            {flags[countryName] && <img src={flags[countryName]} alt={`${countryName} flag`} />}
            {countryName}
          </RadioLabel>
        );
      })}
    </Container>
  );
}

// Ülke adlarının bayrak kodlarına dönüştürülmesi
const countryToCode = {
  Almanya: "de",
  Avusturya: "at",
  Belçika: "be",
  Çekya: "cz",
  Danimarka: "dk",
  Estonya: "ee",
  Finlandiya: "fi",
  Fransa: "fr",
  Yunanistan: "gr",
  Macaristan: "hu",
  İzlanda: "is",
  İtalya: "it",
  Letonya: "lv",
  Litvanya: "lt",
  Lüksemburg: "lu",
  Malta: "mt",
  Hollanda: "nl",
  Norveç: "no",
  Polonya: "pl",
  Portekiz: "pt",
  Slovakya: "sk",
  Slovenya: "si",
  İspanya: "es",
  İsveç: "se",
  İsviçre: "ch",
  Lihtenştayn: "li",
  Rusya: "ru",
  ABD: "us",
  Çin: "cn",
  BAE: "ae",
  Avustralya: "au",
  Birleşik_Krallık: "gb",
  Hırvatistan: "hr",
};

export default CountrySelection;
