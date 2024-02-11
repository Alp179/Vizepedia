import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import ProfessionSelection from "./ProfessionSelection";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";

function WellcomeD() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedProfession, setSelectedProfession] = useState(
    state.profession
  );

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    dispatch({ type: "SET_PROFESSION", payload: profession }); // Global state'i güncelleyin
  };

  return (
    <>
      <Heading as="h1">Mesleğinizi seçiniz</Heading>
      <ProfessionSelection
        selectedProfession={selectedProfession}
        onProfessionChange={handleProfessionChange}
      />
      <Button
        onClick={() => navigate("/wellcome-5")}
        disabled={!selectedProfession}
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeD;
