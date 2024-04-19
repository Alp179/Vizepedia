import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/apiAuth";
import { fetchUserSelections } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import StepIndicator from "../ui/StepIndicator";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import styled from "styled-components";
import "flag-icons/css/flag-icons.min.css"; // CSS importu

const FlagContainer = styled.div`
  position: absolute;
  top: 80%; // Orta yukarıda konumlanacak şekilde ayarla
  right: -10%; // Sağ üst köşede
  transform: translateX(50%) translateY(-100%) rotate(31deg); // Bayrağı döndür ve konumlandır
  width: 35vw; // Genişlik ekran genişliğinin bir yüzdesi olarak
  height: 20vw; // Yükseklik ekran genişliğinin bir yüzdesi olarak
  z-index: 1000; // Diğer elementlerin üzerinde olmasını sağlar
  overflow: hidden; // Bayrağın konteynere taşmasını engeller
  border-radius: 10%; // Köşeleri yuvarlak yapar

  & > span {
    width: 100%;
    height: 100%;
    display: block;
    background-size: cover; // Bayrağın konteynere sığmasını sağlar
    background-position: center; // Bayrağın ortalanmasını sağlar
  }

  // Küçük ekranlar için medya sorguları
  @media (max-width: 768px) {
    width: 50vw; // Daha küçük ekranlarda genişliği artır
    height: 30vw; // Daha küçük ekranlarda yüksekliği artır
    transform: translateX(20%) translateY(-50%) rotate(31deg); // Konumu ayarla
  }

  // Daha da küçük ekranlar için medya sorguları
  @media (max-width: 480px) {
    width: 60vw;
    height: 40vw;
    transform: translateX(10%) translateY(-50%) rotate(31deg); // Daha fazla ayarla
  }
`;

// Dashboard bileşeninizi

// Ülke adlarını ISO kodlarına çeviren harita
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
  Hırvatistan: "hr", // Hırvatistan eklendi.
};

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { state: completedDocuments, dispatch } = useDocuments();
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
        fetchCompletedDocuments(user.id).then((data) => {
          const completedDocs = data.reduce((acc, doc) => {
            acc[doc.document_name] = true;
            return acc;
          }, {});
          dispatch({ type: "SET_COMPLETED_DOCUMENTS", payload: completedDocs });
          fetchUserSelections(user.id).then((selections) => {
            const ansCountry = selections?.ans_country; // Doğrudan objeden ans_country çekiliyor
            setCountryCode(countryToCode[ansCountry] || "");
          });
        });
      }
    });
  }, [dispatch]);

  const userSelectionsQuery = useQuery({
    queryKey: ["userSelections", userId],
    queryFn: () => fetchUserSelections(userId),
    enabled: !!userId,
  });

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
    navigate("/summary");
  };

  const stepLabels = documentsQuery.data?.map((doc) => doc.docName) || [];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%"}}>
      {" "}
      {/* Relative position for the flag */}{" "}
      {/* Relative position for the flag */}
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
