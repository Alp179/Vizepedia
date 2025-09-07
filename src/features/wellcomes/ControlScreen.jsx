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
  const { user, isUserLoading, userType } = useUser();
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef(null);

  // UPDATED: Check if user is anonymous OR in modal flow OR authenticated
  const isAnonymous = AnonymousDataService.isAnonymousUser();
  const isInModalFlow = !!onModalComplete;
  const isAuthenticated = userType === "authenticated" && user?.id;
  
  // Determine the flow type
  const shouldTreatAsAnonymous = isAnonymous || (isInModalFlow && !user?.id);

  useEffect(() => {
    const allSelectionsMade =
      state.country &&
      state.purpose &&
      state.profession &&
      state.vehicle &&
      state.kid !== undefined &&
      state.accommodation &&
      (state.hasSponsor === false || state.sponsorProfession);
      
    if (!allSelectionsMade && !onModalComplete) {
      // Only redirect if not in modal
      navigate("/wellcome");
    }
  }, [state, navigate, onModalComplete]);

  // Overflow control useEffect
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
  }, [state]);

  const handleSubmit = async () => {
    console.log("🚀 ControlScreen handleSubmit called");
    console.log("User:", user);
    console.log("UserType:", userType);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("shouldTreatAsAnonymous:", shouldTreatAsAnonymous);
    console.log("isInModalFlow:", isInModalFlow);

    // UPDATED: Handle authenticated users in modal flow
    if (isAuthenticated && isInModalFlow) {
      console.log("📝 Creating new Supabase application for authenticated user");
      
      try {
        // Create new application in Supabase for authenticated user
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
          console.error("❌ Error creating new application:", error);
          throw error;
        }

        console.log("✅ New application created successfully:", data);
        
        // Clear visa check modal for new application
        sessionStorage.removeItem(`visa_check_modal_shown_${data.id}`);
        
        if (onModalComplete) {
          // Pass the new application ID to the modal completion handler
          onModalComplete(data.id);
        } else {
          // Direct navigation for non-modal flow
          navigate(`/dashboard/${data.id}`);
        }
        return;
      } catch (error) {
        console.error("❌ Unexpected error creating application:", error);
        // Fallback - close modal and stay on current dashboard
        if (onModalComplete) {
          onModalComplete();
        }
        return;
      }
    }

    // UPDATED: Handle anonymous users (existing logic)
    if (shouldTreatAsAnonymous) {
      console.log("📝 Creating sessionStorage application for anonymous user");
      
      // Set the anonymous flag when user completes onboarding in modal
      if (!isAnonymous && isInModalFlow) {
        console.log("Setting anonymous flag after completing modal onboarding");
        sessionStorage.setItem("isAnonymous", "true");
      }
      
      // Save to sessionStorage instead of Supabase
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

      console.log("Anonymous user selections saved to sessionStorage:", userAnswers);
      
      // Clear visa check modal for anonymous users
      sessionStorage.removeItem(`visa_check_modal_shown_${userAnswers.id}`);
      
      if (onModalComplete) {
        // In modal flow - close modal and stay on dashboard
        onModalComplete();
      } else {
        // Navigate to dashboard with anonymous application ID
        navigate(`/dashboard/${userAnswers.id}`);
      }
      return;
    }

    // UPDATED: Handle authenticated users NOT in modal (existing authenticated flow)
    if (isAuthenticated && !isInModalFlow) {
      console.log("📝 Creating Supabase application for authenticated user (non-modal)");
      
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
          sessionStorage.setItem("latestApplicationId", data.id);
          sessionStorage.removeItem(`visa_check_modal_shown_${data.id}`);
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
      return;
    }

    // FALLBACK: If none of the above conditions match, fallback to anonymous
    console.log("⚠️ Fallback to anonymous mode");
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
          if (shouldTreatAsAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, country });
          }
        }}
        selectedPurpose={state.purpose}
        onPurposeChange={(purpose) => {
          dispatch({ type: "SET_PURPOSE", payload: purpose });
          if (shouldTreatAsAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, purpose });
          }
        }}
        selectedProfession={state.profession}
        onProfessionChange={(profession) => {
          dispatch({ type: "SET_PROFESSION", payload: profession });
          if (shouldTreatAsAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, profession });
          }
        }}
        selectedAccommodation={state.accommodation}
        selectedKid={state.kid}
        selectedVehicle={state.vehicle}
        onVehicleChange={(vehicle) => {
          dispatch({ type: "SET_VEHICLE", payload: vehicle });
          if (shouldTreatAsAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, vehicle });
          }
        }}
        onKidChange={(kid) => {
          dispatch({ type: "SET_KID", payload: kid });
          if (shouldTreatAsAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, kid });
          }
        }}
        onAccommodationChange={(accommodation) => {
          dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });
          if (shouldTreatAsAnonymous) {
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
          if (shouldTreatAsAnonymous) {
            const existing = AnonymousDataService.getUserSelections();
            AnonymousDataService.saveUserSelections({ ...existing, sponsorProfession });
          }
        }}
      />

      <Button variation="question" size="baslayalim" onClick={handleSubmit}>
        {isAuthenticated && isInModalFlow 
          ? "Yeni Başvuru Oluştur" 
          : shouldTreatAsAnonymous 
            ? "Anonim Olarak Başlayalım" 
            : "Başlayalım"}
      </Button>
    </ModalScreenContainer>
  );
}

export default ControlScreen;

ControlScreen.propTypes = {
  onModalComplete: PropTypes.func,
};