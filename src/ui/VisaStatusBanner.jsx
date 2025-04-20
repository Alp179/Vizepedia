/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";

const BannerContainer = styled.div`
  width: 100%;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 5000;

  @media (max-width: 710px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 12px;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 710px) {
    flex-direction: column;
    width: 100%;
    text-align: center;
  }
`;

const BannerText = styled.p`
  color: #856404;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  text-align: left;

  @media (max-width: 710px) {
    text-align: center;
  }
`;

const StyledLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
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

  return (
    <BannerContainer>
      <BannerContent>
        <span style={{ fontSize: "24px" }}>⚠️</span>
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
