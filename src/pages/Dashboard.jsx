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
import "flag-icons/css/flag-icons.min.css"; // CSS importu
import { fetchFirmLocation } from "../services/apiVisaApplications";

const FlagContainer = styled.div`
  position: absolute;
  top: 80%;
  right: -10%;
  transform: translateX(50%) translateY(-100%) rotate(31deg);
  width: 700px;
  height: 450px;
  z-index: 1;
  border-radius: 10%;
  overflow: hidden;


  @media (min-width: 1870px) {
    right: -10%!important;
  }

  @media (min-width: 1970px) {
    right: -15%!important;
  }

  @media (min-width: 2030px) {
    right: -20%!important;
  }

  @media (min-width: 2130px) {
    right: -30%!important;
  }

  @media (min-width: 2270px) {
    right: -40%!important;
  }

  @media (min-width: 2400px) {
    right: -50%!important;
  }

  @media (min-width: 2530px) {
    right: -60%!important;
  }

  @media (min-width: 2650px) {
    right: -70%!important;
  }

  @media (min-width: 2800px) {
    right: -85%!important;
  }

  @media (min-width: 2950px) {
    right: -100%!important;
  }

  @media (min-width: 3100px) {
    right: -115%!important;
  }

  @media (min-width: 3250px) {
    right: -130%!important;
  }

  @media (min-width: 1625px) {
    top: 30%;
    right: -5%;
  }

  @media (max-width: 1625px) {
    top: 30%;
    right: 5%;
  }

  @media (max-width: 1450px) {
    top: 30%;
    right: 5%;
  }

  @media (max-width: 1400px) {
    width: 600px!important;
    height: 350px!important;
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

  & > span {
    width: 100%;
    height: 100%;
    display: block;
    background-size: cover;
    background-position: center;
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

  z-index: 0; /* Updated to ensure it's in the background */
  
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

const CreatedAtContainer = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-700);
  margin-top: -80px;
  position: absolute;
  @media (max-width: 1425px) {
    margin-left: -100px;
  }
`;

const CustomRow = styled(Row)`
  position: relative;
  margin-top: 30px;
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

  const { data: firmLocation, isSuccess: isFirmLocationSuccess } = useQuery({
    queryKey: ["firmLocation", ansCountry],
    queryFn: () => fetchFirmLocation(ansCountry),
    enabled: !!ansCountry,
  });

  useEffect(() => {
    if (isUserSelectionsSuccess && userSelections) {
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
          <CreatedAtContainer style={{zIndex: "3000"}}>
            Oluşturulma tarihi: {createdAt}
          </CreatedAtContainer>
        )}
        <Heading style={{zIndex: "3000"}} as="h1">Hoş geldin Loko</Heading>
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
        <div style={{zIndex: "2000"}} dangerouslySetInnerHTML={{ __html: firmLocation.firmAdress }} />
      )}
    </div>
  );
}

export default Dashboard;
