import { useState } from "react"; // useState import edin
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";

import ProfessionSelection from "./ProfessionSelection";

function WellcomeD() {
  const navigate = useNavigate();
  const [selectedProfession, setSelectedProfession] = useState(""); // Seçilen ülkeyi takip etmek için durum

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
  };

  return (
    <>
      <Heading as="h1">Mesleğinizi seçiniz</Heading>
      <ProfessionSelection onProfessionChange={handleProfessionChange} />
      <Button
        onClick={() => navigate("/wellcome-5")}
        disabled={!selectedProfession} // Seçilen ülke yoksa butonu etkisizleştir
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeD;
