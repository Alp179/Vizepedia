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
  margin-left: 0px;
  max-width: 80%;
  display: flex;
  justify-content: space-evenly;
  position: relative;
  margin-bottom: 100px;
  @media (max-width: 1425px) {
    margin-left: 20px;
    width: 600px!important;
  }
  @media (max-width: 1270px) {
    width: 400px!important;
  }
`;

const StepCircle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 2px solid;
  border-radius: 50%;
  text-align: center;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isActive ? "blue" : props.isCompleted ? "green" : "none"};
  color: ${(props) =>
    props.isActive || props.isCompleted ? "white" : "black"};
  border-color: ${(props) =>
    props.isActive ? "blue" : props.isCompleted ? "green" : "#ccc"};
`;

const StepName = styled.div`
  font-size: 14px;
  margin-top: 5px;
  max-width: 10dvh;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width 0.6s ease;

  &:hover {
    max-width: 27dvh;
  }

  @media (max-width: 1270px) {
    max-width: 8dvh
  }
`;

const Bubble = styled.div`
  background-color: #2ecc71;
  padding: 16px;
  border-radius: 10px;
  position: absolute;
  bottom: -92px;
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
    background-color: #2ecc71;
    border-radius: 4px;
    z-index: -1;
  }
`;

const ContinueButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
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

  const [currentStep] = useState(0);

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

  if (isLoadingUserSelections || isLoadingDocuments) return <Spinner />;
  if (isErrorUserSelections || isErrorDocuments || !documents)
    return <div>Error loading data.</div>;

  const firstIncompleteIndex = documents.findIndex(
    (doc) => !completedDocuments[applicationId]?.[doc.docName]
  );

  const handleContinue = () => {
    if (!documents || documents.length === 0 || firstIncompleteIndex === -1) {
      console.error("No documents found or all documents are completed.");
      return;
    }

    const selectedDocument = documents[firstIncompleteIndex];
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
    <StepsContainer>
      {documents &&
        documents.map((doc, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedDocuments[applicationId]?.[doc.docName]; // completedDocuments kontrolü
          const bubbleLeftOffset = (index / (documents.length - 1)) * 100;

          return (
            <div
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
              {index === firstIncompleteIndex && (
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
