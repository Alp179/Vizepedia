/* eslint-disable react/prop-types */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import { DocumentsContext } from "../context/DocumentsContext";
import styled from "styled-components";

const StepsContainer = styled.div`
  margin-left: -70px;
  max-width: 80%;
  display: flex;
  justify-content: space-evenly; // Her adımın eşit aralıklı olmasını sağlar
  position: relative;
  margin-bottom: 100px; // Baloncuk için yer açıyor
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
    props.isactive ? "blue" : props.isCompleted ? "green" : "none"};
  color: ${(props) =>
    props.isactive || props.isCompleted ? "white" : "black"};
  border-color: ${(props) =>
    props.isactive ? "blue" : props.isCompleted ? "green" : "#ccc"};
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
    max-width: 27dvh; /* Hover durumunda max-width değerini arttır */
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

const StepIndicator = ({ steps, currentStep, onStepClick, documents }) => {
  const { state: completedSteps } = useContext(DocumentsContext);
  const navigate = useNavigate();
  const { setSelectedDocument } = useSelectedDocument();

  const firstIncompleteIndex = steps.findIndex((step) => !completedSteps[step]);

  const handleContinue = (event) => {
    event.stopPropagation();
    const selectedDocument = documents.find(
      (doc) => doc.docName === steps[firstIncompleteIndex]
    );

    if (selectedDocument) {
      setSelectedDocument(selectedDocument);
      navigate("/documents");
    }
  };

  return (
    <StepsContainer>
      {steps.map((step, index) => {
        const isactive = index === currentStep;
        const isCompleted = completedSteps[step];
        const bubbleLeftOffset = `${(index / (steps.length - 1)) * 100}%`;

        return (
          <div
            key={step}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StepCircle
              isactive={isactive}
              isCompleted={isCompleted}
              onClick={() => onStepClick(index)}
            >
              {index + 1}
            </StepCircle>
            <StepName title={step}>{step}</StepName>
            {index === firstIncompleteIndex && (
              <Bubble leftOffset={bubbleLeftOffset}>
                <span>{step}</span>
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
