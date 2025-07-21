/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styled from "styled-components";
import SignupForm from "../features/authentication/SignupForm";
import WellcomeB from "../features/wellcomes/WellcomeB";
import WellcomeC from "../features/wellcomes/WellcomeC";
import WellcomeDa from "../features/wellcomes/WellcomeDa";
import WellcomeE from "../features/wellcomes/WellcomeE";
import ControlScreen from "../features/wellcomes/ControlScreen";
import { AnonymousDataService } from "../utils/anonymousDataService";
import { useUser } from "../features/authentication/useUser";
import WellcomeD from "../features/wellcomes/WellcomeD";

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: fadeInScale 0.3s ease;

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #004466, #00ffa2);
  border-radius: 2px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const StepCounter = styled.div`
  text-align: center;
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalContentWrapper = styled.div`
  position: relative;
`;

// Step definitions
const STEPS = {
  SIGNUP: 'signup',
  COUNTRY: 'country',
  PURPOSE: 'purpose', 
  PROFESSION: 'profession',
  SPONSOR_PROFESSION: 'sponsor_profession',
  OTHER_DETAILS: 'other_details',
  CONTROL: 'control'
};

function MultiStepOnboardingModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(STEPS.SIGNUP);
  const { refetchUser } = useUser();

  // Handle modal close - clean up incomplete selections
  const handleClose = () => {
    // If user didn't complete the onboarding, clear any partial selections
    if (currentStep !== STEPS.CONTROL) {
      console.log("Modal closed before completion - clearing partial selections");
      
      // Use AnonymousDataService to clear all data
      AnonymousDataService.clearData();
      
      // Also clear specific keys that might have been set
      const additionalKeysToRemove = [
        'isAnonymous',
        'wellcomesAnswered'
      ];
      
      additionalKeysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log("Partial selections cleared successfully");
    }
    
    onClose();
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleClose]);

  // Step progression logic
  const getStepNumber = (step) => {
    const stepOrder = [
      STEPS.SIGNUP,
      STEPS.COUNTRY,
      STEPS.PURPOSE,
      STEPS.PROFESSION,
      STEPS.SPONSOR_PROFESSION,
      STEPS.OTHER_DETAILS,
      STEPS.CONTROL
    ];
    return stepOrder.indexOf(step) + 1;
  };

  const getTotalSteps = () => {
    const selections = AnonymousDataService.getUserSelections();
    
    // Base steps: signup, country, purpose, profession, other_details, control
    let totalSteps = 6;
    
    // Add sponsor profession step if user has sponsor and is not business owner
    if (selections?.hasSponsor && selections?.profession !== "İş veren") {
      totalSteps = 7;
    }
    
    return totalSteps;
  };

  const getProgress = () => {
    const currentStepNum = getStepNumber(currentStep);
    const totalSteps = getTotalSteps();
    return (currentStepNum / totalSteps) * 100;
  };

  // Handle authentication completion
  const handleAuthComplete = async () => {
    console.log("Authentication completed, moving to next step...");
    
    // Force immediate step transition
    console.log("Current step before:", currentStep);
    setCurrentStep(STEPS.COUNTRY);
    console.log("Setting step to:", STEPS.COUNTRY);
    
    // Refetch user in background (don't wait for it)
    refetchUser().catch(err => console.log("User refetch error:", err));
  };

  // Handle step navigation
  const handleStepComplete = (nextStep) => {
    console.log("Step completed, moving to:", nextStep);
    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      // Onboarding completed successfully - don't clear data
      console.log("Onboarding completed successfully, closing modal");
      onClose();
    }
  };

  // Enhanced components with step navigation
  const EnhancedSignupForm = () => (
    <SignupForm 
      onCloseModal={handleAuthComplete}
      onAuthComplete={handleAuthComplete}
      isInModal={true}
    />
  );

  const EnhancedWellcomeB = () => {
    const handleNext = () => {
      console.log("WellcomeB completed, moving to PURPOSE step");
      handleStepComplete(STEPS.PURPOSE);
    };
    
    console.log("EnhancedWellcomeB rendering - bypassing wrapper");
    return <WellcomeB onModalNext={handleNext} />;
  };

  const EnhancedWellcomeC = () => {
    const handleNext = () => {
      console.log("WellcomeC completed, moving to PROFESSION step (WellcomeD)");
      handleStepComplete(STEPS.PROFESSION);
    };
    return <WellcomeC onModalNext={handleNext} />;
  };

  const EnhancedWellcomeD = () => {
    const handleNext = (hasSponsor) => {
      console.log("WellcomeD completed with sponsor:", hasSponsor);
      if (hasSponsor && AnonymousDataService.getUserSelections()?.profession !== "İş veren") {
        handleStepComplete(STEPS.SPONSOR_PROFESSION);
      } else {
        handleStepComplete(STEPS.OTHER_DETAILS);
      }
    };
    return <WellcomeD onModalNext={handleNext} />;
  };

  const EnhancedWellcomeDa = () => {
    const handleNext = () => {
      console.log("WellcomeDa completed, moving to OTHER_DETAILS step");
      handleStepComplete(STEPS.OTHER_DETAILS);
    };
    return <WellcomeDa onModalNext={handleNext} />;
  };

  const EnhancedWellcomeE = () => {
    const handleNext = () => {
      console.log("WellcomeE completed, moving to CONTROL step");
      handleStepComplete(STEPS.CONTROL);
    };
    
    console.log("EnhancedWellcomeE rendering, providing handleNext:", typeof handleNext);
    return <WellcomeE onModalNext={handleNext} />;
  };

  const EnhancedControlScreen = () => {
    const handleComplete = () => {
      console.log("ControlScreen completed, closing modal");
      handleStepComplete(null);
    };
    return <ControlScreen onModalComplete={handleComplete} />;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalContentWrapper>
          <CloseButton onClick={handleClose}>×</CloseButton>
          
          {currentStep !== STEPS.SIGNUP && (
            <>
              <StepCounter>
                Adım {getStepNumber(currentStep)} / {getTotalSteps()}
              </StepCounter>
              <ProgressBar>
                <ProgressFill progress={getProgress()} />
              </ProgressBar>
            </>
          )}

          {/* Render current step */}
          {currentStep === STEPS.SIGNUP && <EnhancedSignupForm />}
          {currentStep === STEPS.COUNTRY && <EnhancedWellcomeB />}
          {currentStep === STEPS.PURPOSE && <EnhancedWellcomeC />}
          {currentStep === STEPS.PROFESSION && <EnhancedWellcomeD />}
          {currentStep === STEPS.SPONSOR_PROFESSION && <EnhancedWellcomeDa />}
          {currentStep === STEPS.OTHER_DETAILS && <EnhancedWellcomeE />}
          {currentStep === STEPS.CONTROL && <EnhancedControlScreen />}
        </ModalContentWrapper>
      </ModalContent>
    </ModalOverlay>
  );
}

export default MultiStepOnboardingModal;