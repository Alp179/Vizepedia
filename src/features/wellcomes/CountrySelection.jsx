/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useCountries } from "./useCountries";

import Spinner from "../../ui/Spinner";

/// Stil tanımlamaları
const StyledSelect = styled.select`
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 10px 0;
  width: 100%;
  color: #4D4442;
  @media (max-width: 450px) {
    font-size: 16px;
  }
`;

const RadioLabel = styled.label`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  @media (max-width: 450px) {
    font-size: 16px;
  }

  input[type="radio"] {
    margin-right: 10px;
  }
`;

const Container = styled.div`
  min-width: 600px;
  @media (max-width: 850px) {
    min-width: 500px;
  }
  @media (max-width: 600px) {
    min-width: 400px;
  }
  @media (max-width: 450px) {
    min-width: 350px;
  }
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: var(--color-grey-51);
`;

function CountrySelection({ selectedCountry, onCountryChange }) {
  const { isLoading, schCounData, mainCounData } = useCountries();

  // Event handler güncellemesi
  const handleChange = (e) => {
    onCountryChange(e.target.value);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <StyledSelect value={selectedCountry} onChange={handleChange}>
        <option value="">Schengen Ülkeleri</option>
        {schCounData.map((country) => (
          <option key={country.id} value={country.schCountryNames}>
            {country.schCountryNames}
          </option>
        ))}
      </StyledSelect>

      {mainCounData.map((country) => (
        <RadioLabel key={country.id}>
          <input
            type="radio"
            name={country.mainCountryNames}
            value={country.mainCountryNames}
            checked={selectedCountry === country.mainCountryNames}
            onChange={handleChange}
          />
          {country.mainCountryNames}
        </RadioLabel>
      ))}
    </Container>
  );
}

export default CountrySelection;
