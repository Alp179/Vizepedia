import { useState } from "react"; // useState import edin
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";

import OtherQSelections from "./OtherQSelections";

function WellcomeE() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(""); // Seçilen ülkeyi takip etmek için durum
  const [selectedKid, setSelectedKid] = useState("");
  const [selectedAccommodation, setSelectedAccommodation] = useState("");

  const handleKidChange = (kid) => {
    setSelectedKid(kid);
  };

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodation(accommodation);
  };

  return (
    <>
      <Heading as="h1">
        Lütfen konaklama türünüzü , seyahat aracınızı ve çocuklu yolculuk
        durumunuzu seçiniz
      </Heading>
      <OtherQSelections
        onVehicleChange={handleVehicleChange}
        onKidChange={handleKidChange}
        onAccommodationChange={handleAccommodationChange}
      />
      <Button
        onClick={() => navigate("/wellcome-2")}
        disabled={!selectedVehicle || !selectedKid || !selectedAccommodation} // Seçilen ülke yoksa butonu etkisizleştir
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeE;
