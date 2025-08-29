/* eslint-disable react/prop-types */
// WellcomeD.jsx - Modal only version with auth user support
import { useState, useEffect } from "react";
import { useUserSelections } from "./useUserSelections";
import ProfessionSelection from "./ProfessionSelection";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";
import { useUser } from "../authentication/useUser";

// Styled components
const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  text-align: center;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 12px;
`;

function WellcomeD({ onModalNext }) {
  const { state, dispatch } = useUserSelections();
  const { user, userType } = useUser();
  const [selectedProfession, setSelectedProfession] = useState(
    state.profession || ""
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Determine if we should save to sessionStorage (only for anonymous users)
  const shouldSaveToSessionStorage = !user || userType !== "authenticated";

  // Load from sessionStorage only if anonymous
  useEffect(() => {
    if (shouldSaveToSessionStorage) {
      const savedSelections = AnonymousDataService.getUserSelections();
      if (savedSelections && savedSelections.profession && !selectedProfession) {
        setSelectedProfession(savedSelections.profession);
        dispatch({ type: "SET_PROFESSION", payload: savedSelections.profession });
      }
    }
  }, [dispatch, selectedProfession, shouldSaveToSessionStorage]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      setIsModalVisible(false);
    };
  }, []);

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    dispatch({ type: "SET_PROFESSION", payload: profession });

    // Only save to sessionStorage for anonymous users
    if (shouldSaveToSessionStorage) {
      const existingSelections = AnonymousDataService.getUserSelections();
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        profession,
      });
    }

    // Show sponsor modal if not business owner
    if (profession && profession !== "İş veren") {
      setIsModalVisible(true);
    } else if (profession === "İş veren") {
      // Business owner - set hasSponsor to null and save only for anonymous users
      dispatch({ type: "SET_HAS_SPONSOR", payload: null });
      
      if (shouldSaveToSessionStorage) {
        const existingSelections = AnonymousDataService.getUserSelections();
        AnonymousDataService.saveUserSelections({
          ...existingSelections,
          profession,
          hasSponsor: null,
        });
      }
    }
  };

  const handleContinue = () => {
    console.log("WellcomeD handleContinue called");
    console.log("selectedProfession:", selectedProfession);
    console.log("onModalNext type:", typeof onModalNext);
    
    if (selectedProfession && onModalNext) {
      console.log("Calling onModalNext from WellcomeD with profession:", selectedProfession);
      onModalNext();
    } else {
      console.log("Cannot proceed - selectedProfession:", selectedProfession, "onModalNext:", !!onModalNext);
    }
  };

  const handleModalResponse = (hasSponsor) => {
    console.log("WellcomeD handleModalResponse called with:", hasSponsor);
    dispatch({ type: "SET_HAS_SPONSOR", payload: hasSponsor });
    setIsModalVisible(false);

    // Only save sponsor decision for anonymous users
    if (shouldSaveToSessionStorage) {
      const existingSelections = AnonymousDataService.getUserSelections();
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        hasSponsor,
      });
    }

    // Call modal callback
    if (onModalNext) {
      console.log("Calling onModalNext from handleModalResponse with sponsor:", hasSponsor);
      onModalNext(hasSponsor);
    }
  };

  const handleOverlayClick = (e) => {
    // Prevent modal close on inner click
    if (e.target === e.currentTarget) {
      setIsModalVisible(false);

      // Reset profession selection
      setSelectedProfession("");
      dispatch({ type: "SET_PROFESSION", payload: "" });

      // Clear from sessionStorage for anonymous users only
      if (shouldSaveToSessionStorage) {
        const existingSelections = AnonymousDataService.getUserSelections();
        AnonymousDataService.saveUserSelections({
          ...existingSelections,
          profession: "",
        });
      }
    }
  };

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Mesleğiniz</Heading>
        <ProfessionSelection
          selectedProfession={selectedProfession}
          onProfessionChange={handleProfessionChange}
        />
        <Button
          variation="question"
          onClick={handleContinue}
          disabled={!selectedProfession}
          style={{ zIndex: "1" }}
        >
          Devam et
        </Button>
      </QuestionContainer>

      {isModalVisible && (
        <Overlay onClick={handleOverlayClick}>
          <Modal>
            <ModalTitle>
              Seyahat masraflarınızı karşılayan bir sponsorunuz var mı?
            </ModalTitle>
            <ButtonContainer>
              <Button
                variation="primary"
                size="small"
                onClick={() => handleModalResponse(true)}
                style={{ flex: 1 }}
              >
                Evet
              </Button>
              <Button
                variation="secondary"
                size="small"
                onClick={() => handleModalResponse(false)}
                style={{ flex: 1 }}
              >
                Hayır
              </Button>
            </ButtonContainer>
          </Modal>
        </Overlay>
      )}
    </>
  );
}

export default WellcomeD;