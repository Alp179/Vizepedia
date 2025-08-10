/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import { useVehicles } from "./useVehicles";
import { useKids } from "./useKids";
import { useAccommodations } from "./useAccommodations";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 8px 300px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  background: rgba(255, 255, 255, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.52);
  width: 100%;
  max-width: 400px;

  @media (max-height: 810px) {
    gap: 8px;
  }
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
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 18px;
  margin: 0.5rem;
  text-align: center;
  width: 100%;
  max-width: 140px;
  @media (max-height: 925px) {
    padding: 0.1rem 1rem;
  }

  &:hover {
    border: 1px solid #00c853;
  }

  &:active {
    border: 1px solid #00c853;
  }
`;

const Section = styled.div`
  margin-bottom: 0.1rem;
  text-align: center;

  h4 {
    margin-bottom: 1rem;
  }

  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-height: 800px) {
    display: none;
  }
`;

const HorizontalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  @media (max-height: 800px) {
    display: none;
  }
`;

const DropdownContainer = styled.div`
  display: none;
  width: 100%;
  max-width: 300px;

  @media (max-height: 800px) {
    display: block;
  }
`;

const DropdownSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 16px;
  border: 1px solid #ccc;
  background: var(--color-grey-2);
  font-size: 16px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border: 2px solid #3498db;
  }
`;

const Divider = styled.div`
  width: 80%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 1rem 0;
  @media (max-height: 925px) {
    margin: 0.3rem 0;
  }
`;

const VerticalDivider = styled.div`
  height: 24px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.2);
`;

function OtherQSelections({
  selectedAccommodation,
  selectedKid,
  selectedVehicle,
  onVehicleChange,
  onKidChange,
  onAccommodationChange,
}) {
  const { isLoadingVehicles, vehiclesData } = useVehicles();
  const { isLoadingKids, kidsData } = useKids();
  const { isLoadingAccommodation, accommodationsData } = useAccommodations();

  const handleVehicle = (value) => {
    onVehicleChange(value);
  };

  const handleKid = (value) => {
    onKidChange(value);
  };

  const handleAccommodation = (value) => {
    onAccommodationChange(value);
  };

  if (isLoadingVehicles && isLoadingKids && isLoadingAccommodation) {
    return <Spinner />;
  }

  return (
    <Container>
      <Section>
        <Heading as="h7">Konaklama türü</Heading>
        
        {/* Büyük ekranlar için butonlar */}
        <HorizontalButtonGroup style={{ marginLeft: "-24px" }}>
          {accommodationsData &&
            accommodationsData.map((accommodation, index) => (
              <React.Fragment key={accommodation.id}>
                <SelectionButton
                  isSelected={
                    selectedAccommodation ===
                    accommodation.accommodationTypeName
                  }
                  onClick={() =>
                    handleAccommodation(accommodation.accommodationTypeName)
                  }
                >
                  {accommodation.accommodationTypeName}
                </SelectionButton>
                {index < accommodationsData.length - 1 && <VerticalDivider />}
              </React.Fragment>
            ))}
        </HorizontalButtonGroup>

        {/* Küçük ekranlar için dropdown */}
        <DropdownContainer>
          <DropdownSelect
            value={selectedAccommodation || ""}
            onChange={(e) => handleAccommodation(e.target.value)}
          >
            <option value="">Konaklama türü seçin</option>
            {accommodationsData &&
              accommodationsData.map((accommodation) => (
                <option
                  key={accommodation.id}
                  value={accommodation.accommodationTypeName}
                >
                  {accommodation.accommodationTypeName}
                </option>
              ))}
          </DropdownSelect>
        </DropdownContainer>
      </Section>

      <Divider />

      <Section>
        <Heading as="h7">Seyahat Aracı</Heading>
        
        {/* Büyük ekranlar için butonlar */}
        <ButtonGroup>
          {vehiclesData &&
            vehiclesData.map((vehicles) => (
              <SelectionButton
                style={{ textAlign: "center" }}
                key={vehicles.id}
                isSelected={selectedVehicle === vehicles.travelVehicleName}
                onClick={() => handleVehicle(vehicles.travelVehicleName)}
              >
                {vehicles.travelVehicleName}
              </SelectionButton>
            ))}
        </ButtonGroup>

        {/* Küçük ekranlar için dropdown */}
        <DropdownContainer>
          <DropdownSelect
            value={selectedVehicle || ""}
            onChange={(e) => handleVehicle(e.target.value)}
          >
            <option value="">Seyahat aracı seçin</option>
            {vehiclesData &&
              vehiclesData.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.travelVehicleName}>
                  {vehicle.travelVehicleName}
                </option>
              ))}
          </DropdownSelect>
        </DropdownContainer>
      </Section>

      <Divider />

      <Section>
        <Heading as="h7">Çocuklu yolculuk</Heading>
        
        {/* Büyük ekranlar için butonlar */}
        <HorizontalButtonGroup>
          {kidsData &&
            kidsData.map((kids, index) => (
              <React.Fragment key={kids.id}>
                <SelectionButton
                  isSelected={selectedKid === kids.kidState}
                  onClick={() => handleKid(kids.kidState)}
                >
                  {kids.kidState}
                </SelectionButton>
                {index < kidsData.length - 1 && <VerticalDivider />}
              </React.Fragment>
            ))}
        </HorizontalButtonGroup>

        {/* Küçük ekranlar için dropdown */}
        <DropdownContainer>
          <DropdownSelect
            value={selectedKid || ""}
            onChange={(e) => handleKid(e.target.value)}
          >
            <option value="">Çocuk durumu seçin</option>
            {kidsData &&
              kidsData.map((kid) => (
                <option key={kid.id} value={kid.kidState}>
                  {kid.kidState}
                </option>
              ))}
          </DropdownSelect>
        </DropdownContainer>
      </Section>
    </Container>
  );
}

export default OtherQSelections;