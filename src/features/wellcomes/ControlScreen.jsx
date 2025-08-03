import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import { useUserSelections } from "./useUserSelections";
import Button from "../../ui/Button";
import ControlScreenDropdowns from "./ControlScreenDropdowns";
import supabase from "../../services/supabase";
import { useUser } from "../authentication/useUser";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import { AnonymousDataService } from "../../utils/anonymousDataService";
import PropTypes from "prop-types";

function ControlScreen({ onModalComplete }) {
  const { state, dispatch } = useUserSelections();
  const navigate = useNavigate();
  const { user, isUserLoading } = useUser();
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef(null);

  // Check if user is anonymous OR in modal flow without authentication
  const isAnonymous = AnonymousDataService.isAnonymousUser();
  const isInModalFlow = !!onModalComplete;
  const shouldTreatAsAnonymous = isAnonymous || (isInModalFlow && !user);

  useEffect(() => {
    const allSelectionsMade =
      state.country &&
      state.purpose &&
      state.profession &&
      state.vehicle &&
      state.kid !== undefined &&
      state.accommodation &&
      (state.hasSponsor === false || state.sponsorProfession); // Sponsor kontrolü
      
    if (!allSelectionsMade && !onModalComplete) {
      // Only redirect if not in modal
      navigate("/wellcome");
    }
  }, [state, navigate, onModalComplete]);

  // Overflow kontrol useEffect'i
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        setHasOverflow(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [state]); // state değiştiğinde de kontrol et

  const handleSubmit = async () => {
    // Handle anonymous users OR modal flow users without authentication
    if (shouldTreatAsAnonymous) {
      // NOW set the anonymous flag when user actually completes onboarding
      if (!isAnonymous && isInModalFlow) {
        console.log("Setting anonymous flag after completing modal onboarding");
        localStorage.setItem("isAnonymous", "true");
      }
      
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
      
      if (onModalComplete) {
        // In modal flow - close modal and stay on dashboard
        onModalComplete();
      } else {
        // Navigate to dashboard with anonymous application ID
        navigate(`/dashboard/${userAnswers.id}`);
      }
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
        
        if (onModalComplete) {
          onModalComplete();
        } else {
          navigate(`/dashboard/${userAnswers.id}`);
        }
      } else {
        console.log("Kullanıcı seçimleri başarıyla kaydedildi:", data);
        localStorage.removeItem(`visa_check_modal_shown_${data.id}`);
        
        if (onModalComplete) {
          onModalComplete();
        } else {
          navigate(`/dashboard/${data.id}`);
        }
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
      
      if (onModalComplete) {
        onModalComplete();
      } else {
        navigate(`/dashboard/${userAnswers.id}`);
      }
    }
  };

  if (isUserLoading) {
    return <Spinner />;
  }

  const ModalScreenContainer = styled.div`
    position: relative;
    max-height: calc(100vh - 40rem);
    overflow: auto;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-radius: 12px;
    gap: 16px;
    
    /* Default styling for standalone page */
    ${!onModalComplete && `
      margin-top: 1px;
      padding: 8px;
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
    `}

    /* Modal styling - cleaner and more compact */
    ${onModalComplete && `
      width: 100%;
      max-width: 100%;
      height: auto;
      max-height: 500px;
      overflow-y: auto;
      background: ${hasOverflow ? "rgba(255, 255, 255, 0.37)" : "transparent"};
      box-shadow: none;
      border: none;
      backdrop-filter: none;
    `}

    &::-webkit-scrollbar {
      width: 16px;
      @media (max-width: 710px) {
        width: 12px;
      }
    }

    &::-webkit-scrollbar-track {
      background: var(--color-grey-2);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-grey-54);
      border-radius: 10px;
      border: 3px solid var(--color-grey-2);
    }
  `;

  return (
    <ModalScreenContainer ref={containerRef} hasOverflow={hasOverflow}>
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
        {shouldTreatAsAnonymous ? "Anonim Olarak Başlayalım" : "Başlayalım"}
      </Button>
    </ModalScreenContainer>
  );
}

export default ControlScreen;

ControlScreen.propTypes = {
  onModalComplete: PropTypes.func.isRequired, // or just PropTypes.func if it's optional
};