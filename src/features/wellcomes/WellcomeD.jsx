import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import ProfessionSelection from "./ProfessionSelection";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import { toast } from "react-hot-toast";

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
`;

function WellcomeD() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections();
  const [selectedProfession, setSelectedProfession] = useState(
    state.profession
  );
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    dispatch({ type: "SET_PROFESSION", payload: profession });

    // Önceki toast'ı temizle ve yeni toast göster
    toast.dismiss("sponsor-toast");
    setIsToastVisible(false);

    if (profession !== "İş veren") {
      setIsToastVisible(true);
      toast(
        (t) => (
          <div>
            <p>Seyahat masraflarınızı karşılayan bir sponsorunuz var mı?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              <Button
                variation="primary"
                size="small"
                onClick={() => {
                  toast.dismiss(t.id);
                  setIsToastVisible(false);
                  dispatch({ type: "SET_HAS_SPONSOR", payload: true });
                  navigate("/wellcome-4a");
                }}
              >
                Evet
              </Button>
              <Button
                variation="secondary"
                size="small"
                onClick={() => {
                  toast.dismiss(t.id);
                  setIsToastVisible(false);
                  dispatch({ type: "SET_HAS_SPONSOR", payload: false });
                  navigate("/wellcome-5");
                }}
              >
                Hayır
              </Button>
            </div>
          </div>
        ),
        {
          id: "sponsor-toast",
          duration: Infinity,
          onClose: () => {
            // Toast kapatıldığında meslek seçimini sıfırla
            setSelectedProfession("");
            dispatch({ type: "SET_PROFESSION", payload: "" });
          },
        }
      );
    }
  };

  const handleOverlayClick = () => {
    toast.dismiss("sponsor-toast");
    setIsToastVisible(false);

    // Overlay tıklandığında meslek seçimini sıfırla
    setSelectedProfession("");
    dispatch({ type: "SET_PROFESSION", payload: "" });
  };

  return (
    <>
      <QuestionContainer>
        <Heading as="h5">Mesleğinizi seçiniz</Heading>
        <ProfessionSelection
          selectedProfession={selectedProfession}
          onProfessionChange={handleProfessionChange}
        />
        <Button
          variation="question"
          onClick={() => navigate("/wellcome-5")}
          disabled={!selectedProfession}
          style={{ zIndex: "1" }}
        >
          Devam et
        </Button>
      </QuestionContainer>
      {isToastVisible && <Overlay onClick={handleOverlayClick} />}
    </>
  );
}

export default WellcomeD;
