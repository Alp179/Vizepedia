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

const StepsContainer = styled.div`
  background: rgba(255, 255, 255, 0.2);
  z-index: 3000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 16px;
  width: auto;
  margin-right: auto;
  padding: 14px;
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
  position: relative;
  margin-bottom: 100px;

  @media (max-width: 1425px) {
    margin-left: -100px;
  }
  
  @media (max-width: 710px) {
    width: 240px !important;
    overflow: visible;
    flex-flow: column;
    margin-left: -120px;
    gap: 20px;
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
    text-overflow: ellipsis!important;
  }
  @media (max-height: 830px) {
    font-size: 14px !important;
    margin-top: 0px;
  }
`;

const Bubble = styled.div`
  background-color: #e0f7fa;
  color: black;
  padding: 16px;
  border-radius: 10px;
  position: absolute;
  bottom: -110px;
  left: ${(props) => `calc(${props.leftOffset}% - 30px)`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 0;
  &:after {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 20px;
    height: 20px;
    background-color: #e0f7fa;
    border-radius: 4px;
    z-index: -1;
  }
  @media (max-width: 500px) {
    @media (max-height: 830px) {
      padding: 12px;
      font-size: 12px;
    }
  }
`;

const ContinueButton = styled.button`
  background-color: #00796b;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #004d40;
  }
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

  // Dinamik olarak Bubble'ın konumunu hesapla
  const bubbleLeftOffset = currentStep * (100 / (documents.length - 1));

  return (
    <StepsContainer>
      {documents &&
        documents.map((doc, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedDocuments[applicationId]?.[doc.docName];

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
              {index === currentStep && (
                <Bubble leftOffset={bubbleLeftOffset}>
                  <span>{doc.docName}</span>
                  <ContinueButton onClick={handleContinue}>
                    Devam et
                  </ContinueButton>
                </Bubble>
              )}
            </div>
          );
        })}
    </StepsContainer>
  );
};

export default StepIndicator;
