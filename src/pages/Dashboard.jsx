import { useEffect, useState } from "react";
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
import styled, { keyframes } from "styled-components";
import "flag-icons/css/flag-icons.min.css";
import supabase from "../services/supabase";
import SignupForm from "../features/authentication/SignupForm";
import ModalSignup from "../ui/ModalSignup";
import SponsorStepIndicator from "../ui/SponsorStepIndicator";


const DashboardContainer = styled.div`
  position: relative;
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 50px;
  @media (max-width: 710px) {
    height: 100%;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    flex-flow: column;
    justify-content: flex-start;
  }
`;

const FlagContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 700px;
  height: 450px;
  transform: translate(23%, -20%) rotate(31deg);
  border-radius: 10%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;

  & > span {
    width: 100%;
    height: 100%;
    display: block;
    background-size: cover;
    background-position: center;
  }

  @media (max-width: 1450px) {
    width: 600px;
    height: 360px;
  }

  @media (max-width: 1200px) {
    width: 500px;
    height: 300px;
  }

  @media (max-width: 900px) {
    width: 400px;
    height: 240px;
  }

  @media (max-width: 450px) {
    width: 300px;
    height: 180px;
  }

  @media (max-width: 375px) {
    width: 250px;
    height: 150px;
  }
`;

// Sürekli ve kesintisiz yukarıdan aşağıya akan animasyon
const moveFlagAnimation = keyframes`
  0% {
    transform: translateY(-55%) rotate(31deg);
  }
  10% {
    transform: translateY(-40%) rotate(31deg);
  }
  20% {
    transform: translateY(-30%) rotate(31deg);
  }
   30% {
    transform: translateY(-20%) rotate(31deg);
  }
  40% {
    transform: translateY(-10%) rotate(31deg);
  }
  50% {
    transform: translateY(-0%) rotate(31deg);
  }
    60% {
    transform: translateY(-10%) rotate(31deg);
  }
  70% {
    transform: translateY(-20%) rotate(31deg);
  }
  80% {
    transform: translateY(-30%) rotate(31deg);
  }
   90% {
    transform: translateY(-40%) rotate(31deg);
  }
  100% {
    transform: translateY(-55%) rotate(31deg);
  }
  
`;

const BlurredFlagBackground = styled.div`
  position: fixed;
  top: -10%;
  right: -10%;
  width: 1000px; // %50 daralma
  height: 642px; // %50 daralma
  filter: blur(150px);
  z-index: 0;
  animation: ${moveFlagAnimation} 14s linear infinite; // Akış alanı daraltıldı ve süre ayarlandı

  @media (max-width: 1450px) {
    width: 800px;
    height: 514px;
  }

  @media (max-width: 1200px) {
    width: 600px;
    height: 385px;
  }

  @media (max-width: 450px) {
    width: 400px !important;
    right: -20%;
    height: 400px !important;
  }
`;

const CreatedAtContainer = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-700);
  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  @media (max-width: 710px) {
    margin-left: 0;
    margin-top: 40px;
    mix-blend-mode: difference;
    width: 200px;
    @media (max-height: 830px) {
      font-size: 1.3rem;
    }
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
      margin-bottom: -30px;
      gap: 8px;
    }
    width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  @media (max-width: 520px) {
    width: 80%;
  }
  @media (max-width: 350px) {
    width: 95%;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (min-width: 1285px) {
    width: 1000px;
  }
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  gap: 32px;
  z-index: 3000;
  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  @media (max-width: 1350px) {
    flex-flow: column;
    gap: 22px;
    width: 500px;
    padding-bottom: 20px;
  }
  @media (max-width: 760px) {
    width: 400px;
  }
  @media (max-width: 710px) {
    margin-bottom: -125px;
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
  }
  @media (max-width: 520px) {
    width: 80%;
  }
  @media (max-width: 350px) {
    width: 95%;
  }
`;

const MapContainer = styled.div`
  height: auto;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 10px;
  @media (max-width: 1350px) {
    width: 420px;
    height: 420px;
  }
  @media (max-width: 760px) {
    width: 350px;
    height: 350px;
  }
  @media (max-width: 500px) {
    width: 280px;
    height: 280px;
  }
  @media (max-width: 389px) {
    height: 230px;
    width: 230px;
  }
`;

const InfoDetails = styled.div`
  flex: 1;
  color: var(--color-grey-800);
  display: flex;
  z-index: 3000;
  flex-direction: column;
  gap: 10px;
`;

