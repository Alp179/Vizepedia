import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import OtherQSelections from "./OtherQSelections";
import ControlScreen from "./ControlScreen";
import { useUserSelections } from "./useUserSelections";
import Modal from "../../ui/Modal";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";

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
  const { state, dispatch } = useUserSelections();
  const [selectedVehicle, setSelectedVehicle] = useState(state.vehicle);
  const [selectedKid, setSelectedKid] = useState(state.kid);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    state.accommodation
  );

  // Load from localStorage if available
  useEffect(() => {
    const savedSelections = AnonymousDataService.getUserSelections();
    if (savedSelections) {
      if (savedSelections.vehicle && !selectedVehicle) {
        setSelectedVehicle(savedSelections.vehicle);
        dispatch({ type: "SET_VEHICLE", payload: savedSelections.vehicle });
      }
      if (savedSelections.kid !== undefined && selectedKid === undefined) {
        setSelectedKid(savedSelections.kid);
        dispatch({ type: "SET_KID", payload: savedSelections.kid });
      }
      if (savedSelections.accommodation && !selectedAccommodation) {
        setSelectedAccommodation(savedSelections.accommodation);
        dispatch({ type: "SET_ACCOMMODATION", payload: savedSelections.accommodation });
      }
    }
  }, [dispatch, selectedVehicle, selectedKid, selectedAccommodation]);

  useEffect(() => {
    setSelectedVehicle(state.vehicle);
    setSelectedKid(state.kid);
    setSelectedAccommodation(state.accommodation);
  }, [state.vehicle, state.kid, state.accommodation]);

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    dispatch({ type: "SET_VEHICLE", payload: vehicle });

    // Save to anonymous user service
    const existingSelections = AnonymousDataService.getUserSelections();
    AnonymousDataService.saveUserSelections({
      ...existingSelections,
      vehicle,
    });
  };

  const handleKidChange = (kid) => {
    setSelectedKid(kid);
    dispatch({ type: "SET_KID", payload: kid });

    // Save to anonymous user service
    const existingSelections = AnonymousDataService.getUserSelections();
    AnonymousDataService.saveUserSelections({
      ...existingSelections,
      kid,
    });
  };

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodation(accommodation);
    dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });

    // Save to anonymous user service
    const existingSelections = AnonymousDataService.getUserSelections();
    AnonymousDataService.saveUserSelections({
      ...existingSelections,
      accommodation,
    });
  };

  const handleContinue = () => {
    // Ensure application ID is generated when completing onboarding
    AnonymousDataService.getApplicationId();
    navigate("/test");
  };

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">
          Konaklama türü, seyahat aracı ve çocuklu yolculuk durumu
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
                onClick={handleContinue}
                disabled={
                  !selectedVehicle || selectedKid === undefined || !selectedAccommodation
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