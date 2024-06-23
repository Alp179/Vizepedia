/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { usePurpose } from "./usePurpose";
import DropdownMenuComponent from "../../ui/DrodownMenu";

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
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.7); /* Hover durumu için daha açık renk */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }

  img {
    width: 60px; /* İkon boyutlarını ayarlıyoruz */
    height: 60px;
    margin-bottom: 10px;
  }
`;

const RadioLabel = styled.label`
  z-index: 0;
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
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.7); /* Hover durumu için daha açık renk */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }

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

  .icon {
    width: 60px; /* İkon boyutları */
    height: 60px;
    margin-bottom: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1000px; /* Genişlik sınırı */
  position: relative;

  @media (max-width: 768px) {
    justify-content: space-around; /* Mobil ekranlarda düzgün sıralama için */
  }
`;

function PurposeSelection({ onPurposeChange, selectedPurpose }) {
  const { isLoading, purposeRegData, purposeEdData } = usePurpose();
  const [dropdownSelection, setDropdownSelection] = useState("");

  const handleDropdownChange = (value) => {
    setDropdownSelection(value);
    onPurposeChange(value);
  };

  const handleRadioChange = (value) => {
    onPurposeChange(value);
    setDropdownSelection(""); // Seçim yapılınca dropdown seçim sıfırlanır
  };

  useEffect(() => {
    if (
      selectedPurpose &&
      !purposeEdData.some((p) => p.purposeEdDescription === selectedPurpose)
    ) {
      setDropdownSelection("");
    }
  }, [selectedPurpose, purposeEdData]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <StyledSelectContainer isSelected={selectedPurpose.includes("Eğitim")}>
        <DropdownMenuComponent
          options={purposeEdData.map((purpose) => ({
            id: purpose.id,
            value: purpose.purposeEdDescription,
            label: purpose.purposeEdDescription,
          }))}
          selected={selectedPurpose}
          onSelect={handleDropdownChange}
          displayText={dropdownSelection ? dropdownSelection : "Eğitim"}
        />
      </StyledSelectContainer>

      {purposeRegData &&
        purposeRegData.map((purpose) => {
          let iconUrl;
          switch (purpose.purposeRegDescription) {
            case "Ticari":
              iconUrl =
                "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-business-1162295_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLWJ1c2luZXNzLTExNjIyOTVfMS5zdmciLCJpYXQiOjE3MTkxNDIxMTMsImV4cCI6MTA3MjQyMjI2OTEzfQ.8964hbXAXbJJPBORy_hzAOFhaHROuZfiGMlVgXKdAyU&t=2024-06-23T11%3A28%3A33.759Z";
              break;
            case "Ziyaret":
              iconUrl =
                "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-friends-963723_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLWZyaWVuZHMtOTYzNzIzXzEuc3ZnIiwiaWF0IjoxNzE5MTQyMTY4LCJleHAiOjEzMTUxNzYyOTY4fQ.mgtTK3YGuj3ZtW4HlLDMmIz1cBrUFbgWE5AiPyKzTvs&t=2024-06-23T11%3A29%3A28.212Z";
              break;
            case "Turistik":
              iconUrl =
                "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-tourist-destination-5141887_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLXRvdXJpc3QtZGVzdGluYXRpb24tNTE0MTg4N18xLnN2ZyIsImlhdCI6MTcxOTE0MjIxOCwiZXhwIjo1NDcxODM5ODE4fQ.Qggr2GkcbZ_RkBDvOMFFJgi7YKTyPQpOxGpyQ3HJmDc&t=2024-06-23T11%3A30%3A18.797Z";
              break;
            default:
              iconUrl = "";
              break;
          }

          return (
            <RadioLabel
              key={purpose.id}
              checked={selectedPurpose === purpose.purposeRegDescription}
            >
              <input
                type="radio"
                name={purpose.purposeRegDescription}
                value={purpose.purposeRegDescription}
                checked={selectedPurpose === purpose.purposeRegDescription}
                onChange={() =>
                  handleRadioChange(purpose.purposeRegDescription)
                }
              />
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt={purpose.purposeRegDescription}
                  className="icon"
                />
              )}
              {purpose.purposeRegDescription}
            </RadioLabel>
          );
        })}
    </Container>
  );
}

export default PurposeSelection;
