/* eslint-disable react/prop-types */
// WellcomeE.jsx - Modal only version with auth user support
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import OtherQSelections from "./OtherQSelections";
import { useUserSelections } from "./useUserSelections";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";
import { useUser } from "../authentication/useUser";

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

function WellcomeE({ onModalNext }) {
  const { state, dispatch } = useUserSelections();
  const { user, userType } = useUser();
  const [selectedVehicle, setSelectedVehicle] = useState(state.vehicle);
  const [selectedKid, setSelectedKid] = useState(state.kid);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    state.accommodation
  );

  // Determine if we should save to sessionStorage (only for anonymous users)
  const shouldSaveToSessionStorage = !user || userType !== "authenticated";

  // Load from sessionStorage only if anonymous
  useEffect(() => {
    if (shouldSaveToSessionStorage) {
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
          dispatch({
            type: "SET_ACCOMMODATION",
            payload: savedSelections.accommodation,
          });
        }
      }
    }
  }, [dispatch, selectedVehicle, selectedKid, selectedAccommodation, shouldSaveToSessionStorage]);

  useEffect(() => {
    setSelectedVehicle(state.vehicle);
    setSelectedKid(state.kid);
    setSelectedAccommodation(state.accommodation);
  }, [state.vehicle, state.kid, state.accommodation]);

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    dispatch({ type: "SET_VEHICLE", payload: vehicle });

    // Only save to sessionStorage for anonymous users
    if (shouldSaveToSessionStorage) {
      const existingSelections = AnonymousDataService.getUserSelections();
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        vehicle,
      });
    }
  };

  const handleKidChange = (kid) => {
    setSelectedKid(kid);
    dispatch({ type: "SET_KID", payload: kid });

    // Only save to sessionStorage for anonymous users
    if (shouldSaveToSessionStorage) {
      const existingSelections = AnonymousDataService.getUserSelections();
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        kid,
      });
    }
  };

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodation(accommodation);
    dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });

    // Only save to sessionStorage for anonymous users
    if (shouldSaveToSessionStorage) {
      const existingSelections = AnonymousDataService.getUserSelections();
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        accommodation,
      });
    }
  };

  const handleContinue = () => {
    console.log("WellcomeE handleContinue called");
    console.log("shouldSaveToSessionStorage:", shouldSaveToSessionStorage);
    
    // Ensure application ID is generated only for anonymous users
    if (shouldSaveToSessionStorage) {
      AnonymousDataService.getApplicationId();
    }

    if (onModalNext) {
      console.log("Calling onModalNext from WellcomeE");
      onModalNext();
    } else {
      console.log("No onModalNext provided, WellcomeE cannot proceed in modal");
    }
  };

  return (
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

      <Button
        variation="question"
        onClick={handleContinue}
        disabled={
          !selectedVehicle ||
          selectedKid === undefined ||
          !selectedAccommodation
        }
      >
        Devam et
      </Button>
    </QuestionContainer>
  );
}

export default WellcomeE;