// Dashboard.jsx
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelections } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import StepIndicator from "../ui/StepIndicator";
import { useNavigate } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { setSelectedDocument } = useSelectedDocument();

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const {
    data: userSelections,
    isLoading: isLoadingSelections,
    isError: isErrorSelections,
  } = useQuery({
    queryKey: ["userSelections", userId],
    queryFn: () => fetchUserSelections(userId),
    enabled: !!userId,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];
  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  if (isLoadingSelections || isLoadingDocuments) {
    return <Spinner />;
  }

  if (isErrorSelections || isErrorDocuments) {
    return <div>Error loading data.</div>;
  }

  const handleStepClick = (step) => {
    setCurrentStep(step);
    const selectedDoc = documents[step];
    setSelectedDocument(selectedDoc);
    navigate("/summary");
  };

  const stepLabels = documents?.map((doc) => doc.docName) || [];

  return (
    <div>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
      </Row>
      <StepIndicator
        steps={stepLabels}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
      {/* StepIndicator'dan sonra gelen içerikler burada yer alacak. */}
    </div>
  );
}

export default Dashboard;
