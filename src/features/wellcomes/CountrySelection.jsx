/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useCountries } from "./useCountries";
import { useState } from "react";
import Spinner from "../../ui/Spinner";

// Select kutusu için stil
const StyledSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 10px 0;
  width: 100%;
`;

// Radyo butonları için etiket stili
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;

  input[type="radio"] {
    margin-right: 10px;
  }
`;

// Üst div için stil
const Container = styled.div`
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

function CountrySelection({ onCountryChange }) {
  const { isLoading, schCounData, mainCounData } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    onCountryChange(e.target.value); // Bu satırı ekleyin
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <StyledSelect value={selectedCountry} onChange={handleCountryChange}>
        {schCounData &&
          schCounData.map((country) => (
            <option key={country.id} value={country.schCountryNames}>
              {country.schCountryNames}
            </option>
          ))}
      </StyledSelect>

      <div>
        {mainCounData &&
          mainCounData.map((country) => (
            <RadioLabel key={country.id}>
              <input
                type="radio"
                name={country.mainCountryNames}
                value={country.mainCountryNames}
                checked={selectedCountry === country.mainCountryNames}
                onChange={handleCountryChange}
              />
              {country.mainCountryNames}
            </RadioLabel>
          ))}
      </div>
    </Container>
  );
}

export default CountrySelection;
