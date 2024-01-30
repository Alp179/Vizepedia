import { useState } from "react"; // useState import edin
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import PurposeSelection from "./PurposeSelection";

function WellcomeC() {
  const navigate = useNavigate();
  const [selectedPurpose, setSelectedPurpose] = useState(""); // Seçilen ülkeyi takip etmek için durum

  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
  };

  return (
    <>
      <Heading as="h1">Gidiş amacınızı seçiniz</Heading>
      <PurposeSelection onPurposeChange={handlePurposeChange} />
      <Button
        onClick={() => navigate("/wellcome-4")}
        disabled={!selectedPurpose} // Seçilen ülke yoksa butonu etkisizleştir
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeC;
