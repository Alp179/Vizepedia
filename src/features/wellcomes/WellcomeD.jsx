import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import ProfessionSelection from "./ProfessionSelection";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import { AnonymousDataService } from "../../utils/anonymousDataService";

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

function WelcomeD() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections();
  const [selectedProfession, setSelectedProfession] = useState(
    state.profession || ""
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Load from localStorage if available
  useEffect(() => {
    const savedSelections = AnonymousDataService.getUserSelections();
    if (savedSelections && savedSelections.profession && !selectedProfession) {
      setSelectedProfession(savedSelections.profession);
      dispatch({ type: "SET_PROFESSION", payload: savedSelections.profession });
    }
  }, [dispatch, selectedProfession]);

  // Component unmount olduğunda modal'ı temizle
  useEffect(() => {
    return () => {
      setIsModalVisible(false);
    };
  }, []);

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    dispatch({ type: "SET_PROFESSION", payload: profession });

    // Save to anonymous user service
    const existingSelections = AnonymousDataService.getUserSelections();
    AnonymousDataService.saveUserSelections({
      ...existingSelections,
      profession,
    });

    // Eğer "İş veren" değilse sponsor sorusunu sor
    if (profession && profession !== "İş veren") {
      setIsModalVisible(true);
    } else if (profession === "İş veren") {
      // İş veren ise direkt devam et butonu aktif olsun, modal açılmasın
      dispatch({ type: "SET_HAS_SPONSOR", payload: null });
      // Save hasSponsor as null for business owners
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        profession,
        hasSponsor: null,
      });
    }
  };

  const handleContinue = () => {
    // Meslek seçilmişse bir sonraki sayfaya yönlendir
    if (selectedProfession) {
      navigate("/wellcome-5");
    }
  };

  const handleModalResponse = (hasSponsor) => {
    dispatch({ type: "SET_HAS_SPONSOR", payload: hasSponsor });
    setIsModalVisible(false);

    // Save sponsor decision
    const existingSelections = AnonymousDataService.getUserSelections();
    AnonymousDataService.saveUserSelections({
      ...existingSelections,
      hasSponsor,
    });

    // Sponsor durumuna göre farklı sayfalara yönlendir
    if (hasSponsor) {
      navigate("/wellcome-4a");
    } else {
      navigate("/wellcome-5");
    }
  };

  const handleOverlayClick = (e) => {
    // Modal içine tıklamalarda overlay'in kapanmasını engelle
    if (e.target === e.currentTarget) {
      setIsModalVisible(false);

      // Modal kapatıldığında meslek seçimini sıfırla
      setSelectedProfession("");
      dispatch({ type: "SET_PROFESSION", payload: "" });
      
      // Clear from localStorage as well
      const existingSelections = AnonymousDataService.getUserSelections();
      AnonymousDataService.saveUserSelections({
        ...existingSelections,
        profession: "",
      });
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

export default WelcomeD;