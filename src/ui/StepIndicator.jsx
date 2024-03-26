/* eslint-disable react/prop-types */
import { useContext } from "react";
import { DocumentsContext } from "../context/DocumentsContext";

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  const { state: completedSteps } = useContext(DocumentsContext);

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", padding: "0" }}
    >
      {steps.map((step, index) => {
        const isactive = index === currentStep;
        const isCompleted = completedSteps && completedSteps[step];

        return (
          <div
            key={step}
            onClick={() => onStepClick(index)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                lineHeight: "30px",
                border: "2px solid",
                borderColor: isactive ? "blue" : isCompleted ? "green" : "#ccc",
                borderRadius: "50%",
                textAlign: "center",
                marginBottom: "5px",
                backgroundColor: isactive
                  ? "blue"
                  : isCompleted
                  ? "green"
                  : "none",
                color: isactive || isCompleted ? "white" : "black",
              }}
            >
              {index + 1}
            </div>
            <div style={{ fontSize: "14px" }}>{step}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
