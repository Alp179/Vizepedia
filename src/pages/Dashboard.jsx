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

const FlagContainer = styled.div`
  position: absolute;
  top: 80%;
  right: -10%;
  transform: translateX(50%) translateY(-100%) rotate(31deg);
  width: 35vw;
  height: 20vw;
  z-index: 1000;
  border-radius: 10%;
  overflow: hidden;

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
    width: 300px!important;
    height: 170px!important;
    top: 5%;
  }
  @media (max-width: 530px) {
    top: 10%;
    right: -30%;
  }
  @media (max-width: 480px) {
    right: -50%;
  }
  @media (max-width: 450px) {
    width: 240px!important;
    height: 140px!important;
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

function Dashboard() {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
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

  const userSelectionsQuery = useQuery({
    queryKey: ["userSelections", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  useEffect(() => {
    if (userSelectionsQuery.data) {
      const ansCountry = userSelectionsQuery.data?.[0]?.ans_country;
      setCountryCode(countryToCode[ansCountry] || "");
    }
  }, [userSelectionsQuery.data]);

  const documentNames = userSelectionsQuery.data
    ? getDocumentsForSelections(userSelectionsQuery.data)
    : [];

  const documentsQuery = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  if (userSelectionsQuery.isLoading || documentsQuery.isLoading) {
    return <Spinner />;
  }

  if (userSelectionsQuery.isError || documentsQuery.isError) {
    return <div>Error loading data.</div>;
  }

  const handleStepClick = (step) => {
    setCurrentStep(step);
    navigate(`/summary/${applicationId}`);
  };

  const stepLabels = documentsQuery.data?.map((doc) => doc.docName) || [];

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
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
      </Row>
      <StepIndicator
        steps={stepLabels}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedDocuments={completedDocuments}
        documents={documentsQuery.data}
      />
      {countryCode && (
        <FlagContainer>
          <span className={`fi fi-${countryCode}`}></span>
        </FlagContainer>
      )}
    </div>
  );
}

export default Dashboard;
