/* eslint-disable react/prop-types */
import styled, { keyframes } from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";

// Define animations
const slideIn = keyframes`
  from { 
    transform: translateY(-10px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
`;

const float = keyframes`
  0% { 
    transform: translateY(0px); 
  }
  50% { 
    transform: translateY(-3px); 
  }
  100% { 
    transform: translateY(0px); 
  }
`;

const BannerContainer = styled.div`
  width: 100%;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(232, 244, 253, 0.9);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 102, 204, 0.3);
  border-radius: 12px;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 5000;
  animation: ${slideIn} 0.4s ease-out;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 710px) {
    margin-top: 16px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 16px;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 710px) {
    flex-direction: column;
    height: 100%;
    width: 100%;
    text-align: center;
  }
`;

const WarningIcon = styled.div`
  min-width: 32px;
  height: 32px;
  color: #0066cc;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;

  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 710px) {
    margin-bottom: 4px;
  }
`;

const BannerText = styled.p`
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  text-align: left;
  color: #333333;
  line-height: 1.5;

  @media (max-width: 710px) {
    text-align: center;
    font-size: 14px;
  }
`;

const StyledLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;
  position: relative;
  display: inline-block;
  transition: all 0.2s;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #0066cc;
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
  }

  &:hover {
    color: #0052a3;
    
    &:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`;

const ActionButton = styled.button`
  background: #004466;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 102, 204, 0.3);
  min-width: 140px;
  
  &:hover {
    background: linear-gradient(to right, #0052a3, #004080);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0, 102, 204, 0.3);
  }

  &:disabled {
    background: #c4c4c4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 710px) {
    width: 100%;
    padding: 12px 18px;
  }
`;

const VisaStatusBanner = ({
  type,
  applicationId,
  userId,
  countryLinks,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: async () => {
      const updateField =
        type === "appointment" ? "has_appointment" : "has_filled_form";

      const { data, error } = await supabase
        .from("userAnswers")
        .update({ [updateField]: true })
        .eq("id", parseInt(applicationId))
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: async () => {
      // Query'yi yeniden çalıştır
      await queryClient.invalidateQueries([
        "userSelections",
        userId,
        applicationId,
      ]);

      // Parent component'a başarı durumunu bildir
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    },
  });

  const bannerText =
    type === "appointment"
      ? "Henüz randevunu almadın! Başvuru sürecine başlamak için yetkili vize firmasından randevu alman gerekiyor."
      : "Vize başvuru formunu henüz doldurmadın! Başvurunun işleme alınması için formu doldurman gerekiyor.";

  const linkText = type === "appointment" ? "Randevu Al →" : "Formu Doldur →";
  const buttonText =
    type === "appointment" ? "Randevumu Aldım" : "Formu Doldurdum";
  const linkUrl =
    type === "appointment"
      ? countryLinks?.appointment_link
      : countryLinks?.form_link;

  const handleButtonClick = () => {
    updateStatus();
  };

  // Info/Alert SVG Icon - More informational style than warning
  const AlertIconSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#004466" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  return (
    <BannerContainer>
      <BannerContent>
        <WarningIcon>
          <AlertIconSVG />
        </WarningIcon>
        <BannerText>
          {bannerText}{" "}
          {linkUrl && (
            <StyledLink
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </StyledLink>
          )}
        </BannerText>
      </BannerContent>
      <ActionButton onClick={handleButtonClick} disabled={isLoading}>
        {isLoading ? "Kaydediliyor..." : buttonText}
      </ActionButton>
    </BannerContainer>
  );
};

export default VisaStatusBanner;