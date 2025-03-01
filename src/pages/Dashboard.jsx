/* eslint-disable react/prop-types */

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/apiAuth";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import StepIndicator from "../ui/StepIndicator";
import { useNavigate, useParams } from "react-router-dom";
import { useDocuments } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import styled from "styled-components";
import supabase from "../services/supabase";
import SignupForm from "../features/authentication/SignupForm";
import ModalSignup from "../ui/ModalSignup";
import SponsorStepIndicator from "../ui/SponsorStepIndicator";
import FirmMap from "../ui/FirmMap";
import AnimatedFlag from "../ui/AnimatedFlag";

const CreatedAtContainer = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-700);
  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  @media (max-width: 710px) {
    margin-left: 0;
    margin-top: 40px;
    mix-blend-mode: difference;
    width: 200px;
  }
`;

const CustomRow = styled(Row)`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  align-items: flex-start;
  @media (max-width: 710px) {
    @media (max-height: 830px) {
      gap: 8px;
    }
    width: 400px;
    margin-left: 32px;
    margin-right: auto;
  }
`;

const DashboardContainer = styled.div`
  position: relative;
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 710px) {
    height: 100%;
    width: 100%;
    margin-left: auto;
    flex-flow: column;
    justify-content: flex-start;
    margin-right: auto;
  }
`;

const Ceper = styled.div`
  margin-top: 10px;
  margin-left: 20vw;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 283px;
  height: 127px;
  border: 3px solid #00ffa2;
  filter: drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.11));
  border-radius: 82px;

  @media (max-width: 1300px) {
    margin-left: 12vw;
  }
  
  @media (max-width: 900px) {
    margin-left: 1vw;
  }

  @media (max-width: 710px) {
    position: relative;
    margin: 12px auto;
  }
  &:hover {
    border-color: #004466;
  }
`;

const UyeDevam = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 248.6px;
  height: 89px;
  background: #004466;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.11);
  border-radius: 49px;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: white;
  &:hover {
    background-color: #00ffa2;
    color: #004466;
  }
`;

const StepIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
  @media (max-width: 1450px) {
    margin-bottom: 46px;
  }
  
  @media (max-width: 710px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

const InfoContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  
  @media (max-width: 710px) {
    width: 100%;
  }
`;

// Carousel stilleri
const DashboardItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 710px) {
    position: relative;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-bottom: 20px;
  }
`;

// CarouselContainer artık width prop'u kullanıyor
const CarouselContainer = styled.div`
  width: ${props => props.width ? props.width + "px" : "100%"};
  position: relative;
  overflow: hidden;
`;

const CarouselContent = styled.div`
  display: flex;
  transition: transform 0.4s ease;
  transform: ${props => `translateX(-${props.activeIndex * props.itemWidth}px)`};
  will-change: transform;
  position: relative;
  left: 0;
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  width: ${props => props.width}px;
  padding: 0 10px;
`;

const CarouselControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 15px auto 5px;
  padding: 0;
  gap: 8px;
`;

const PaginationDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#004466' : 'rgba(0, 68, 102, 0.3)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.2);
    background-color: ${props => props.active ? '#004466' : 'rgba(0, 68, 102, 0.5)'};
  }
`;

const NavButton = styled.button`
  background-color: rgba(0, 68, 102, 0.1);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #004466;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0 10px;
  
  &:hover {
    background-color: rgba(0, 68, 102, 0.2);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Dashboard = () => {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [createdAt, setCreatedAt] = useState(null);
  const navigate = useNavigate();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);
  const [touchStart, setTouchStart] = useState(0);
  const carouselRef = useRef(null);
  const [carouselVisible, setCarouselVisible] = useState(false);
  
  // Öğenin genişliğini hesaplıyoruz
  const [itemWidth, setItemWidth] = useState(() => {
    if (window.innerWidth <= 389) {
      return 300;
    } else if (window.innerWidth <= 710) {
      return 350;
    }
    return window.innerWidth;
  });

  const {
    state: { completedDocuments },
    dispatch,
  } = useDocuments();
  const [countryCode, setCountryCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(
    localStorage.getItem("isAnonymous") === "true"
  );

  // Sadece active index sıfırlanıyor
  const resetCarouselPosition = () => {
    setActiveCardIndex(0);
  };

  useLayoutEffect(() => {
    resetCarouselPosition();
  }, [isMobile]);

  useEffect(() => {
    setCarouselVisible(false);
    setTimeout(() => {
      setCarouselVisible(true);
      resetCarouselPosition();
    }, 50);
  }, [isMobile]);

  useEffect(() => {
    resetCarouselPosition();
  }, []);

  useEffect(() => {
    const calculateItemWidth = () => {
      if (window.innerWidth <= 389) {
        return 300;
      } else if (window.innerWidth <= 710) {
        return 350;
      }
      return window.innerWidth;
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 710);
      setItemWidth(calculateItemWidth());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
        if (!isAnonymous) {
          localStorage.removeItem("isAnonymous");
          localStorage.removeItem("userAnswers");
          localStorage.removeItem("userSelections");
        }
        fetchCompletedDocuments(user.id, applicationId).then((data) => {
          const completedDocsMap = data.reduce((acc, doc) => {
            if (!acc[applicationId]) {
              acc[applicationId] = {};
            }
            acc[applicationId][doc.document_name] = true;
            return acc;
          }, {});
          dispatch({
            type: "SET_COMPLETED_DOCUMENTS",
            payload: completedDocsMap,
          });
        });
      }
    });
  }, [applicationId, dispatch, isAnonymous]);

  const handleUserConversion = () => {
    setIsAnonymous(false);
    navigate("/dashboard");
  };

  const {
    data: userSelections,
    isSuccess: isUserSelectionsSuccess,
    isLoading: isUserSelectionsLoading,
    isError: isUserSelectionsError,
  } = useQuery({
    queryKey: ["userSelections", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  useEffect(() => {
    if (isUserSelectionsSuccess) {
      resetCarouselPosition();
    }
  }, [isUserSelectionsSuccess]);

  const ansCountry = userSelections?.[0]?.ans_country;

  async function fetchFirmLocation(country) {
    const { data, error } = await supabase
      .from("visa_firm_locations")
      .select("*")
      .eq("country", country)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  const { data: firmLocation, isSuccess: isFirmLocationSuccess } = useQuery({
    queryKey: ["firmLocation", ansCountry],
    queryFn: () => fetchFirmLocation(ansCountry),
    enabled: !!ansCountry,
  });

  useEffect(() => {
    if (isUserSelectionsSuccess && userSelections?.length > 0) {
      const countryToCode = {
        Almanya: "de",
        Avusturya: "at",
        Belçika: "be",
        Çekya: "cz",
        Danimarka: "dk",
        Estonya: "ee",
        Finlandiya: "fi",
        Fransa: "fr",
        Yunanistan: "gr",
        Macaristan: "hu",
        İzlanda: "is",
        İtalya: "it",
        Letonya: "lv",
        Litvanya: "lt",
        Lüksemburg: "lu",
        Malta: "mt",
        Hollanda: "nl",
        Norveç: "no",
        Polonya: "pl",
        Portekiz: "pt",
        Slovakya: "sk",
        Slovenya: "si",
        İspanya: "es",
        İsveç: "se",
        İsviçre: "ch",
        Lihtenştayn: "li",
        Rusya: "ru",
        ABD: "us",
        Çin: "cn",
        BAE: "ae",
        Avustralya: "au",
        Birleşik_Krallık: "gb",
        Hırvatistan: "hr",
      };

      setCountryCode(countryToCode[ansCountry] || "");

      const rawDate = userSelections[0]?.created_at;

      if (!rawDate) {
        console.error("Tarih verisi bulunamadı.");
        setCreatedAt("Tarih mevcut değil");
        return;
      }

      const createdAtDate = new Date(rawDate);

      if (isNaN(createdAtDate.getTime())) {
        console.error("Geçersiz tarih formatı:", rawDate);
        setCreatedAt("Geçersiz tarih");
      } else {
        const formattedDate = createdAtDate.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setCreatedAt(formattedDate);
      }
    }
  }, [userSelections, isUserSelectionsSuccess, ansCountry]);

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const {
    data: documents,
    isLoading: isDocumentsLoading,
    isError: isDocumentsError,
  } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  useEffect(() => {
    if (documents) {
      resetCarouselPosition();
      setCarouselVisible(false);
      setTimeout(() => {
        setCarouselVisible(true);
        resetCarouselPosition();
      }, 50);
    }
  }, [documents]);

  if (isUserSelectionsLoading || isDocumentsLoading) {
    return <Spinner />;
  }

  if (isUserSelectionsError || isDocumentsError) {
    return <div>Error loading data.</div>;
  }

  const handleStepClick = (step) => {
    setCurrentStep(step);
    navigate(`/summary/${applicationId}`);
  };

  const stepLabels = documents?.map((doc) => doc.docName) || [];
  const hasSponsor = userSelections?.find(selection => selection.ans_hassponsor === true);
  
  // Toplam öğe sayısı: sponsor varsa 3, yoksa 2
  const totalItems = hasSponsor ? 3 : 2;

  return (
    <DashboardContainer>
      <AnimatedFlag countryCode={countryCode} />
      
      <CustomRow type="horizontal">
        {createdAt && (
          <CreatedAtContainer style={{ zIndex: "3000" }}>
            Oluşturulma tarihi: {createdAt}
          </CreatedAtContainer>
        )}
        <Heading style={{ zIndex: "3000" }} as="h1">
          Hoş geldiniz
        </Heading>
      </CustomRow>

      <DashboardItems>
        {/* Masaüstü görünümü */}
        {!isMobile && (
          <>
            <StepIndicatorWrapper>
              <Heading as="h14">Başvuru Sahibinin Belgeleri</Heading>
              <StepIndicator
                steps={stepLabels}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                completedDocuments={completedDocuments}
                documents={documents}
              />
            </StepIndicatorWrapper>

            {hasSponsor && (
              <StepIndicatorWrapper>
                <Heading as="h14">Sponsorun Belgeleri</Heading>
                <SponsorStepIndicator
                  steps={stepLabels}
                  currentStep={currentStep}
                  onStepClick={handleStepClick}
                  completedDocuments={completedDocuments}
                  documents={documents}
                />
              </StepIndicatorWrapper>
            )}
            
            <InfoContainerWrapper>
              <Heading as="h14">Başvuru adresi</Heading>
              {isFirmLocationSuccess && firmLocation && (
                <FirmMap firmLocation={firmLocation} />
              )}
            </InfoContainerWrapper>
          </>
        )}

        {/* Mobil carousel görünümü */}
        {isMobile && (
          <div>
            <CarouselContainer 
              width={itemWidth} 
              style={{ display: carouselVisible ? 'block' : 'none' }}
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const touchEnd = e.changedTouches[0].clientX;
                const diff = touchStart - touchEnd;
                
                if (diff > 50 && activeCardIndex < totalItems - 1) {
                  setActiveCardIndex(prevIndex => prevIndex + 1);
                } else if (diff < -50 && activeCardIndex > 0) {
                  setActiveCardIndex(prevIndex => prevIndex - 1);
                }
              }}
            >
              <CarouselContent 
                ref={carouselRef}
                activeIndex={activeCardIndex} 
                itemWidth={itemWidth}
              >
                <CarouselItem width={itemWidth}>
                  <StepIndicatorWrapper>
                    <Heading as="h14">Başvuru Sahibinin Belgeleri</Heading>
                    <StepIndicator
                      steps={stepLabels}
                      currentStep={currentStep}
                      onStepClick={handleStepClick}
                      completedDocuments={completedDocuments}
                      documents={documents}
                    />
                  </StepIndicatorWrapper>
                </CarouselItem>

                {hasSponsor && (
                  <CarouselItem width={itemWidth}>
                    <StepIndicatorWrapper>
                      <Heading as="h14">Sponsorun Belgeleri</Heading>
                      <SponsorStepIndicator
                        steps={stepLabels}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                        completedDocuments={completedDocuments}
                        documents={documents}
                      />
                    </StepIndicatorWrapper>
                  </CarouselItem>
                )}
                
                <CarouselItem width={itemWidth}>
                  <InfoContainerWrapper>
                    <Heading as="h14">Başvuru adresi</Heading>
                    {isFirmLocationSuccess && firmLocation && (
                      <FirmMap firmLocation={firmLocation} />
                    )}
                  </InfoContainerWrapper>
                </CarouselItem>
              </CarouselContent>
              
              <CarouselControls>
                <NavButton 
                  onClick={() => setActiveCardIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeCardIndex === 0}
                >
                  &lt;
                </NavButton>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <PaginationDot 
                    active={activeCardIndex === 0} 
                    onClick={() => setActiveCardIndex(0)} 
                  />
                  {hasSponsor && (
                    <PaginationDot 
                      active={activeCardIndex === 1} 
                      onClick={() => setActiveCardIndex(1)} 
                    />
                  )}
                  <PaginationDot 
                    active={activeCardIndex === (hasSponsor ? 2 : 1)} 
                    onClick={() => setActiveCardIndex(hasSponsor ? 2 : 1)} 
                  />
                </div>
                
                <NavButton 
                  onClick={() => setActiveCardIndex(prev => Math.min(totalItems - 1, prev + 1))}
                  disabled={activeCardIndex === totalItems - 1}
                >
                  &gt;
                </NavButton>
              </CarouselControls>
            </CarouselContainer>
          </div>
        )}
      </DashboardItems>

      {isAnonymous && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <ModalSignup>
            <ModalSignup.Open opens="signUpForm">
              <Ceper>
                <UyeDevam>Üye Olarak Devam et</UyeDevam>
              </Ceper>
            </ModalSignup.Open>
            <ModalSignup.Window name="signUpForm">
              <SignupForm onSuccess={handleUserConversion} />
            </ModalSignup.Window>
          </ModalSignup>
        </div>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
