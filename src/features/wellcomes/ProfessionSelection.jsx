/* eslint-disable react/prop-types */
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useProfessions } from "./useProfession";
import { useState, useRef, useEffect } from "react";

const Container = styled.div`
  position: relative;
  max-height: calc(100vh - 40rem);
  overflow: auto;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2); /* Gölgeyi artırdık */
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  background: ${({ hasOverflow }) =>
    hasOverflow ? "rgba(255, 255, 255, 0.37)" : "rgba(255, 255, 255, 0.37)"};
  border: 1px solid rgba(255, 255, 255, 0.52);
  width: 100%;
  max-width: 400px;

  @media (max-width: 450px) {
    max-width: 300px;
  }

  &::-webkit-scrollbar {
    width: 16px;
    @media (max-width: 710px) {
      width: 12px;
    }
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
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

function ProfessionSelection({ onProfessionChange, selectedProfession }) {
  const { isLoading, professionsData } = useProfessions();
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef(null);

  const handleProfession = (value) => {
    onProfessionChange(value);
  };

  // Overflow kontrol useEffect'i
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        setHasOverflow(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [professionsData]); // professionsData değiştiğinde de kontrol et

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container ref={containerRef} hasOverflow={hasOverflow}>
      <ButtonGroup>
        {professionsData &&
          professionsData.map((profession) => (
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

export default ProfessionSelection;