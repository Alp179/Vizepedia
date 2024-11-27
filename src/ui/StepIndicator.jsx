/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedDocument } from "../context/SelectedDocumentContext";
import styled, { keyframes } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "./Spinner";
import { getCurrentUser } from "../services/apiAuth";
import { DocumentsContext } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const StepAndContinueContainer = styled.div`
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: fit-content;
  padding: 8px;
  align-items: center;
  display: flex;
  gap: 16px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 3000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 16px;
  margin-bottom: 20px;
  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  @media (max-width: 1400px) {
    padding: 6px;
  }
  @media (max-width: 710px) {
    margin-left: auto;
    margin-right: auto;
    gap: 12px;
    flex-flow: column;
    width: 400px;
    padding: 12px;
    justify-content: flex-start;
    align-items: flex-start;
    padding-bottom: 16px;
  }
  @media (max-width: 520px) {
    width: 80%;
  }
  @media (max-width: 350px) {
    width: 95%;
  }
`;

const StepCircleContainer = styled.div`
  display: flex;
  gap: 10px;
  height: 40px;
  @media (max-width: 1400px) {
    gap: 6px;
    height: 40px;
  }
  @media (max-width: 710px) {
    height: 100%;
    flex-flow: column;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid;
  border-radius: 50%;
  position: relative;
  transition: border-color 0.3s ease;
  background-color: ${(props) =>
    props.isActive ? "#3498db" : props.isCompleted ? "#2ecc71" : "white"};
  color: ${(props) =>
    props.isActive || props.isCompleted ? "white" : "black"};
  border-color: ${(props) =>
    props.isActive ? "#3498db" : props.isCompleted ? "#2ecc71" : "#ccc"};
  width: 40px; /* Varsayılan genişlik */
  height: 40px; /* Varsayılan yükseklik */

  @media (max-width: 710px) {
    width: 40px; /* 710px altında sabit genişlik */
    height: 40px; /* 710px altında sabit yükseklik */
    flex-shrink: 0; /* Küçülmeyi tamamen engelle */
  }
`;


const TooltipContainer = styled(motion.div)`
  position: absolute;
  top: -35px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
`;

const glowing = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
`;

const StepPageCont = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;
  justify-content: flex-start;
`;

const ContinueButton = styled.button`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: bold;
  height: 50px;
  margin-right: 8px;
  width: 100px;
  color: var(--color-grey-913);
  background: var(--color-grey-914);
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;

  &:before {
    content: "";
    background: linear-gradient(
      -45deg,
      #004466,
      #004466,
      #87f9cd,
      #87f9cd,
      #87f9cd,
      #004466,
      #004466
    );
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    animation: ${glowing} 20s linear infinite;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    border-radius: 10px;
  }

  &:after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--color-grey-914);
    left: 0;
    top: 0;
    border-radius: 10px;
  }

  &:hover {
    color: #004466;
  }

  &:hover:after {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    color: #000;
  }

  &:active:after {
    background: transparent;
  }

  @media (max-width: 830px) {
    height: 50px;
  }

  @media (max-width: 710px) {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    @media (max-height: 830px) {
      width: 40%;
      height: 42px;
      font-size: 13px;
    }
  }

  z-index: 4000;
`;

const StepLabel = styled.span`
  font-size: 14px;
  cursor: pointer;
  color: ${(props) => (props.isCompleted ? "#2ecc71" : "#ccc")};
  margin-left: 8px;
  @media (max-width: 710px) {
    font-size: 16px;
  }
`;

