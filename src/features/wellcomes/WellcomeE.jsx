import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import OtherQSelections from "./OtherQSelections";
import { useUserSelections } from "./useUserSelections";

function WellcomeE() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedVehicle, setSelectedVehicle] = useState(state.vehicle);
  const [selectedKid, setSelectedKid] = useState(state.kid);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    state.accommodation
  );

  // Dispatch fonksiyonunu kullanarak global state güncellemeleri
  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    dispatch({ type: "SET_VEHICLE", payload: vehicle });
  };

  const handleKidChange = (kid) => {
    setSelectedKid(kid);
    dispatch({ type: "SET_KID", payload: kid });
  };

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodation(accommodation);
    dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });
  };

  return (
    <>
      <Heading as="h1">
        Lütfen konaklama türünüzü, seyahat aracınızı ve çocuklu yolculuk
        durumunuzu seçiniz
      </Heading>
      <OtherQSelections
        selectedAccommodation={selectedAccommodation}
        selectedKid={selectedKid}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleVehicleChange}
        onKidChange={handleKidChange}
        onAccommodationChange={handleAccommodationChange}
      />
      <Button
        onClick={() => navigate("/test")}
        disabled={!selectedVehicle || !selectedKid || !selectedAccommodation}
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeE;
