/* eslint-disable react/prop-types */
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useProfessions } from "./useProfession";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2); /* Gölgeyi artırdık */
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  background: rgba(255, 255, 255, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.52);
  width: 100%;
  max-width: 400px;
  @media (max-width: 450px) {
    max-width: 300px;
  }
`;

const SelectionButton = styled.button`
  background-color: ${(props) =>
    props.isSelected ? "#87f9cd" : "transparent"};
  color: ${(props) => (props.isSelected ? "#004466" : "#000000")};
  border: 1px solid ${(props) => (props.isSelected ? "#004466" : "transparent")};
  border-radius: 16px;
  padding: 0.7rem 1rem;
  @media (max-height: 885px) {
    padding: 0.74rem 0.5rem;
  }
  cursor: pointer;
  font-size: 18px;
  margin: 0.3rem 0; /* Dikey sıralama için üst ve alt margin */
  width: 100%;
  max-width: 300px;

  &:hover {
    border: 1px solid #00c853;
  }

  &:active {
    border: 1px solid #00c853;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column; /* Dikey sıralama */
  align-items: center;
  gap: 5px; /* Butonlar arasındaki boşluğu azalt */
  @media (max-height: 885px) {
    gap: 0;
  }
`;

function SponsorProfessionSelection({
  onProfessionChange,
  selectedProfession,
}) {
  const { isLoading, professionsData } = useProfessions();

  const handleProfession = (value) => {
    onProfessionChange(value);
  };

  if (isLoading) {
    return <Spinner />;
  }

  // "Çocuk (0-6 yaş)" ve "Öğrenci" mesleklerini filtrele
  const filteredProfessions =
    professionsData?.filter(
      (profession) =>
        profession.professionName !== "Çocuk (0-6 yaş)" &&
        profession.professionName !== "Öğrenci"
    ) || [];

  return (
    <Container>
      <ButtonGroup>
        {filteredProfessions.map((profession) => (
          <SelectionButton
            key={profession.id}
            isSelected={selectedProfession === profession.professionName}
            onClick={() => handleProfession(profession.professionName)}
          >
            {profession.professionName}
          </SelectionButton>
        ))}
      </ButtonGroup>
    </Container>
  );
}

export default SponsorProfessionSelection;
