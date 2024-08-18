/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "./Spinner";
import { getCurrentUser } from "../services/apiAuth";
import { DocumentsContext } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";

const StepAndContinueContainer = styled.div`
  max-width: 740px;
  align-items: center;
  display: flex;
  gap: 16px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 3000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 16px;
  @media (max-width: 1425px) {
    margin-left: -100px;
  }
  @media (max-width: 1050px) {
    max-width: 500px !important;
  }
  @media (max-width: 710px) {
    gap: 8px;
    flex-flow: column;
    width: 250px;
    justify-content: flex-start;
    align-item: flex-start;
    padding-bottom: 16px;
  }
  @media (max-width: 360px) {
    margin-left: -130px;
  }
`;

const StepsContainer = styled.div`
  width: 600px;
  overflow-x: auto; /* Yatay kaydırma */
  padding: 14px;
  position: relative;
  @media (max-width: 1050px) {
    width: 370px;
  }
  @media (max-width: 710px) {
    overflow: visible;
    margin-right: auto;
    flex-flow: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  &::-webkit-scrollbar {
    border-radius: 16px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 16px;
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
`;

const StepCircleContainer = styled.div`
  display: flex;
  gap: 10px; /* Circle'lar arasındaki boşluk */
  @media (max-width: 710px) {
    flex-flow: column;
    gap: 12px;
  }
`;

const StepCircle = styled.div`
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 35px;
  height: 35px;
  line-height: 35px;
  flex-shrink: 0;
  border: 2px solid;
  border-radius: 50%;
  text-align: center;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isActive ? "#3498db" : props.isCompleted ? "#2ecc71" : "white"};
  color: ${(props) =>
    props.isActive || props.isCompleted ? "white" : "black"};
  border-color: ${(props) =>
    props.isActive ? "#3498db" : props.isCompleted ? "#2ecc71" : "#ccc"};
  @media (max-height: 830px) {
    width: 25px;
    height: 25px;
    font-size: 14px;
    justify-content: center;
    align-items: center;
  }
`;

const StepName = styled.div`
  z-index: 3000;
  font-size: 14px;
  margin-top: 5px;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width 0.6s ease;

  &:hover {
    max-width: 160px;
  }

  @media (max-width: 1270px) {
    max-width: 70px;
  }
  @media (max-width: 990px) {
    max-width: 60px;
  }
  @media (max-width: 820px) {
    max-width: 50px;
  }
  @media (max-width: 710px) {
    &:hover {
      max-width: 200px;
    }
    max-width: 150px;
    font-size: 18px;
    text-overflow: ellipsis !important;
  }
  @media (max-height: 830px) {
    font-size: 14px !important;
    margin-top: 0px;
  }
`;

const ContinueButton = styled.button`
  flex-shrink: 0;
  height: 50px;
  background-color: #004466;
  font-size: 14px;
  color: #00ffa2;
  font-weight: bold;
  border: 4px solid #87f9cd;
  margin-right: 8px;
  width: 100px;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background-color: #87f9cd;
    color: #004466;
  }

  @media (max-width: 830px) {
    height: 50px;
  }
  @media (max-width: 710px) {
    width: 60%;
    @media (max-height: 830px) {
      width: 40%;
      height: 42px;
      font-size: 13px;
    }
  }

  z-index: 4000; /* Butonun her zaman üstte olmasını sağlar */
`;

const StepIndicator = () => {
  const [userId, setUserId] = useState(null);
  const { id: applicationId } = useParams();
  const navigate = useNavigate();
  const { setSelectedDocument } = useSelectedDocument();

  const {
    state: { completedDocuments },
    dispatch,
  } = useContext(DocumentsContext);

  const [currentStep, setCurrentStep] = useState(null);

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
    isLoading: isLoadingUserSelections,
    isError: isErrorUserSelections,
  } = useQuery({
    queryKey: ["userSelectionsStep", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery({
    queryKey: ["documentDetailsStep", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
  });

  useEffect(() => {
    if (documents && documents.length > 0) {
      const firstIncompleteIndex = documents.findIndex(
        (doc) => !completedDocuments[applicationId]?.[doc.docName]
      );
      setCurrentStep(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
    }
  }, [documents, completedDocuments, applicationId]);

  if (isLoadingUserSelections || isLoadingDocuments) return <Spinner />;
  if (isErrorUserSelections || isErrorDocuments || !documents)
    return <div>Error loading data.</div>;

  const handleContinue = () => {
    if (!documents || documents.length === 0 || currentStep === -1) {
      console.error("No documents found or all documents are completed.");
      return;
    }

    const selectedDocument = documents[currentStep];
    if (selectedDocument) {
      setSelectedDocument(selectedDocument);
      navigate(`/documents/${applicationId}`);
    }
  };

  const handleStepClick = (index) => {
    const selectedDocument = documents[index];
    setSelectedDocument(selectedDocument);
    navigate(`/summary/${applicationId}`);
  };

  return (
    <>
      <StepAndContinueContainer>
        <StepsContainer>
          <StepCircleContainer>
            {documents &&
              documents.map((doc, index) => {
                const isActive = index === currentStep;
                const isCompleted =
                  completedDocuments[applicationId]?.[doc.docName];

                return (
                  <div
                    className="stepsAndNames"
                    key={doc.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <StepCircle
                      isActive={isActive}
                      isCompleted={isCompleted}
                      onClick={() => handleStepClick(index)}
                    >
                      {index + 1}
                    </StepCircle>
                    <StepName title={doc.docName}>{doc.docName}</StepName>
                  </div>
                );
              })}
          </StepCircleContainer>
        </StepsContainer>
        <ContinueButton onClick={handleContinue}>Devam et</ContinueButton>
      </StepAndContinueContainer>
    </>
  );
};

export default StepIndicator;