const IconContainer = ({
  isActive,
  isCompleted,
  onClick,
  title,
  mouseX,
  stepNumber,
  isExtraSmallScreen,
}) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [baseSize, setBaseSize] = useState(40);

  // Transform ve spring işlemleri koşulsuz olarak tanımlandı.
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const size = useSpring(
    useTransform(distance, [-150, 0, 150], [baseSize, baseSize * 2, baseSize]),
    {
      mass: 0.1,
      stiffness: 150,
      damping: 12,
    }
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 710) {
        setBaseSize(40);
      } else if (window.innerWidth <= 1200) {
        setBaseSize(30);
      } else if (window.innerWidth <= 1400) {
        setBaseSize(35);
      } else {
        setBaseSize(40);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isExtraSmallScreen) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconWrapper
          onClick={onClick}
          isActive={isActive}
          isCompleted={isCompleted}
        >
          <div>{stepNumber}</div>
        </IconWrapper>
        <StepLabel onClick={onClick} isCompleted={isCompleted}>
          {title}
        </StepLabel>
      </div>
    );
  }

  return (
    <IconWrapper
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        backgroundColor: isActive
          ? "#3498db"
          : isCompleted
          ? "#2ecc71"
          : "white",
      }}
    >
      <div>{stepNumber}</div>
      <AnimatePresence>
        {hovered && (
          <TooltipContainer
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {title}
          </TooltipContainer>
        )}
      </AnimatePresence>
    </IconWrapper>
  );
};


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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isExtraSmallScreen = screenWidth < 710;
  const mouseXContainer1 = useMotionValue(Infinity);
  const mouseXContainer2 = useMotionValue(Infinity);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // İlk yüklemede ekran genişliğini kontrol et
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
        fetchCompletedDocuments(user.id, applicationId).then((data) => {
          const completedDocsMap = data.reduce((acc, doc) => {
            if (!acc[applicationId]) acc[applicationId] = {};
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
    if (!documents || documents.length === 0 || currentStep === -1) return;
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

  const firstSteps = documents.slice(0, 10);
  const remainingSteps = documents.slice(10);

  const isSmallScreen = screenWidth < 1450;


  return (
    <StepPageCont>
      {isExtraSmallScreen || !isSmallScreen ? (
        <StepAndContinueContainer
          onMouseMove={(e) => mouseXContainer1.set(e.pageX)}
          onMouseLeave={() => mouseXContainer1.set(Infinity)}
        >
          <StepCircleContainer>
            {documents.map((doc, index) => {
              const isActive = index === currentStep;
              const isCompleted =
                completedDocuments[applicationId]?.[doc.docName];

              return (
                <IconContainer
                isExtraSmallScreen={isExtraSmallScreen}
                  key={doc.id}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onClick={() => handleStepClick(index)}
                  title={doc.docName}
                  mouseX={mouseXContainer1}
                  stepNumber={index + 1}
                />
              );
            })}
          </StepCircleContainer>
          <ContinueButton onClick={handleContinue}>Devam et</ContinueButton>
        </StepAndContinueContainer>
      ) : (
        <>
          <StepAndContinueContainer
            onMouseMove={(e) => mouseXContainer1.set(e.pageX)}
            onMouseLeave={() => mouseXContainer1.set(Infinity)}
          >
            <StepCircleContainer>
              {firstSteps.map((doc, index) => {
                const isActive = index === currentStep;
                const isCompleted =
                  completedDocuments[applicationId]?.[doc.docName];

                return (
                  <IconContainer
                    key={doc.id}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    onClick={() => handleStepClick(index)}
                    title={doc.docName}
                    mouseX={mouseXContainer1}
                    stepNumber={index + 1}
                  />
                );
              })}
            </StepCircleContainer>
            <ContinueButton onClick={handleContinue}>Devam et</ContinueButton>
          </StepAndContinueContainer>
          {remainingSteps.length > 0 && (
            <StepAndContinueContainer
              onMouseMove={(e) => mouseXContainer2.set(e.pageX)}
              onMouseLeave={() => mouseXContainer2.set(Infinity)}
            >
              <StepCircleContainer>
                {remainingSteps.map((doc, index) => {
                  const isActive = index + 10 === currentStep;
                  const isCompleted =
                    completedDocuments[applicationId]?.[doc.docName];

                  return (
                    <IconContainer
                      key={doc.id}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      onClick={() => handleStepClick(index + 10)}
                      title={doc.docName}
                      mouseX={mouseXContainer2}
                      stepNumber={index + 11}
                    />
                  );
                })}
              </StepCircleContainer>
            </StepAndContinueContainer>
          )}
        </>
      )}
    </StepPageCont>
  );
};

export default StepIndicator;
