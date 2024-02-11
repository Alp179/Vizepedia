/* eslint-disable react/prop-types */
import styled from "styled-components";

import Spinner from "../../ui/Spinner";

import { useVehicles } from "./useVehicles";
import { useKids } from "./useKids";
import { useAccommodations } from "./useAccommodations";

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

  const handleVehicle = (e) => {
    onVehicleChange(e.target.value); // Bu satırı ekleyin
  };

  const handleKid = (e) => {
    onKidChange(e.target.value); // Bu satırı ekleyin
  };

  const handleAccommodation = (e) => {
    onAccommodationChange(e.target.value); // Bu satırı ekleyin
  };

  if (isLoadingVehicles && isLoadingKids && isLoadingAccommodation) {
    return <Spinner />;
  }

  return (
    <>
      <Container>
        <div>
          <h2>Konaklama türü</h2>
          {accommodationsData &&
            accommodationsData.map((accommodation) => (
              <RadioLabel key={accommodation.id}>
                <input
                  type="radio"
                  name={accommodation.accommodationTypeName}
                  value={accommodation.accommodationTypeName}
                  checked={
                    selectedAccommodation ===
                    accommodation.accommodationTypeName
                  }
                  onChange={handleAccommodation}
                />
                {accommodation.accommodationTypeName}
              </RadioLabel>
            ))}
        </div>
      </Container>

      <Container>
        <div>
          <h2>Seyahat Aracı</h2>
          {vehiclesData &&
            vehiclesData.map((vehicles) => (
              <RadioLabel key={vehicles.id}>
                <input
                  type="radio"
                  name={vehicles.travelVehicleName}
                  value={vehicles.travelVehicleName}
                  checked={selectedVehicle === vehicles.travelVehicleName}
                  onChange={handleVehicle}
                />
                {vehicles.travelVehicleName}
              </RadioLabel>
            ))}
        </div>
      </Container>

      <Container>
        <div>
          <h2>Çocuklu yolculuk </h2>
          {kidsData &&
            kidsData.map((kids) => (
              <RadioLabel key={kids.id}>
                <input
                  type="radio"
                  name={kids.kidState}
                  value={kids.kidState}
                  checked={selectedKid === kids.kidState}
                  onChange={handleKid}
                />
                {kids.kidState}
              </RadioLabel>
            ))}
        </div>
      </Container>
    </>
  );
}

export default OtherQSelections;
