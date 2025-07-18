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
import { AnonymousDataService } from "../../utils/anonymousDataService";

function ControlScreen() {
  const { state, dispatch } = useUserSelections();
  const navigate = useNavigate();
  const { user, isUserLoading } = useUser();

  // Check if user is anonymous
  const isAnonymous = AnonymousDataService.isAnonymousUser();

  useEffect(() => {
    const allSelectionsMade =
      state.country &&
      state.purpose &&
      state.profession &&
      state.vehicle &&
      state.kid !== undefined &&
      state.accommodation &&
      (state.hasSponsor === false || state.sponsorProfession); // Sponsor kontrolü
      
    if (!allSelectionsMade) {
      navigate("/wellcome");
    }
  }, [state, navigate]);

  const handleSubmit = async () => {
    // Handle anonymous users
    if (isAnonymous || !user) {
      // Save to localStorage instead of Supabase
      const userAnswers = AnonymousDataService.saveUserAnswers({
        country: state.country,
        purpose: state.purpose,
        profession: state.profession,
        vehicle: state.vehicle,
        kid: state.kid,
        accommodation: state.accommodation,
        hasSponsor: state.hasSponsor,
        sponsorProfession: state.sponsorProfession
      });

      console.log("Anonymous user selections saved to localStorage:", userAnswers);
      
      // Clear visa check modal for anonymous users
      localStorage.removeItem(`visa_check_modal_shown_${userAnswers.id}`);
      
      // Navigate to dashboard with anonymous application ID
      navigate(`/dashboard/${userAnswers.id}`);
      return;
    }

    // Handle authenticated users (existing Supabase logic)
    try {
      const { data, error } = await supabase
        .from("userAnswers")
        .insert({
          userId: user.id,
          ans_country: state.country,
          ans_purpose: state.purpose,
          ans_profession: state.profession,
          ans_vehicle: state.vehicle,
          ans_kid: state.kid,
          ans_accommodation: state.accommodation,
          ans_hassponsor: state.hasSponsor,
          ans_sponsor_profession: state.sponsorProfession || null,
          has_appointment: false,
          has_filled_form: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Seçimler kaydedilirken hata oluştu:", error);
        // Fallback to anonymous mode if Supabase fails
        const userAnswers = AnonymousDataService.saveUserAnswers({
          country: state.country,
          purpose: state.purpose,
          profession: state.profession,
          vehicle: state.vehicle,
          kid: state.kid,
          accommodation: state.accommodation,
          hasSponsor: state.hasSponsor,
          sponsorProfession: state.sponsorProfession
        });
        navigate(`/dashboard/${userAnswers.id}`);
      } else {
        console.log("Kullanıcı seçimleri başarıyla kaydedildi:", data);
        localStorage.removeItem(`visa_check_modal_shown_${data.id}`);
        navigate(`/dashboard/${data.id}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      // Fallback to anonymous mode
      const userAnswers = AnonymousDataService.saveUserAnswers({
        country: state.country,
        purpose: state.purpose,
        profession: state.profession,
        vehicle: state.vehicle,
        kid: state.kid,
        accommodation: state.accommodation,
        hasSponsor: state.hasSponsor,
        sponsorProfession: state.sponsorProfession
      });
      navigate(`/dashboard/${userAnswers.id}`);
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
    padding: 8px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(6.3px);
    -webkit-backdrop-filter: blur(6.3px);
    border: 1px solid rgba(255, 255, 255, 0.52);
    width: calc(100vw - 180px);
    max-width: 370px;
    height: calc(100vh - 190px);

    @media (max-width: 710px) {
      width: calc(100vw - 80px);
    }

    @media (max-width: 300px) {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100vw - 50px);
      margin: 0 auto;
    }
  `;

  return (
    <ModalScreenContainer>
      <Heading as="h8">Bilgi Kontrol Ekranı</Heading>
      <ControlScreenDropdowns
        selectedCountry={state.country}
        onCountryChange={(country) => {
          dispatch({ type: "SET_COUNTRY", payload: country });
          // Update anonymous data if applicable
          if (isAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, country });
          }
        }}
        selectedPurpose={state.purpose}
        onPurposeChange={(purpose) => {
          dispatch({ type: "SET_PURPOSE", payload: purpose });
          if (isAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, purpose });
          }
        }}
        selectedProfession={state.profession}
        onProfessionChange={(profession) => {
          dispatch({ type: "SET_PROFESSION", payload: profession });
          if (isAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, profession });
          }
        }}
        selectedAccommodation={state.accommodation}
        selectedKid={state.kid}
        selectedVehicle={state.vehicle}
        onVehicleChange={(vehicle) => {
          dispatch({ type: "SET_VEHICLE", payload: vehicle });
          if (isAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, vehicle });
          }
        }}
        onKidChange={(kid) => {
          dispatch({ type: "SET_KID", payload: kid });
          if (isAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, kid });
          }
        }}
        onAccommodationChange={(accommodation) => {
          dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });
          if (isAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, accommodation });
          }
        }}
        hasSponsor={state.hasSponsor}
        sponsorProfession={state.sponsorProfession}
        onSponsorProfessionChange={(sponsorProfession) => {
          dispatch({
            type: "SET_SPONSOR_PROFESSION",
            payload: sponsorProfession,
          });
          if (isAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, sponsorProfession });
          }
        }}
      />

      <Button variation="question" size="baslayalim" onClick={handleSubmit}>
        {isAnonymous ? "Anonim Olarak Başlayalım" : "Başlayalım"}
      </Button>
    </ModalScreenContainer>
  );
}

export default ControlScreen;