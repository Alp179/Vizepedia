import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "./useUserSelections";
import ProfessionSelection from "./ProfessionSelection";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import { toast } from "react-hot-toast";

// Anonim kullanıcı seçimlerini kaydetmek için fonksiyon
function saveAnonymousUserSelections(selections) {
  const userSelections = {
    country: selections.country || "", // Daha önceki adımda seçilen ülke
    purpose: selections.purpose || "", // Daha önceki adımda seçilen gidiş amacı
    profession: selections.profession, // Bu adımda seçilen meslek
    vehicle: selections.vehicle || "",
    kid: selections.kid || "",
    accommodation: selections.accommodation || "",
    hasSponsor: selections.hasSponsor || false,
  };

  // Seçimleri localStorage'a kaydet
  localStorage.setItem("userSelections", JSON.stringify(userSelections));
}

function WellcomeD() {
  const navigate = useNavigate();
  const { state, dispatch } = useUserSelections(); // dispatch fonksiyonunu kullanmak için hook'u çağırın
  const [selectedProfession, setSelectedProfession] = useState(
    state.profession
  );

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    dispatch({ type: "SET_PROFESSION", payload: profession }); // Global state'i güncelleyin

    // Anonim kullanıcı seçimlerini kaydet
    saveAnonymousUserSelections({
      ...state,
      profession,
    });

    // Eğer seçilen meslek "İş veren" değilse sponsor durumu sor
    if (profession !== "İş veren") {
      toast((t) => (
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
                dispatch({ type: "SET_HAS_SPONSOR", payload: true });
                saveAnonymousUserSelections({
                  ...state,
                  hasSponsor: true,
                });
                navigate("/wellcome-4a"); // Sponsor mesleği sayfasına yönlendir
              }}
            >
              Evet
            </Button>
            <Button
              variation="secondary"
              size="small"
              onClick={() => {
                toast.dismiss(t.id);
                dispatch({ type: "SET_HAS_SPONSOR", payload: false });
                saveAnonymousUserSelections({
                  ...state,
                  hasSponsor: false,
                });
                navigate("/wellcome-5"); // Sürece devam
              }}
            >
              Hayır
            </Button>
          </div>
        </div>
      ));
    }
  };

  const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `;

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
        >
          Devam et
        </Button>
      </QuestionContainer>
    </>
  );
}

export default WellcomeD;
