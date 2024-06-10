/* eslint-disable react/prop-types */
import styled from "styled-components";

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

function ProfessionSelection({ onProfessionChange, selectedProfession }) {
  const { isLoading, professionsData } = useProfessions();

  const handleProfession = (e) => {
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
