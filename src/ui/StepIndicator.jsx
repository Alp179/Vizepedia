/* eslint-disable react/prop-types */
import styled from "styled-components";

const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0;
`;

const StepNumber = styled.div.attrs((props) => ({
  "data-active": props.isactive.toString(),
  "data-completed": props.iscompleted.toString(),
}))`
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 2px solid #ccc;
  border-radius: 50%;
  text-align: center;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isactive ? "blue" : props.iscompleted ? "green" : "none"};
  color: ${(props) =>
    props.isactive || props.iscompleted ? "white" : "black"};
  border-color: ${(props) =>
    props.isactive ? "blue" : props.iscompleted ? "green" : "#ccc"};
`;

const Step = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isactive", "iscompleted"].includes(prop),
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer; /* Tıklanabilir olduğunu göstermek için eklenen cursor özelliği */
  &:hover {
    /* Mouse üzerine geldiğinde */
    ${StepNumber} {
      border-color: blue; /* Aktif durumun rengi */
      background-color: rgba(0, 0, 255, 0.2); /* Hafif saydam mavi arkaplan */
    }
  }
`;

const StepTitle = styled.div`
  font-size: 14px;
`;

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <StepIndicatorContainer>
      {steps.map((step, index) => {
        const isactive = index === currentStep;
        const iscompleted = index < currentStep;

        return (
          <Step key={step} onClick={() => onStepClick(index)}>
            <StepNumber isactive={isactive} iscompleted={iscompleted}>
              {index + 1}
            </StepNumber>
            <StepTitle>{step}</StepTitle>
          </Step>
        );
      })}
    </StepIndicatorContainer>
  );
};

export default StepIndicator;
