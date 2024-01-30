/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useState } from "react";
import Spinner from "../../ui/Spinner";

import { useProfessions } from "./useProfession";

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

function ProfessionSelection({ onProfessionChange }) {
  const { isLoading, professionsData } = useProfessions();
  const [selectedProfession, setSelectedProfession] = useState("");

  const handleProfession = (e) => {
    setSelectedProfession(e.target.value);
    onProfessionChange(e.target.value); // Bu satırı ekleyin
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <div>
        {professionsData &&
          professionsData.map((professions) => (
            <RadioLabel key={professions.id}>
              <input
                type="radio"
                name={professions.professionName}
                value={professions.professionName}
                checked={selectedProfession === professions.professionName}
                onChange={handleProfession}
              />
              {professions.professionName}
            </RadioLabel>
          ))}
      </div>
    </Container>
  );
}

export default ProfessionSelection;
