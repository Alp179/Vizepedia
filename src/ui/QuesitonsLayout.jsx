import styled, { keyframes } from "styled-components";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import BackButton from "./BackButton";
import ProgressBar from "@ramonak/react-progress-bar";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 7rem;
  background: var(--color-grey-1);
  overflow: hidden; /* Yeni eklenen satır */
`;

const Container = styled.div`
  width: 60%;
  margin: 0 auto;
  @media (max-width: 710px) {
    margin-top: -50px;
    width: 90%;
  }
`;

const ProgressBarContainer = styled.div`
  width: 80%; /* Progress bar uzunluğunu %20 kısalttık */
  padding: 1rem;
  margin: 0 auto;

  position: relative;

  @media (max-width: 710px) {
    width: 95%;
    margin-top: 50px;
  }
  @media (max-width: 450px) {
    margin-top: 0;
  }
`;

const ProgressBarWrapper = styled.div`
  position: relative;
`;

const StyledProgressBar = styled(ProgressBar)`
  border-radius: 50px; /* Köşeleri yuvarlatmak için */
`;

const progressAnimation = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

const ProgressBarReflection = styled.div`
  position: absolute;
  top: 5px; /* Çizginin barın üstünde konumlanmasını sağlar (2px + 4px) */
  left: 10px; /* Soldan içeri girme miktarı */
  height: 6px; /* Çizginin kalınlığı */
  border-radius: 50px;
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* Yansıma efekti için açık renk */
  z-index: 1; /* Çizginin barın üstünde yer almasını sağlar */
  transition: width 1s ease-in-out;
  animation: ${progressAnimation} 1s ease-in-out;
`;

const MobileMenuWrapper = styled.div`
  @media (min-width: 711px) {
    display: none;
  }
`;

function QuestionsLayout() {
  const location = useLocation();
  const progressValues = {
    "/wellcome": 0,
    "/wellcome-1": 20,
    "/wellcome-2": 20,
    "/wellcome-3": 40,
    "/wellcome-4": 60,
    "/wellcome-5": 90,
  };

  const progress = progressValues[location.pathname] || 0;

  return (
    <LoginLayout>
      <BackButton>Geri Dön</BackButton>
      <MobileMenuWrapper>
        <MobileMenu />
      </MobileMenuWrapper>
      <Header />
      <div className="question-progressAndContent-container">
        <ProgressBarContainer>
          <ProgressBarWrapper>
            <StyledProgressBar
              completed={progress}
              bgColor="#00FFA2"
              baseBgColor="#64B1AD"
              height="20px"
              isLabelVisible={false} // Yüzdeyi kaldırdık
            />
            <ProgressBarReflection
              style={{ width: `calc(${progress}% - 20px)` }}
            />
          </ProgressBarWrapper>
        </ProgressBarContainer>
        <Container>
          <Outlet />
        </Container>
      </div>
    </LoginLayout>
  );
}

export default QuestionsLayout;
