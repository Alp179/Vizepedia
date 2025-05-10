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
  padding: 0 16px; /* Mobil cihazlar için padding ekledik */
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  width: 100%; /* Genişlik değiştirildi */
  max-width: 600px;
  padding: 36px 32px;
  position: relative;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
  animation: fadeIn 0.4s ease-out;
  overflow: hidden;
  z-index: 10000;
  margin: 0 auto; /* Merkezleme için auto margin */
  max-height: 90vh; /* Maksimum yükseklik */
  overflow-y: auto; /* İçerik çok uzunsa scroll */

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

  /* Mobil için padding ayarları */
  @media (max-width: 768px) {
    padding: 28px 24px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 14px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(90deg, #004466, #0077b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  position: relative;
  margin: 0 0 40px;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 28px;
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 20px 40px;
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
    margin: 5px 10px 32px;
  }

  @media (max-width: 480px) {
    margin: 0 5px 25px;
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
`;

const ProgressStep = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'white'};
  border: 3px solid ${props => props.active ? '#004466' : '#e9ecef'};
  color: ${props => props.active ? '#004466' : '#adb5bd'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
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
    bottom: -30px;
    font-size: 14px;
    white-space: nowrap;
    color: ${props => props.active ? '#004466' : '#adb5bd'};
    font-weight: ${props => props.active ? '600' : '500'};
    letter-spacing: 0.3px;
  }

  /* Mobil cihazlarda daha küçük adım göstergeleri */
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 16px;

    &:after {
      font-size: 12px;
      bottom: -24px;
    }
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
    border-width: 2px;

    &:after {
      font-size: 10px;
      bottom: -20px;
    }
  }
`;

const StepContainer = styled.div`
  margin-bottom: 32px;
  background-color: #f8f9fa;
  border-radius: 14px;
  padding: 24px;
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
    padding: 20px;
    margin-bottom: 24px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 20px;
    border-radius: 10px;
  }
`;

const StepTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.answered ? 'linear-gradient(135deg, #004466, #0077b6)' : '#e9ecef'};
  color: ${props => props.answered ? 'white' : '#6c757d'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  margin-right: 12px;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
    margin-right: 10px;
  }
`;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const StepDescription = styled.p`
  font-size: 15px;
  color: #495057;
  margin-bottom: 22px;
  line-height: 1.6;
  padding-left: 44px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 18px;
    padding-left: 38px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 16px;
    padding-left: 36px;
    line-height: 1.5;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  flex-wrap: wrap;
  padding-left: 44px;

  @media (max-width: 768px) {
    padding-left: 38px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding-left: 0; /* Mobilde padding kaldırıldı */
    flex-direction: column; /* Mobilde altalta sırala */
    gap: 10px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: ${props => props.checked ? '600' : '500'};
  color: ${props => props.checked ? '#004466' : '#495057'};
  padding: 14px 24px;
  border-radius: 10px;
  transition: all 0.2s ease;
  background-color: white;
  border: 2px solid ${props => props.checked ? '#004466' : '#e9ecef'};
  box-shadow: ${props => props.checked ? '0 4px 12px rgba(0, 68, 102, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.03)'};
  flex: 1;
  min-width: 200px;
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
    width: 20px;
    height: 20px;
    accent-color: #004466;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 14px;
    min-width: 160px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
    min-width: 0; /* Mobilde min-width sıfırlandı */
    width: 100%; /* Tam genişlik */

    input[type="radio"] {
      width: 18px;
      height: 18px;
    }
  }
`;
const StyledLink = styled.a`
  color: #004466;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  padding: 6px 14px;
  margin-left: 0;
  margin-top: 2px;
  border-radius: 8px;
  background-color: rgba(0, 68, 102, 0.08);
  box-shadow: 0 2px 5px rgba(0, 68, 102, 0.1);

  &:hover {
    background-color: rgba(0, 68, 102, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 68, 102, 0.15);
  }

  &:after {
    content: "→";
    font-size: 17px;
    transition: transform 0.2s ease;
  }

  &:hover:after {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 12px;
    margin-top: 4px;
    display: inline-block;
    width: auto;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 38px;
  position: relative;
  z-index: 5;

  @media (max-width: 768px) {
    margin-top: 30px;
  }

  @media (max-width: 480px) {
    margin-top: 24px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #004466, #0077b6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
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
    padding: 16px;
    font-size: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    font-size: 15px;
    border-radius: 8px;
  }
`;

// Animasyon için yardımcı bileşen - Success Animation
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
  padding: 0 16px; /* Mobil için padding */
`;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%; /* Tam genişlik */
  animation: ${props => props.show ? 'popUpSuccess 0.5s ease-out forwards' : 'none'};
  
  @keyframes popUpSuccess {
    0% { transform: scale(0.7); opacity: 0; }
    70% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  svg {
    color: #00b074;
    font-size: 80px;
    margin-bottom: 25px;
    animation: ${props => props.show ? 'successIconAnim 0.7s ease-out' : 'none'};
  }
  
  h3 {
    font-size: 28px;
    color: #343a40;
    margin-bottom: 15px;
    font-weight: 700;
    text-align: center;
  }
  
  p {
    font-size: 18px;
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
    padding: 30px;
    border-radius: 16px;
    
    svg {
      font-size: 70px;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 24px;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 14px;
    
    svg {
      font-size: 60px;
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 14px;
    }
  }
`;

// Kendi kendini kontrol eden modal bileşeni
const VisaCheckModal = ({ userId, applicationId }) => {
  const [hasAppointment, setHasAppointment] = useState(null);
  const [hasFilledForm, setHasFilledForm] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideModal, setHideModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ setIsMobile] = useState(window.innerWidth <= 480);
  const queryClient = useQueryClient();

  // Ekran boyutunu izle
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Kullanıcı cevaplarını getir
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
        
        // Veri yoksa boş dizi dön (hata fırlatma)
        return data || [];
      } catch (err) {
        console.error("VisaCheckModal data fetch error:", err);
        throw err;
      }
    },
    enabled: !!userId && !!applicationId,
    staleTime: 1000 * 60 * 5, // 5 dakika önbellek
    retry: 1, // Sadece 1 kez yeniden dene
    onError: (err) => {
      console.error("VisaCheckModal query error:", err);
    }
  });

  // Konsolosluk linklerini getir
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
        // Bu durumda sessizce null dön, hata fırlatma
        if (error.message.includes("JSON object requested, multiple (or no) rows returned")) {
          return null;
        }
        throw error;
      }
      return data;
    },
    enabled: !!userSelections?.[0]?.country_id,
    staleTime: 1000 * 60 * 60, // 1 saat önbellek
    retry: 1
  });

  // Veritabanından gelen başlangıç değerlerini state'e aktar
  useEffect(() => {
    if (isLoadingSelections || !userSelections?.length) return;
    
    // Sadece null ise state'i güncelle, yoksa kullanıcının seçimini koru
    if (hasAppointment === null) {
      setHasAppointment(userSelections[0]?.has_appointment ?? null);
    }
    
    if (hasFilledForm === null) {
      setHasFilledForm(userSelections[0]?.has_filled_form ?? null);
    }
  }, [userSelections, isLoadingSelections, hasAppointment, hasFilledForm]);

  // Modal'ın gösterilip gösterilmeyeceğini kontrol et
  useEffect(() => {
    if (isLoadingSelections) return;
    
    // DÜZELTME: Hata veya veri yoksa modalı gösterme, sessizce çık
    if (isSelectionsError || !userSelections || userSelections.length === 0) {
      console.error("Visa check modal error or missing data:", isSelectionsError);
      return;
    }
    
    // Veritabanındaki değerleri kontrol et
    const dbAppointment = userSelections[0]?.has_appointment;
    const dbFilledForm = userSelections[0]?.has_filled_form;
    
    // Database'de bu alanlardan herhangi biri null veya undefined ise, modalı göster
    const needsModal = dbAppointment === null || dbAppointment === undefined || 
                      dbFilledForm === null || dbFilledForm === undefined;

    setShowModal(needsModal);
  }, [isLoadingSelections, isSelectionsError, userSelections]);

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
      
      // Modal arka planını gizle ve başarı mesajını göster
      setHideModal(true);
      setShowSuccess(true);
      
      // 3 saniye sonra başarı mesajını gizle
      setTimeout(() => {
        setShowSuccess(false);
        
        // Animasyon için biraz bekle sonra tamamen kapat
        setTimeout(() => {
          // Modalı tamamen kapat
          setShowModal(false);
          console.log("İşlem tamamlandı, modal kapatıldı");
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

  // Progress hesaplama
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

  // Veri yükleniyorsa veya modal gösterilmeyecekse, hiçbir şey render etme
  if (isLoadingSelections || isLoadingLinks || !showModal) return null;
  return (
    <>
      {/* Ana Modal */}
      {!hideModal && createPortal(
        <Overlay>
          <ModalContainer>
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
      
      {/* Bağımsız Başarı Mesajı */}
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