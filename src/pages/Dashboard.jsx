/* eslint-disable react/prop-types */

import { useEffect, useState, useLayoutEffect } from "react";
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
import FirmMap from "../ui/FirmMap";
import AnimatedFlag from "../ui/AnimatedFlag";
import MobileCarousel from "../ui/MobileCarousel";
import VisaCheckModal from "../ui/VisaCheckModal";
import VisaStatusBanner from "../ui/VisaStatusBanner";

const CreatedAtContainer = styled.div`
  font-size: 1.5rem;
  color: var(--color-grey-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  z-index: 3000;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(5px);
  padding: 6px 12px;
  border-radius: 6px;
  
  /* Mobil overflow kontrolü */
  max-width: calc(100vw - 80px);
  box-sizing: border-box;
  
  @media (max-width: 710px) {
    font-size: 1.2rem;
    max-width: calc(100vw - 60px);
    padding: 4px 8px;
  }
  
  @media (max-width: 450px) {
    font-size: 1rem;
    max-width: calc(100vw - 40px);
  }
`;

const CustomRow = styled(Row)`
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 3000;
  margin: 25px auto 10px 0;
  
  /* Overflow kontrolü ekleyelim */
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  
  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  padding: 0;
  @media (max-width: 710px) {
    margin: 55px auto 0 44px;
    /* Mobilde margin kontrolü */
    margin-left: 20px;
    margin-right: 20px;
    justify-content: center;
  }
  @media (max-width: 450px) {
    margin-top: 40px;
    margin-left: 10px;
    margin-right: 10px;
  }
`;

const DashboardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100vw; /* Viewport genişliğini aşmasını engelle */
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  overflow-x: hidden; /* Yatay overflow'u gizle */
  box-sizing: border-box; /* Padding ve border'ları width'e dahil et */

  @media (max-width: 710px) {
    height: 100%;
    width: 100%;
    max-width: 100vw; /* Mobilde de viewport sınırı */
    margin-left: auto;
    flex-flow: column;
    justify-content: flex-start;
    margin-right: auto;
    padding-top: 15px;
    padding-left: 10px; /* Yan padding ekle */
    padding-right: 10px;
    background: linear-gradient(
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.1) 40%,
      rgba(0, 0, 0, 0) 60%
    );
    align-items: stretch;
  }
  
  @media (max-width: 450px) {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const BannersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: calc(100% - 40px);
  max-width: 800px;
  padding: 0;
  align-self: flex-start;
  box-sizing: border-box; /* Box-sizing ekle */

  @media (max-width: 1550px) {
    margin-left: -100px;
  }

  @media (max-width: 1200px) {
    width: calc(100vw - 400px);
    max-width: calc(100vw - 400px); /* Max-width kontrolü */
  }

  @media (max-width: 900px) {
    width: 500px;
    max-width: calc(100vw - 40px); /* Viewport sınırı */
  }

  @media (max-width: 768px) {
    padding: 0 10px;
    width: 60%;
    max-width: calc(100vw - 40px);
  }
  
  @media (max-width: 710px) {
    margin: 30px auto 0 auto;
    width: 450px;
    max-width: calc(100vw - 40px); /* Mobilde viewport sınırı */
  }
  
  @media (max-width: 500px) {
    width: 100%;
    max-width: calc(100vw - 20px);
  }
`;

const Ceper = styled.div`
  margin-top: 20px;
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
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  box-sizing: border-box; /* Box-sizing ekle */

  @media (max-width: 1300px) {
    margin-left: 12vw;
  }

  @media (max-width: 900px) {
    margin-left: 1vw;
  }

  @media (max-width: 710px) {
    position: relative;
    margin: 0 auto;
    transform: scale(0.85);
    /* Küçük ekranlarda boyut kontrolü */
    max-width: calc(100vw - 40px);
  }
  
  @media (max-width: 450px) {
    transform: scale(0.75);
    max-width: calc(100vw - 20px);
  }
  
  &:hover {
    border-color: #004466;
    transform: scale(1.03);

    @media (max-width: 710px) {
      transform: scale(0.9);
    }
    
    @media (max-width: 450px) {
      transform: scale(0.8);
    }
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
  transition: all 0.3s ease;
  border: none;
  outline: none;
  box-sizing: border-box; /* Box-sizing ekle */

  &:hover {
    background-color: #00ffa2;
    color: #004466;
    transform: translateY(-3px);
    box-shadow: 0px 25px 50px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const StepIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
  box-sizing: border-box; /* Box-sizing ekle */

  @media (max-width: 1450px) {
    margin-bottom: 40px;
  }

  @media (max-width: 710px) {
    width: 100%;
    max-width: 100%; /* Genişlik kontrolü */
  }
`;

const InfoContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box; /* Box-sizing ekle */
  
  @media (max-width: 710px) {
    max-width: 100%; /* Genişlik kontrolü */
  }
`;

// Carousel stilleri - overflow kontrolü ekle
const DashboardItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 100%; /* Genişlik sınırı */
  overflow-x: hidden; /* Yatay overflow kontrolü */
  box-sizing: border-box; /* Box-sizing ekle */

  @media (max-width: 710px) {
    position: relative;
    width: 100%;
    max-width: 100vw; /* Viewport sınırı */
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: -8px;
  }
`;

const Dashboard = () => {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [createdAt, setCreatedAt] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);

  const {
    state: { completedDocuments },
    dispatch,
  } = useDocuments();
  const [countryCode, setCountryCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(
    localStorage.getItem("isAnonymous") === "true"
  );

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 710);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    refetch: refetchUserSelections,
  } = useQuery({
    queryKey: ["userSelections", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  
  });

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

  // Ülkeye özel vize linklerini fetch etme
  async function fetchVisaCountryLinks(country) {
    const { data, error } = await supabase
      .from("visa_country_links")
      .select("*")
      .eq("country", country)
      .single();

    if (error) {
      console.error("Error fetching visa country links:", error);
      return null;
    }

    return data;
  }

  const { data: firmLocation, isSuccess: isFirmLocationSuccess } = useQuery({
    queryKey: ["firmLocation", ansCountry],
    queryFn: () => fetchFirmLocation(ansCountry),
    enabled: !!ansCountry,
  });

  const { data: countryLinks } = useQuery({
    queryKey: ["visaCountryLinks", ansCountry],
    queryFn: () => fetchVisaCountryLinks(ansCountry),
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

  if (isUserSelectionsLoading || isDocumentsLoading) {
    return <Spinner />;
  }

  if (isUserSelectionsError || isDocumentsError) {
    return <div>Error loadiing data.</div>;
  }

  const handleStepClick = (step) => {
    setCurrentStep(step);
    navigate(`/summary/${applicationId}`);
  };

  const stepLabels = documents?.map((doc) => doc.docName) || [];
  const hasSponsor = userSelections?.find(
    (selection) => selection.ans_hassponsor === true
  );

  return (
    <DashboardContainer>
      {/* Randevu ve form durumuna göre banner'ları göster */}
      {isUserSelectionsSuccess && userSelections?.length > 0 && (
        <BannersContainer>
          {/* has_appointment false ise banner göster */}
          {userSelections[0].has_appointment === false && (
            <VisaStatusBanner
              type="appointment"
              applicationId={applicationId}
              userId={userId}
              countryLinks={countryLinks}
              onSuccess={() => refetchUserSelections()}
            />
          )}
          {/* has_filled_form false ise banner göster */}
          {userSelections[0].has_filled_form === false && (
            <VisaStatusBanner
              type="form"
              applicationId={applicationId}
              userId={userId}
              countryLinks={countryLinks}
              onSuccess={() => refetchUserSelections()}
            />
          )}
        </BannersContainer>
      )}

      <AnimatedFlag countryCode={countryCode} />

      <CustomRow type="horizontal">
        {createdAt && (
          <CreatedAtContainer style={{ zIndex: "3000" }}>
            <span
              role="img"
              aria-label="calendar"
              style={{
                marginRight: "6px",
                fontSize: isMobile ? "0.95rem" : "1.1rem",
              }}
            >
              📆
            </span>{" "}
            {createdAt}
          </CreatedAtContainer>
        )}
      </CustomRow>

      <DashboardItems>
        {/* Masaüstü görünümü */}
        {!isMobile && (
          <>
            <StepIndicatorWrapper>
              <Heading as="h14">Ülke adı</Heading>
              <StepIndicator
                steps={stepLabels}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                completedDocuments={completedDocuments}
                documents={documents}
              />
            </StepIndicatorWrapper>

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
          <MobileCarousel
            stepLabels={stepLabels}
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            completedDocuments={completedDocuments}
            documents={documents}
            hasSponsor={hasSponsor}
            firmLocation={firmLocation}
            isFirmLocationSuccess={isFirmLocationSuccess}
          />
        )}
      </DashboardItems>

      {isAnonymous && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: isMobile ? "-30px" : "20px",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            boxSizing: "border-box",
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

      {/* Kendi kendini kontrol eden VisaCheckModal */}
      {userId && applicationId && (
        <VisaCheckModal
          userId={userId}
          applicationId={applicationId}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;