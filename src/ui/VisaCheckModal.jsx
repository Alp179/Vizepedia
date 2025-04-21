/* eslint-disable react/prop-types */
import { useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";
import { HiX } from "react-icons/hi";

const Overlay = styled.div`
  position: fixed; /* Sayfanın tamamını kapsaması için fixed yapıyoruz */
  z-index: 9999; /* En üstte görünecek şekilde ayarlanıyor */
  top: 0;
  left: 0;
  width: 100vw; /* Tüm genişliği kapla */
  height: 100vh; /* Tüm yüksekliği kapla */
  background-color: var(--backdrop-color); /* Arka plan rengini ayarla */
  backdrop-filter: blur(4px); /* Tüm arka planı blur yap */
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: var(--color-grey-0);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  padding: 24px;
  position: relative;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);

  @media (max-width: 710px) {
    padding: 16px;
    width: 95%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-grey-500);
  font-size: 20px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
    color: var(--color-grey-700);
  }
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--color-grey-800);
  margin-bottom: 24px;
  text-align: center;
`;

const StepContainer = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-grey-200);
  padding-bottom: 24px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--color-grey-700);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepDescription = styled.p`
  font-size: 14px;
  color: var(--color-grey-600);
  margin-bottom: 16px;
  line-height: 1.5;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 16px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-grey-700);

  input[type="radio"] {
    cursor: pointer;
  }
`;

const StyledLink = styled.a`
  color: var(--color-brand-600);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--color-brand-600);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 24px;

  &:hover {
    background-color: var(--color-brand-700);
  }

  &:disabled {
    background-color: var(--color-grey-400);
    cursor: not-allowed;
  }
`;

const VisaCheckModal = ({ onClose, applicationId, userId, countryLinks }) => {
  const [hasAppointment, setHasAppointment] = useState(null);
  const [hasFilledForm, setHasFilledForm] = useState(null);
  const queryClient = useQueryClient();

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

      // Önce mevcut veriyi al
      const existingData = queryClient.getQueryData([
        "userSelections",
        userId,
        applicationId,
      ]);
      console.log("Existing data before update:", existingData);

      if (existingData && existingData.length > 0) {
        // Cache'i güncelle
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

      // Query'yi yeniden çalıştır
      queryClient.invalidateQueries(["userSelections", userId, applicationId]);
      onClose();
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

  const isFormComplete = hasAppointment !== null && hasFilledForm !== null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <HiX />
        </CloseButton>
        <ModalTitle>Vize Başvuru Süreciniz</ModalTitle>

        <StepContainer>
          <StepTitle>🔹 1. Adım: Randevunu Aldın mı?</StepTitle>
          <StepDescription>
            Senin için en uygun randevuyu konsolosluk tarafından yetkilendirilen
            başvuru firmalarından alman gerekiyor.
            {countryLinks?.appointment_link && (
              <>
                {" "}
                →{" "}
                <StyledLink
                  href={countryLinks.appointment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Randevu Nasıl Alınır?
                </StyledLink>
              </>
            )}
          </StepDescription>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="appointment"
                checked={hasAppointment === true}
                onChange={() => setHasAppointment(true)}
              />
              Evet, randevumu aldım
            </RadioLabel>
            <RadioLabel>
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
          <StepTitle>🔹 2. Adım: Vize Başvuru Formunu Doldurdun mu?</StepTitle>
          <StepDescription>
            Formu online olarak doldurman, başvurunun işleme alınması için
            zorunludur.
            {countryLinks?.form_link && (
              <>
                {" "}
                →{" "}
                <StyledLink
                  href={countryLinks.form_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Formu Nereden Doldururum?
                </StyledLink>
              </>
            )}
          </StepDescription>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="form"
                checked={hasFilledForm === true}
                onChange={() => setHasFilledForm(true)}
              />
              Evet, doldurdum
            </RadioLabel>
            <RadioLabel>
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

        <SubmitButton
          onClick={handleSubmit}
          disabled={!isFormComplete || isLoading}
        >
          {isLoading ? "Kaydediliyor..." : "Devam Et"}
        </SubmitButton>
      </ModalContainer>
    </Overlay>
  );
};

export default VisaCheckModal;
