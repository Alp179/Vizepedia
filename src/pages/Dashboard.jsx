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

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { state: completedDocuments, dispatch } = useDocuments();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
        // Fetch completed documents when the user is obtained
        fetchCompletedDocuments(user.id).then((data) => {
          const completedDocs = data.reduce((acc, doc) => {
            acc[doc.document_name] = true;
            return acc;
          }, {});
          dispatch({ type: "SET_COMPLETED_DOCUMENTS", payload: completedDocs });
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
    <div>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
      </Row>
      <StepIndicator
        steps={stepLabels}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedDocuments={completedDocuments}
        documents={documentsQuery.data} // Belge detaylarını StepIndicator'a prop olarak geçir
      />
    </div>
  );
}

export default Dashboard;
