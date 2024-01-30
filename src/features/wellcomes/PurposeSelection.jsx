/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useState } from "react";
import Spinner from "../../ui/Spinner";
import { usePurpose } from "./usePurpose";

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

function PurposeSelection({ onPurposeChange }) {
  const { isLoading, purposeRegData, purposeEdData } = usePurpose();
  const [selectedPurpose, setSelectedPurpose] = useState("");

  const handlePurposeChange = (e) => {
    setSelectedPurpose(e.target.value);
    onPurposeChange(e.target.value); // Bu satırı ekleyin
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <StyledSelect value={selectedPurpose} onChange={handlePurposeChange}>
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
