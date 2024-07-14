import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { useUserSelections } from "./useUserSelections";
import Button from "../../ui/Button";
import ControlScreenDropdowns from "./ControlScreenDropdowns";
import supabase from "../../services/supabase";
import { useUser } from "../authentication/useUser";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";

function ControlScreen() {
  const { state, dispatch } = useUserSelections();
  const navigate = useNavigate();
  const { user, isUserLoading } = useUser(); // useUser hook'unu kullanarak mevcut kullanıcıyı al

  useEffect(() => {
    const allSelectionsMade =
      state.country &&
      state.purpose &&
      state.profession &&
      state.vehicle &&
      state.kid &&
      state.accommodation;
    if (!allSelectionsMade) {
      navigate("/wellcome");
    }
  }, [state, navigate]);

  const handleSubmit = async () => {
    if (!user) {
      console.error("Kullanıcı girişi yapılmamış!");
      return;
    }

    const { error } = await supabase.from("userAnswers").upsert({
      userId: user.id, // useUser hook'undan alınan mevcut kullanıcı ID'si
      ans_country: state.country,
      ans_purpose: state.purpose,
      ans_profession: state.profession,
      ans_vehicle: state.vehicle,
      ans_kid: state.kid,
      ans_accommodation: state.accommodation,
    });

    if (error) {
      console.error("Seçimler kaydedilirken hata oluştu:", error);
    } else {
      console.log("Kullanıcı seçimleri başarıyla kaydedildi.");
      navigate("/dashboard"); // Seçimler başarıyla kaydedildikten sonra kullanıcıyı yönlendir
    }
  };

  if (isUserLoading) {
    return <Spinner />;
  }

  const ModalScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: 1px;
    padding: 10px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(6.3px);
    -webkit-backdrop-filter: blur(6.3px);

    border: 1px solid rgba(255, 255, 255, 0.52);
    width: 100%;
    max-width: 520px; /* Genişlik %20 arttırıldı */
    max-height: 800px; /* Yükseklik %20 arttırıldı */
  `;

  return (
    <ModalScreenContainer>
      <Heading as="h8">Bilgi Kontrol Ekranı</Heading>
      <ControlScreenDropdowns
        selectedCountry={state.country}
        onCountryChange={(country) =>
          dispatch({ type: "SET_COUNTRY", payload: country })
        }
        selectedPurpose={state.purpose}
        onPurposeChange={(purpose) =>
          dispatch({ type: "SET_PURPOSE", payload: purpose })
        }
        selectedProfession={state.profession}
        onProfessionChange={(profession) =>
          dispatch({ type: "SET_PROFESSION", payload: profession })
        }
        selectedAccommodation={state.accommodation}
        selectedKid={state.kid}
        selectedVehicle={state.vehicle}
        onVehicleChange={(vehicle) =>
          dispatch({ type: "SET_VEHICLE", payload: vehicle })
        }
        onKidChange={(kid) => dispatch({ type: "SET_KID", payload: kid })}
        onAccommodationChange={(accommodation) =>
          dispatch({ type: "SET_ACCOMMODATION", payload: accommodation })
        }
      />

      <Button onClick={handleSubmit}>Başlayalım</Button>
    </ModalScreenContainer>
  );
}

export default ControlScreen;
