import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import OtherQSelections from "./OtherQSelections";
import ControlScreen from "./ControlScreen";
import { useUserSelections } from "./useUserSelections";
import Modal from "../../ui/Modal";
import styled from "styled-components";

// Anonim kullanıcı seçimlerini kaydetmek için fonksiyon
function saveAnonymousUserSelections(selections) {
  const userSelections = {
    country: selections.country || "", // Önceki adımlarda seçilen ülke
    purpose: selections.purpose || "", // Önceki adımlarda seçilen gidiş amacı
    profession: selections.profession || "", // Önceki adımlarda seçilen meslek
    vehicle: selections.vehicle, // Bu adımda seçilen seyahat aracı
    kid: selections.kid, // Bu adımda seçilen çocuk durumu
    accommodation: selections.accommodation, // Bu adımda seçilen konaklama türü
  };

  // Seçimleri localStorage'a kaydet
  localStorage.setItem("userSelections", JSON.stringify(userSelections));
}

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

function WellcomeE() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedVehicle, setSelectedVehicle] = useState(state.vehicle);
  const [selectedKid, setSelectedKid] = useState(state.kid);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    state.accommodation
  );

  useEffect(() => {
    setSelectedVehicle(state.vehicle);
    setSelectedKid(state.kid);
    setSelectedAccommodation(state.accommodation);
  }, [state.vehicle, state.kid, state.accommodation]);

  // Dispatch fonksiyonunu kullanarak global state güncellemeleri
  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    dispatch({ type: "SET_VEHICLE", payload: vehicle });

    // Anonim kullanıcı seçimlerini kaydet
    saveAnonymousUserSelections({
      ...state,
      vehicle,
    });
  };

  const handleKidChange = (kid) => {
    setSelectedKid(kid);
    dispatch({ type: "SET_KID", payload: kid });

    // Anonim kullanıcı seçimlerini kaydet
    saveAnonymousUserSelections({
      ...state,
      kid,
    });
  };

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodation(accommodation);
    dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });

    // Anonim kullanıcı seçimlerini kaydet
    saveAnonymousUserSelections({
      ...state,
      accommodation,
    });
  };

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">
          Konaklama türü, seyahat aracı ve çocuklu yolculuk
          durumu
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
            <StyledNavLink to="">
              <Button
                variation="question"
                onClick={() => navigate("/test")}
                disabled={
                  !selectedVehicle || !selectedKid || !selectedAccommodation
                }
              >
                Devam et
              </Button>
            </StyledNavLink>
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
