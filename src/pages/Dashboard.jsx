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
import SponsorStepIndicator from "../ui/SponsorStepIndicator";
import FirmMap from "../ui/FirmMap";
import AnimatedFlag from "../ui/AnimatedFlag";
import MobileCarousel from "../ui/MobileCarousel";

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
  position: relative;
  z-index: 10;

  @media (max-width: 710px) {
    @media (max-height: 830px) {
      gap: 8px;
    }
    width: 90%;
    margin: 30px auto 0;
    padding: 0 15px;
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
  margin-top: 30px;
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

  @media (max-width: 1300px) {
    margin-left: 12vw;
  }

  @media (max-width: 900px) {
    margin-left: 1vw;
  }

  @media (max-width: 710px) {
    position: relative;
    margin: 30px auto;
    transform: scale(0.9);
  }
  &:hover {
    border-color: #004466;
    transform: scale(1.03);

    @media (max-width: 710px) {
      transform: scale(0.95);
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
  position: relative;
  z-index: 10;

  @media (max-width: 710px) {
    position: relative;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 10px 0 30px;
    margin-top: 20px;
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
  const hasSponsor = userSelections?.find(
    (selection) => selection.ans_hassponsor === true
  );

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