const Ceper = styled.div`
  position: absolute;
  left: 20vw;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 283px;
  height: 127px;
  border: 3px solid #00ffa2;
  filter: drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.11));
  border-radius: 82px;
  @media (max-width: 1300px) {
    left: 15%;
  }
  @media (max-width: 1000px) {
    left: 10%;
  }
  @media (max-width: 875px) {
    left: 0%;
  }
  @media (max-width: 710px) {
    position: relative;
    margin-bottom: 70px;
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
  width: 100%;
`;

const InfoContainerWrapper = styled.div`
  width: 100%;
  margin-top: 100px; /* StepIndicator ile araya boşluk ekliyoruz */
  @media (max-width: 710px) {
    margin-top: 0; /* Küçük ekranlarda aralığı sıfırlıyoruz */
  }
`;

const Dashboard = () => {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [createdAt, setCreatedAt] = useState(null);
  const navigate = useNavigate();
  const {
    state: { completedDocuments },
    dispatch,
  } = useDocuments();
  const [countryCode, setCountryCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(
    localStorage.getItem("isAnonymous") === "true"
  );

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);

        // Kullanıcı üye olmuşsa, anonim verileri temizleyin
        if (!isAnonymous) {
          localStorage.removeItem("isAnonymous");
          localStorage.removeItem("userAnswers");
          localStorage.removeItem("userSelections");
        }

        // Kullanıcı verilerini Supabase'den çek
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

  // Anonim kullanıcıdan normal kullanıcıya geçişte local storage ile bağı koparma
  const handleUserConversion = () => {
    // Üye olduktan sonra yerel depolama temizlenmiş oluyor
    setIsAnonymous(false);
    // Üye olan kullanıcıları dashboard'a yönlendiriyoruz
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
    if (isUserSelectionsSuccess && userSelections) {
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

      const createdAtDate = new Date(userSelections?.[0]?.created_at);
      setCreatedAt(createdAtDate.toLocaleDateString());
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

  return (
    <DashboardContainer>
      {countryCode && (
        <BlurredFlagBackground
          style={{
            backgroundImage: `url(https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg)`,
          }}
        />
      )}
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
      <StepIndicatorWrapper>
        <Heading as="h3" style={{ marginBottom: "16px", zIndex: "3000" }}>
          Başvuru Sahibinin Belgeleri
        </Heading>
        <StepIndicator
          steps={stepLabels}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          completedDocuments={completedDocuments}
          documents={documents}
        />
      </StepIndicatorWrapper>

      <StepIndicatorWrapper>
        <Heading as="h3" style={{ marginBottom: "16px", zIndex: "3000" }}>
          Sponsorun Belgeleri
        </Heading>
        <SponsorStepIndicator
          steps={stepLabels}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          completedDocuments={completedDocuments}
          documents={documents}
        />
      </StepIndicatorWrapper>
      {countryCode && (
        <FlagContainer>
          <span className={`fi fi-${countryCode}`}></span>
        </FlagContainer>
      )}
      <InfoContainerWrapper>
        {isFirmLocationSuccess && firmLocation && (
          <InfoContainer>
            <MapContainer
              dangerouslySetInnerHTML={{ __html: firmLocation.firmAdress }}
            />
            <InfoDetails>
              <div>
                <strong>Firma Adı: </strong>
                {firmLocation.firm_name}
              </div>
              <div>
                <strong>Vize Ücreti: </strong>
                {firmLocation.visa_fee} €
              </div>
              <div>
                <strong>Servis Ücreti: </strong>
                {firmLocation.service_fee} €
              </div>
              <div>
                <strong>Ofis Saatleri: </strong>
                {firmLocation.office_hours}
              </div>
              <div>
                <a
                  href={firmLocation.firm_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  İstanbul harici başvuru merkezleri için tıklayın
                </a>
              </div>
            </InfoDetails>
          </InfoContainer>
        )}
      </InfoContainerWrapper>

      {/* Anonim kullanıcıysa Üye Olarak Devam Et butonunu göster */}
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
              {/* Üye olduktan sonra verileri Supabase'den çekebilmek için, kullanıcıyı signUpForm ile yönlendirme işlemi */}
              <SignupForm onSuccess={handleUserConversion} />
            </ModalSignup.Window>
          </ModalSignup>
        </div>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
