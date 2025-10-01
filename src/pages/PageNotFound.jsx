import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMoveBack } from "../hooks/useMoveBack";
import MainPageHeader from "../ui/MainPageHeader";
import SEO from "../components/SEO";

const StyledPageNotFound = styled.main`
  min-height: 100vh;
  background-color: var(--color-grey-1);
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Box = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 4rem;
  max-width: 650px;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  color: #1F2937;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const ErrorCode = styled.div`
  font-size: 7rem;
  font-weight: 700;
  color: #3B82F6;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #3B82F6, #10B981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? "#004466" : "white"};
  color: ${props => props.primary ? "white" : "#004466"};
  border: 2px solid ${props => props.primary ? "#3B82F6" : "#D1D5DB"};
  border-radius: 8px;
  padding: 1.1rem 1.7rem;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.primary ? "#2563EB" : "#F9FAFB"};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

function PageNotFound() {
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    window.scrollTo(0, 0);
    navigate("/mainpage");
  };

  return (
    <>
   <SEO
        title="Sayfa Bulunamadı (404) – Vizepedia"
        description="Aradığınız sayfa bulunamadı. Ana sayfaya dönün."
        keywords="404, sayfa bulunamadı, hata"
        url={typeof window !== 'undefined' ? window.location.pathname : '/404'}
        noindex={true} // ✗ 404 sayfası indekslenmesin
      />
    <StyledPageNotFound>
      <MainPageHeader />
      
      <ContentContainer>
        <Box>
          <ErrorCode>404</ErrorCode>
          <Title>Sayfa Bulunamadı</Title>
          <Subtitle>
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
            Ana sayfaya dönebilir veya önceki sayfaya geri gidebilirsiniz.
          </Subtitle>
          
          <ButtonContainer>
            <Button primary onClick={handleGoHome}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Ana Sayfaya Dön
            </Button>
            <Button onClick={moveBack}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Geri Dön
            </Button>
          </ButtonContainer>
        </Box>
      </ContentContainer>
     
    </StyledPageNotFound>
    </>
  );
}

export default PageNotFound;