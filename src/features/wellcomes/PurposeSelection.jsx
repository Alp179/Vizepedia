/* eslint-disable react/prop-types */
import styled from "styled-components";

import Spinner from "../../ui/Spinner";
import { usePurpose } from "./usePurpose";

// Select kutusu için stil
const StyledSelect = styled.select`
font-size: 18px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 10px 0;
  width: 100%;
  @media (max-width: 450px) {
    font-size: 16px;
  }
`;

// Radyo butonları için etiket stili
const RadioLabel = styled.label`
font-size: 18px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;

  input[type="radio"] {
    margin-right: 10px;
  }
  @media (max-width: 450px) {
    font-size: 16px;
  }
`;

// Üst div için stil
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

function PurposeSelection({ onPurposeChange, selectedPurpose }) {
  const { isLoading, purposeRegData, purposeEdData } = usePurpose();

  const handlePurposeChange = (e) => {
    onPurposeChange(e.target.value); // Bu satırı ekleyin
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <StyledSelect value={selectedPurpose} onChange={handlePurposeChange}>
        <option value="">Eğitim</option>
        {purposeEdData &&
          purposeEdData.map((purpose) => (
            <option key={purpose.id} value={purpose.purposeEdDescription}>
              {purpose.purposeEdDescription}
            </option>
          ))}
      </StyledSelect>

      <div>
        {purposeRegData &&
          purposeRegData.map((purpose) => (
            <RadioLabel key={purpose.id}>
              <input
                type="radio"
                name={purpose.purposeRegDescription}
                value={purpose.purposeRegDescription}
                checked={selectedPurpose === purpose.purposeRegDescription}
                onChange={handlePurposeChange}
              />
              {purpose.purposeRegDescription}
            </RadioLabel>
          ))}
      </div>
    </Container>
  );
}

export default PurposeSelection;
