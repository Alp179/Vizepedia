import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import PurposeSelection from "./PurposeSelection";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";

function WellcomeC() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedPurpose, setSelectedPurpose] = useState(state.purpose);

  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
    dispatch({ type: "SET_PURPOSE", payload: purpose }); // Global state'i güncelleyin
  };

  return (
    <>
      <Heading as="h5">Gidiş amacınızı seçiniz</Heading>
      <PurposeSelection
        selectedPurpose={selectedPurpose}
        onPurposeChange={handlePurposeChange}
      />
      <Button
        onClick={() => navigate("/wellcome-4")}
        disabled={!selectedPurpose}
      >
        Devam et
      </Button>
    </>
  );
}

export default WellcomeC;
