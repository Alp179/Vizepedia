/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";
import { FaCheckCircle } from "react-icons/fa";

const Overlay = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(10px);
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  padding: 28px 32px;
  position: relative;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
  animation: fadeIn 0.4s ease-out;
  z-index: 10000;
  margin: 0 auto;
  
  /* Improved height handling */
  max-height: 90vh;
  overflow-y: auto; /* Only apply scroll when needed */
  display: flex;
  flex-direction: column;

  /* Keyboard open handling */
  &.compact-view {
    max-height: 95vh;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #004466, #0077b6);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive adjustments for better fit on different devices */
  @media (max-width: 768px) {
    padding: 24px 24px;
    border-radius: 16px;
    max-height: 85vh;
  }

  /* Standard iPhone sizes */
  @media (max-width: 480px) {
    padding: 20px 16px;
    border-radius: 14px;
    max-height: 80vh;
  }

  /* iPhone 12/13/14 and similar sized devices */
  @media (max-height: 844px) and (max-width: 480px) {
    padding: 16px 14px;
    
    /* Optimize content to avoid scrolling on iPhone 12 */
    & > * {
      transform-origin: top center;
      transform: scale(0.95);
      margin-bottom: -5px; /* Compensate for the scaling */
    }
  }

  /* iPhone 11/XR and similar sized devices */
  @media (max-height: 896px) and (min-height: 845px) and (max-width: 480px) {
    padding: 18px 15px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(90deg, #004466, #0077b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  position: relative;
  margin: 0 0 24px;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 20px 30px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 30px;
    right: 30px;
    height: 3px;
    background-color: #e9ecef;
    z-index: 0;
    transform: translateY(-50%);
  }

  @media (max-width: 768px) {
    margin: 5px 10px 24px;
  }

  @media (max-width: 480px) {
    margin: 0 5px 20px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    margin: 0 5px 14px;
  }
`;

const StepLine = styled.div`
  position: absolute;
  top: 50%;
  left: 30px;
  width: ${props => {
    if (props.progress === 0) return '0%';
    if (props.progress === 1) return '50%';
    return '100%';
  }};
  height: 3px;
  background: linear-gradient(90deg, #004466, #0077b6);
  z-index: 0;
  transform: translateY(-50%);
  transition: width 0.5s ease-in-out;

  @media (max-width: 480px) {
    left: 22px;
    right: 22px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    left: 18px;
  }
`;

const ProgressStep = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'white'};
  border: 3px solid ${props => props.active ? '#004466' : '#e9ecef'};
  color: ${props => props.active ? '#004466' : '#adb5bd'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 5px 15px rgba(0, 68, 102, 0.2)' : 'none'};
  
  ${props => props.completed && `
    background-color: #004466;
    color: white;
  `}

  &:after {
    content: '${props => props.label}';
    position: absolute;
    bottom: -25px;
    font-size: 13px;
    white-space: nowrap;
    color: ${props => props.active ? '#004466' : '#adb5bd'};
    font-weight: ${props => props.active ? '600' : '500'};
    letter-spacing: 0.3px;
  }

  /* Responsive size adjustments */
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 15px;

    &:after {
      font-size: 12px;
      bottom: -22px;
    }
  }

  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
    font-size: 14px;
    border-width: 2px;

    &:after {
      font-size: 10px;
      bottom: -20px;
    }
  }
  
  /* When keyboard is open */
  .compact-view & {
    width: 32px;
    height: 32px;
    font-size: 11px;
    border-width: 2px;
    
    &:after {
      font-size: 8px;
      bottom: -16px;
    }
  }
`;

const StepContainer = styled.div`
  margin-bottom: 18px;
  background-color: #f8f9fa;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;

  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 14px;
    margin-bottom: 16px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 14px;
    border-radius: 10px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
`;

const StepTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    margin-bottom: 6px;
  }
`;

const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.answered ? 'linear-gradient(135deg, #004466, #0077b6)' : '#e9ecef'};
  color: ${props => props.answered ? 'white' : '#6c757d'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  margin-right: 10px;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 12px;
    margin-right: 8px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    width: 20px;
    height: 20px;
    font-size: 10px;
    margin-right: 6px;
  }
`;

const StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    font-size: 12px;
  }
`;

const StepDescription = styled.p`
  font-size: 14px;
  color: #495057;
  margin-bottom: 16px;
  line-height: 1.5;
  padding-left: 40px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 14px;
    padding-left: 34px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 12px;
    padding-left: 32px;
    line-height: 1.4;
  }
  
  /* When keyboard is open */
  .compact-view & {
    font-size: 10px;
    margin-bottom: 8px;
    padding-left: 26px;
    line-height: 1.2;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
  padding-left: 40px;

  @media (max-width: 768px) {
    padding-left: 34px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding-left: 0;
    flex-direction: column;
    gap: 8px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    margin-top: 5px;
    gap: 5px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.checked ? '600' : '500'};
  color: ${props => props.checked ? '#004466' : '#495057'};
  padding: 12px 16px;
  border-radius: 10px;
  transition: all 0.2s ease;
  background-color: white;
  border: 2px solid ${props => props.checked ? '#004466' : '#e9ecef'};
  box-shadow: ${props => props.checked ? '0 4px 12px rgba(0, 68, 102, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.03)'};
  flex: 1;
  min-width: 180px;
  position: relative;
  z-index: 1;

  &:hover {
    background-color: ${props => props.checked ? 'white' : '#f8f9fa'};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  }

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 12px;
    background: ${props => props.checked ? 'linear-gradient(135deg, #004466, #0077b6)' : 'transparent'};
    z-index: -1;
    opacity: ${props => props.checked ? '1' : '0'};
    transition: opacity 0.3s ease;
  }

  input[type="radio"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #004466;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    min-width: 160px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
    min-width: 0;
    width: 100%;

    input[type="radio"] {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-height: 700px) {
    padding: 8px 10px;
    font-size: 12px;
    
    input[type="radio"] {
      width: 14px;
      height: 14px;
    }
  }
  
  /* When keyboard is open */
  .compact-view & {
    padding: 6px 8px;
    font-size: 11px;
    border-width: 1px;
    
    input[type="radio"] {
      width: 12px;
      height: 12px;
    }
  }
`;

const StyledLink = styled.a`
  color: #004466;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  padding: 5px 12px;
  margin-left: 0;
  margin-top: 2px;
  border-radius: 8px;
  background-color: rgba(0, 68, 102, 0.08);
  box-shadow: 0 2px 5px rgba(0, 68, 102, 0.1);
  font-size: 13px;

  &:hover {
    background-color: rgba(0, 68, 102, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 68, 102, 0.15);
  }

  &:after {
    content: "→";
    font-size: 15px;
    transition: transform 0.2s ease;
  }

  &:hover:after {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 3px 8px;
    font-size: 11px;
    margin-top: 4px;
    display: inline-block;
    width: auto;
  }
  
  /* When keyboard is open */
  .compact-view & {
    padding: 2px 5px;
    font-size: 9px;
    margin-top: 2px;
    
    &:after {
      font-size: 11px;
    }
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 24px;
  position: relative;
  z-index: 5;

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 16px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    margin-top: 10px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #004466, #0077b6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 68, 102, 0.2);
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: left 0.7s ease;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 8px 20px rgba(0, 68, 102, 0.3);
  }
  
  &:hover:not(:disabled):before {
    left: 100%;
  }

  &:active:not(:disabled) {
    box-shadow: 0 4px 10px rgba(0, 68, 102, 0.2);
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 15px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    border-radius: 8px;
  }
  
  /* When keyboard is open */
  .compact-view & {
    padding: 8px;
    font-size: 12px;
    border-radius: 6px;
  }
`;

// Success Animation
const SuccessAnimationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: opacity 0.5s ease;
  opacity: ${props => props.show ? 1 : 0};
  padding: 0 16px;
`;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  animation: ${props => props.show ? 'popUpSuccess 0.5s ease-out forwards' : 'none'};
  
  @keyframes popUpSuccess {
    0% { transform: scale(0.7); opacity: 0; }
    70% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  svg {
    color: #00b074;
    font-size: 70px;
    margin-bottom: 20px;
    animation: ${props => props.show ? 'successIconAnim 0.7s ease-out' : 'none'};
  }
  
  h3 {
    font-size: 24px;
    color: #343a40;
    margin-bottom: 12px;
    font-weight: 700;
    text-align: center;
  }
  
  p {
    font-size: 16px;
    color: #6c757d;
    text-align: center;
    line-height: 1.5;
  }
  
  @keyframes successIconAnim {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }

  @media (max-width: 768px) {
    padding: 28px;
    border-radius: 16px;
    
    svg {
      font-size: 60px;
      margin-bottom: 18px;
    }
    
    h3 {
      font-size: 22px;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 15px;
    }
  }

  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 14px;
    
    svg {
      font-size: 50px;
      margin-bottom: 14px;
    }
    
    h3 {
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
    }
  }
`;

// Main component
const VisaCheckModal = ({ userId, applicationId }) => {
  const [hasAppointment, setHasAppointment] = useState(null);
  const [hasFilledForm, setHasFilledForm] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideModal, setHideModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const queryClient = useQueryClient();

  // Track screen dimensions and detect keyboard
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
      
      // On mobile, detect if keyboard might be open (significant height decrease)
      if (window.innerWidth <= 480) {
        // Original height we recorded on component mount
        const originalHeight = window.outerHeight;
        const newHeight = window.innerHeight;
        // If height reduced by more than 25%, keyboard might be open
        setIsKeyboardOpen(newHeight < originalHeight * 0.75);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('focusin', () => {
      // When an input is focused on mobile, adjust container
      if (isMobile && document.activeElement.tagName === 'INPUT') {
        setIsKeyboardOpen(true);
      }
    });
    window.addEventListener('focusout', () => {
      // When input loses focus
      if (isMobile && document.activeElement.tagName !== 'INPUT') {
        setIsKeyboardOpen(false);
      }
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', () => {});
      window.removeEventListener('focusout', () => {});
    };
  }, [isMobile]);

  // Get user selections
  const { 
    data: userSelections, 
    isLoading: isLoadingSelections, 
    isError: isSelectionsError
  } = useQuery({
    queryKey: ['userSelections', userId, applicationId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("userAnswers")
          .select("*")
          .eq("id", applicationId)
          .eq("user_id", userId);

        if (error) throw error;
        
        return data || [];
      } catch (err) {
        console.error("VisaCheckModal data fetch error:", err);
        throw err;
      }
    },
    enabled: !!userId && !!applicationId,
    staleTime: 1000 * 60 * 5, // 5 minute cache
    retry: 1,
    onError: (err) => {
      console.error("VisaCheckModal query error:", err);
    }
  });

  // Get consulate links
  const { 
    data: countryLinks, 
    isLoading: isLoadingLinks
  } = useQuery({
    queryKey: ['countryLinks', userSelections?.[0]?.country_id],
    queryFn: async () => {
      if (!userSelections?.[0]?.country_id) return null;
      
      const { data, error } = await supabase
        .from('countries')
        .select('appointment_link, form_link')
        .eq('id', userSelections[0].country_id)
        .single();

      if (error) {
        if (error.message.includes("JSON object requested, multiple (or no) rows returned")) {
          return null;
        }
        throw error;
      }
      return data;
    },
    enabled: !!userSelections?.[0]?.country_id,
    staleTime: 1000 * 60 * 60, // 1 hour cache
    retry: 1
  });

  // Set initial values from database
  useEffect(() => {
    if (isLoadingSelections || !userSelections?.length) return;
    
    if (hasAppointment === null) {
      setHasAppointment(userSelections[0]?.has_appointment ?? null);
    }
    
    if (hasFilledForm === null) {
      setHasFilledForm(userSelections[0]?.has_filled_form ?? null);
    }
  }, [userSelections, isLoadingSelections, hasAppointment, hasFilledForm]);

  // Control modal visibility
  useEffect(() => {
    if (isLoadingSelections) return;
    
    if (isSelectionsError || !userSelections || userSelections.length === 0) {
      console.error("Visa check modal error or missing data:", isSelectionsError);
      return;
    }
    
    const dbAppointment = userSelections[0]?.has_appointment;
    const dbFilledForm = userSelections[0]?.has_filled_form;
    
    const needsModal = dbAppointment === null || dbAppointment === undefined || 
                      dbFilledForm === null || dbFilledForm === undefined;

    setShowModal(needsModal);
  }, [isLoadingSelections, isSelectionsError, userSelections]);

  // Update mutation
  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: async ({ hasAppointment, hasFilledForm }) => {
      console.log("Updating values:", { hasAppointment, hasFilledForm });

      const { data, error } = await supabase
        .from("userAnswers")
        .update({
          has_appointment: hasAppointment,
          has_filled_form: hasFilledForm,
        })
        .eq("id", applicationId)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      console.log("Update successful:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("Success callback - updated data:", data);

      const existingData = queryClient.getQueryData([
        "userSelections",
        userId,
        applicationId,
      ]);
      console.log("Existing data before update:", existingData);

      if (existingData && existingData.length > 0) {
        const updatedData = existingData.map((item, index) =>
          index === 0
            ? {
                ...item,
                has_appointment: data.has_appointment,
                has_filled_form: data.has_filled_form,
              }
            : item
        );

        console.log("Setting new data:", updatedData);
        queryClient.setQueryData(
          ["userSelections", userId, applicationId],
          updatedData
        );
      }
      
      setHideModal(true);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        
        setTimeout(() => {
          setShowModal(false);
          console.log("Process completed, modal closed");
        }, 500);
      }, 3000);
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    },
  });

  const handleSubmit = () => {
    if (hasAppointment !== null && hasFilledForm !== null) {
      updateStatus({ hasAppointment, hasFilledForm });
    }
  };

  // Progress calculation
  const calculateProgress = () => {
    let completed = 0;
    if (hasAppointment !== null) completed += 1;
    if (hasFilledForm !== null) completed += 1;
    return completed;
  };
  
  const progress = calculateProgress();
  const isStep1Answered = hasAppointment !== null;
  const isStep2Answered = hasFilledForm !== null;
  const isFormComplete = hasAppointment !== null && hasFilledForm !== null;

  // Determine if we need to use compact styling based on keyboard state only
  const isCompactView = isKeyboardOpen;

  // Don't render if loading or modal shouldn't be shown
  if (isLoadingSelections || isLoadingLinks || !showModal) return null;

  return (
    <>
      {/* Main Modal */}
      {!hideModal && createPortal(
        <Overlay>
          <ModalContainer className={isCompactView ? 'compact-view' : ''}>
            <ModalTitle>Vize Başvuru Süreciniz</ModalTitle>
            
            <ProgressIndicator>
              <StepLine progress={progress} />
              <ProgressStep 
                active={true}
                completed={true}
                label="Başlangıç"
              >
                1
              </ProgressStep>
              <ProgressStep 
                active={progress >= 1} 
                completed={isStep1Answered}
                label="Randevu"
              >
                2
              </ProgressStep>
              <ProgressStep 
                active={progress >= 2} 
                completed={isStep1Answered && isStep2Answered}
                label="Form"
              >
                3
              </ProgressStep>
            </ProgressIndicator>
            
            <StepContainer>
              <StepTitleWrapper>
                <StepNumber answered={hasAppointment !== null}>1</StepNumber>
                <StepTitle>Randevunu Aldın mı?</StepTitle>
              </StepTitleWrapper>
              <StepDescription>
                Senin için en uygun randevuyu konsolosluk tarafından yetkilendirilen
                başvuru firmalarından alman gerekiyor.
                {countryLinks?.appointment_link && (
                  <StyledLink
                    href={countryLinks.appointment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Randevu Nasıl Alınır?
                  </StyledLink>
                )}
              </StepDescription>
              <RadioGroup>
                <RadioLabel checked={hasAppointment === true}>
                  <input
                    type="radio"
                    name="appointment"
                    checked={hasAppointment === true}
                    onChange={() => setHasAppointment(true)}
                  />
                  Evet, randevumu aldım
                </RadioLabel>
                <RadioLabel checked={hasAppointment === false}>
                  <input
                    type="radio"
                    name="appointment"
                    checked={hasAppointment === false}
                    onChange={() => setHasAppointment(false)}
                  />
                  Hayır, henüz almadım
                </RadioLabel>
              </RadioGroup>
            </StepContainer>

            <StepContainer>
              <StepTitleWrapper>
                <StepNumber answered={hasFilledForm !== null}>2</StepNumber>
                <StepTitle>Vize Başvuru Formunu Doldurdun mu?</StepTitle>
              </StepTitleWrapper>
              <StepDescription>
                Formu online olarak doldurman, başvurunun işleme alınması için
                zorunludur.
                {countryLinks?.form_link && (
                  <StyledLink
                    href={countryLinks.form_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Formu Nereden Doldururum?
                  </StyledLink>
                )}
              </StepDescription>
              <RadioGroup>
                <RadioLabel checked={hasFilledForm === true}>
                  <input
                    type="radio"
                    name="form"
                    checked={hasFilledForm === true}
                    onChange={() => setHasFilledForm(true)}
                  />
                  Evet, doldurdum
                </RadioLabel>
                <RadioLabel checked={hasFilledForm === false}>
                  <input
                    type="radio"
                    name="form"
                    checked={hasFilledForm === false}
                    onChange={() => setHasFilledForm(false)}
                  />
                  Hayır, henüz doldurmadım
                </RadioLabel>
              </RadioGroup>
            </StepContainer>

            <ButtonWrapper>
              <SubmitButton
                onClick={handleSubmit}
                disabled={!isFormComplete || isLoading}
              >
                {isLoading ? "Kaydediliyor..." : "Devam Et"}
              </SubmitButton>
            </ButtonWrapper>
          </ModalContainer>
        </Overlay>,
        document.body
      )}
      
      {/* Success Animation */}
      {createPortal(
        <SuccessAnimationContainer show={showSuccess}>
          <SuccessContent show={showSuccess}>
            <FaCheckCircle />
            <h3>İşlem Başarılı!</h3>
            <p>Vize başvuru adımlarınız kaydedildi.</p>
          </SuccessContent>
        </SuccessAnimationContainer>,
        document.body
      )}
    </>
  );
};

export default VisaCheckModal;