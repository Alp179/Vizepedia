import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import OtherQSelections from "./OtherQSelections";
import ControlScreen from "./ControlScreen";
import { useUserSelections } from "./useUserSelections";
import Modal from "../../ui/Modal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

function WellcomeE() {
  const { state, dispatch } = useUserSelections();
  const [selectedVehicle, setSelectedVehicle] = useState(state.vehicle);
  const [selectedKid, setSelectedKid] = useState(state.kid);
  const [selectedAccommodation, setSelectedAccommodation] = useState(state.accommodation);

  const navigate = useNavigate();
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (isAnonymous) {
      localStorage.setItem("selectedVehicle", vehicle);
    } else {
      dispatch({ type: "SET_VEHICLE", payload: vehicle });
    }
  };

  const handleKidChange = (kid) => {
    setSelectedKid(kid);
    if (isAnonymous) {
      localStorage.setItem("selectedKid", kid);
    } else {
      dispatch({ type: "SET_KID", payload: kid });
    }
  };

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodation(accommodation);
    if (isAnonymous) {
      localStorage.setItem("selectedAccommodation", accommodation);
    } else {
      dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });
    }
  };

  useEffect(() => {
    if (isAnonymous) {
      const savedVehicle = localStorage.getItem("selectedVehicle");
      const savedKid = localStorage.getItem("selectedKid");
      const savedAccommodation = localStorage.getItem("selectedAccommodation");

      if (savedVehicle) setSelectedVehicle(savedVehicle);
      if (savedKid) setSelectedKid(savedKid);
      if (savedAccommodation) setSelectedAccommodation(savedAccommodation);
    }
  }, [isAnonymous]);

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">
          Lütfen konaklama türünüzü, seyahat aracınızı ve çocuklu yolculuk durumunuzu seçiniz
        </Heading>
        <OtherQSelections
          selectedAccommodation={selectedAccommodation}
          selectedKid={selectedKid}
          selectedVehicle={selectedVehicle}
          onVehicleChange={handleVehicleChange}
          onKidChange={handleKidChange}
          onAccommodationChange={handleAccommodationChange}
        />

        <Modal>
          <Modal.Open opens="controlScreen">
            <Button
              variation="question"
              onClick={() => {
                navigate("", { state: { modalOpen: true } }); // Sadece modal açmak için state güncellemesi
              }}
              disabled={!selectedVehicle || !selectedKid || !selectedAccommodation}
            >
              Devam et
            </Button>
          </Modal.Open>
          <Modal.Window name="controlScreen">
            <ControlScreen />
          </Modal.Window>
        </Modal>
      </QuestionContainer>
    </>
  );
}

export default WellcomeE;
