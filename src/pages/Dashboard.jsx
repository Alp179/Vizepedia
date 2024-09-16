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
import styled from "styled-components";
import "flag-icons/css/flag-icons.min.css";
import supabase from "../services/supabase";

const FlagContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 700px;
  height: 450px;
  transform: translate(23%, -20%) rotate(31deg);
  border-radius: 10%;
  overflow: hidden;
  z-index: 1000;
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

const BlurredFlagBackground = styled.div`
  position: absolute;
  top: 60%;
  left: -40%;
  width: 80vw;
  height: 60vw;
  transform: translateX(40%) translateY(-110%) rotate(31deg);
  filter: blur(190px);
  z-index: 0;

  @media (max-width: 1625px) {
    top: 60%;
  }

  @media (max-width: 1450px) {
    top: 50%;
  }

  @media (max-width: 1150px) {
    top: 30%;
  }

  @media (max-width: 990px) {
    top: 20%;
  }

  @media (max-width: 890px) {
    top: 10%;
  }
  @media (max-width: 820px) {
    right: -20%;
  }
  @media (max-width: 710px) {
    width: 300px !important;
    height: 170px !important;
    top: 11%;
  }
  @media (max-width: 530px) {
    top: 10%;
    right: -30%;
  }
  @media (max-width: 480px) {
    right: -50%;
  }
  @media (max-width: 450px) {
    width: 240px !important;
    height: 140px !important;
    right: -70%;
    top: 8%;
    @media (max-height: 700px) {
      right: -90%;
      top: 10%;
    }
  }
`;

const CreatedAtContainer = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-700);
  @media (max-width: 1425px) {
    margin-left: -100px;
  }
  @media (max-width: 710px) {
    mix-blend-mode: difference;
    width: 200px;
    @media (max-height: 830px) {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 360px) {
    margin-left: -120px;
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
  }
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  gap: 32px;
  z-index: 1000;
  @media (max-width: 1425px) {
    margin-left: -100px;
  }
  @media (max-width: 1285px) {
    flex-flow: column;
    gap: 22px;
    width: 500px;
    padding-bottom: 20px;
  }
  @media (max-width: 760px) {
    width: 400px;
  }
  @media (max-width: 500px) {
    width: 300px;
  }
  @media (max-width: 389px) {
    width: 250px;
  }
  @media (max-width: 360px) {
    margin-left: -130px;
  }
`;

const MapContainer = styled.div`
  height: auto;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 10px;
  @media (max-width: 1285px) {
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
  flex-direction: column;
  gap: 10px;
`;

function Dashboard() {
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

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
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
  }, [applicationId, dispatch]);

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
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}
    >
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
          Hoş geldin Loko
        </Heading>
      </CustomRow>
      <StepIndicator
        steps={stepLabels}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedDocuments={completedDocuments}
        documents={documents}
      />
      {countryCode && (
        <FlagContainer>
          <span className={`fi fi-${countryCode}`}></span>
        </FlagContainer>
      )}
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
    </div>
  );
}

export default Dashboard;
