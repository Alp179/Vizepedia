/* eslint-disable react/prop-types */
import { useState, useLayoutEffect, useMemo } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AnimatedFlag from "../ui/AnimatedFlag";
import StepIndicator from "../ui/StepIndicator";
import FirmMap from "../ui/FirmMap";
import MobileCarousel from "../ui/MobileCarousel";
import Spinner from "../ui/Spinner";
import JsonLd from "../components/JsonLd";
import SEO from "../components/SEO";

// Function to fetch ALL documents from Supabase
const fetchAllDocuments = async () => {
  console.log("🔄 Fetching all documents from Supabase...");

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("❌ Error fetching documents:", error);
    throw new Error(error.message);
  }

  console.log("✅ Fetched all documents:", data?.length, "documents");
  return data || [];
};

// Real user data from your system (demo data)
const DEMO_USER_DATA = {
  id: 405,
  userId: "6c76fda7-555c-4b68-894c-7f0a985b2336",
  ans_country: "Almanya",
  ans_purpose: "Turistik",
  ans_profession: "Çalışan",
  ans_vehicle: "Uçak",
  ans_accommodation: "Otel",
  ans_kid: "Hayır",
  ans_hassponsor: false,
  ans_sponsor_profession: null,
  has_appointment: true,
  has_filled_form: true,
  created_at: "2025-05-11T10:43:19.8535+00:00",
};

// Real firm location data from your system
const DEMO_FIRM_LOCATION = {
  id: 1,
  country: "Almanya",
  firm_name: "iDATA",
  firmAdress: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.108123359664!2d29.036280976129724!3d41.02289037134854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab866f5561b29%3A0xce4c1a88b59559d2!2siDATA%20%C4%B0stanbul%20Altunizade!5e0!3m2!1str!2str!4v1721569966672!5m2!1str!2str" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
  created_at: "2024-07-19T09:27:16.169042+00:00",
  firm_url: "https://www.idata.com.tr/de/tr/office",
  visa_fee: "80",
  service_fee: "25",
  office_hours: "Pazartesi-Cuma: 09:00-17:00",
};

// Demo completed documents (realistic progress - some completed, some not)
const DEMO_COMPLETED_DOCUMENTS = {
  405: {
    "Biyometrik Fotoğraf": true,
    "Kimlik Fotokopisi": true,
    Pasaport: true,
    "Uçak Rezervasyonu": true,
    "Otel Rezervasyonu": true,
  },
};

// Yapısal veri oluşturma fonksiyonları
const generateWebPageStructuredData = (country) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${country} Vize Başvuru Kontrol Paneli - Vizepedia`,
    description: `${country} için vize başvuru adımlarınızı takip edin. Belgelerinizi hazırlayın ve başvurunuzu tamamlayın.`,
    url: "https://www.vizepedia.com/dashboard",
    mainEntity: {
      "@type": "Service",
      name: `${country} Vize Başvuru Hizmeti`,
      provider: {
        "@type": "Organization",
        name: "Vizepedia",
        url: "https://www.vizepedia.com",
      },
      serviceType: "Vize Başvuru Danışmanlığı",
    },
    about: {
      "@type": "Country",
      name: country,
    },
  };
};

const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vizepedia",
    url: "https://www.vizepedia.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.vizepedia.com/logo.png",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-XXX-XXX-XXXX",
      contactType: "customer service",
    },
    sameAs: [
      "https://facebook.com/vizepedia",
      "https://instagram.com/vizepediacom",
      "https://youtube.com/vizepedia",
    ],
  };
};

// Styled components
const CreatedAtContainer = styled.div`
  font-size: 1.5rem;
  color: var(--color-grey-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  z-index: 3000;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(5px);
  padding: 6px 12px;
  border-radius: 6px;

  @media (max-width: 710px) {
    padding: 4px 8px;
  }
`;

const CustomRow = styled(Row)`
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 3000;
  margin: 25px auto 10px 0;

  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  padding: 0;
  @media (max-width: 710px) {
    margin: 60px auto 10px auto;
    justify-content: center;
  }
  @media (max-width: 450px) {
    margin-top: 40px;
  }
`;

const DashboardContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 710px) {
    height: auto;
    min-height: auto;
    width: 100%;
    margin-left: auto;
    flex-flow: column;
    justify-content: flex-start;
    margin-right: auto;
    padding-top: 10px;
    background: linear-gradient(
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.1) 40%,
      rgba(0, 0, 0, 0) 60%
    );
    align-items: stretch;
    gap: 16px;
  }
`;

const StepIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;

  @media (max-width: 1450px) {
    margin-bottom: 40px;
  }

  @media (max-width: 710px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const InfoContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: 710px) {
    gap: 12px;
  }
`;

const DashboardItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 10;

  @media (max-width: 710px) {
    position: relative;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-top: -8px;
  }
`;

const InfoSection = styled.div`
  max-width: 1000px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1550px) {
    margin-left: -100px;
  }

  @media (max-width: 1050px) {
    margin-right: 50px;
  }

  @media (max-width: 710px) {
    margin-top: 60px;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
  }
`;

const NoticeCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(0, 68, 102, 0.1);
  box-shadow: 0 8px 32px rgba(0, 68, 102, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #004466 0%, #00ffa2 100%);
  }
  
  @media (max-width: 768px) {
    padding: 28px 24px;
    border-radius: 16px;
  }
`;

const InfoTitle = styled.h2`
  font-size: 24px;
  color: #004466;
  margin-bottom: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.3;
  
  span {
    font-size: 32px;
  }
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 16px;
    
    span {
      font-size: 26px;
    }
  }
`;

const InfoText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 16px;
  
  strong {
    color: #004466;
    font-weight: 600;
  }
  
  &:last-of-type {
    margin-bottom: 24px;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.7;
  }
`;

const CTABox = styled.div`
  background: linear-gradient(135deg, #004466 0%, #00ffa2 100%);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 255, 162, 0.2);
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    pointer-events: none;
  }
  
  h3 {
    font-size: 20px;
    margin-bottom: 12px;
    font-weight: 700;
    color: white;
    position: relative;
    z-index: 1;
  }
  
  p {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.6;
    margin: 0;
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 24px 20px;
    border-radius: 12px;
    
    h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 14px;
    }
  }
`;

const HowItWorksSection = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;

  @media (max-width: 1550px) {
  margin-left: -150px;
  }
  
  @media (max-width: 710px) {
    margin: 40px 16px;
    padding: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #004466, #00ffa2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 40px;
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 80px;
    left: 16.66%;
    right: 16.66%;
    height: 2px;
    background: linear-gradient(90deg, #004466 0%, #00ffa2 50%, #004466 100%);
    z-index: -1;
  }
  
  @media (max-width: 1000px) {
  gap: 8px;
    
  @media (max-width: 710px) {
  grid-template-columns: 1fr;}
    &::before {
      display: none;
    }
  }
`;

const StepCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px 24px;
  border: 1px solid rgba(0, 68, 102, 0.1);
  box-shadow: 0 4px 20px rgba(0, 68, 102, 0.06);
  transition: all 0.3s ease;
  position: relative;
  text-align: center;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 68, 102, 0.12);
    border-color: rgba(0, 255, 162, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #004466 0%, #00ffa2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 255, 162, 0.3);
  
  &::before {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    padding: 4px;
    background: linear-gradient(135deg, #004466, #00ffa2);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.3;
  }

  @media (max-width: 1300px) {
  width: 60px;
  height: 60px;}

  @media (max-width: 1000px) {
   width: 40px;
   height: 40px;
   font-size: 22px;
  }
  
  @media (max-width: 768px) {
    
    font-size: 28px;
    margin-bottom: 20px;
  }
`;

const StepIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  @media (max-width: 1000px) {
    font-size: 32px;
  }
  @media (max-width: 768px) {
    font-size: 40px;
    margin-bottom: 16px;
  }
`;

const StepTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #004466;
  margin-bottom: 12px;
  
  @media (max-width: 1000px) {
  font-size: 20px;}
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StepDescription = styled.p`
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;


const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
  color: #e74c3c;
  font-size: 16px;
`;

const StaticDashboardContent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);

  // Fetch all documents from Supabase
  const {
    data: allDocuments,
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
    error: documentsError,
  } = useQuery({
    queryKey: ["allDocuments"],
    queryFn: fetchAllDocuments,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 710);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Format creation date
  const formattedDate = useMemo(() => {
    const date = new Date(DEMO_USER_DATA.created_at);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Get country code for flag
  const countryCode = useMemo(() => {
    const countryToCode = {
      Almanya: "de",
      Avusturya: "at",
      Belçika: "be",
      Çekya: "cz",
      Danimarka: "dk",
      Estonya: "ee",
      Finlandiya: "fi",
      Fransa: "fr",
      Yunanistan: "gr",
      Macaristan: "hu",
      İzlanda: "is",
      İtalya: "it",
      Letonya: "lv",
      Litvanya: "lt",
      Lüksemburg: "lu",
      Malta: "mt",
      Hollanda: "nl",
      Norveç: "no",
      Polonya: "pl",
      Portekiz: "pt",
      Slovakya: "sk",
      Slovenya: "si",
      İspanya: "es",
      İsveç: "se",
      İsviçre: "ch",
      Lihtenştayn: "li",
      Rusya: "ru",
      ABD: "us",
      Çin: "cn",
      BAE: "ae",
      Avustralya: "au",
      Birleşik_Krallık: "gb",
      Hırvatistan: "hr",
    };
    return countryToCode[DEMO_USER_DATA.ans_country] || "de";
  }, []);

  // SEO optimize edilmiş meta veriler
  const seoData = useMemo(
    () => ({
      title: `${DEMO_USER_DATA.ans_country} Vize Başvuru Kontrol Paneli - Vizepedia`,
      description: `${DEMO_USER_DATA.ans_country} için vize başvuru adımlarınızı takip edin. Belgelerinizi hazırlayın ve başvurunuzu tamamlayın. Vizepedia ile kolay vize başvurusu.`,
      keywords: [
        `${DEMO_USER_DATA.ans_country} vizesi`,
        `${DEMO_USER_DATA.ans_country} vize başvurusu`,
        "vize kontrol paneli",
        "vize takip",
        "belge hazırlama",
        "vize başvuru adımları",
        "vize danışmanlık",
        "online vize başvurusu",
      ],
      url: "https://www.vizepedia.com/dashboard",
    }),
    []
  );

  // Loading state
  if (isLoadingDocuments) {
    return (
      <DashboardContainer>
        <AnimatedFlag countryCode={countryCode} />
        <CustomRow type="horizontal">
          <CreatedAtContainer>
            <span
              role="img"
              aria-label="calendar"
              style={{
                marginRight: "6px",
                fontSize: isMobile ? "0.95rem" : "1.1rem",
              }}
            >
              📆
            </span>{" "}
            {formattedDate}
          </CreatedAtContainer>
        </CustomRow>
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  // Error state
  if (isErrorDocuments) {
    return (
      <DashboardContainer>
        <AnimatedFlag countryCode={countryCode} />
        <CustomRow type="horizontal">
          <CreatedAtContainer>
            <span
              role="img"
              aria-label="calendar"
              style={{
                marginRight: "6px",
                fontSize: isMobile ? "0.95rem" : "1.1rem",
              }}
            >
              📆
            </span>{" "}
            {formattedDate}
          </CreatedAtContainer>
        </CustomRow>
        <ErrorContainer>
          Belgeleri yüklerken bir hata oluştu: {documentsError?.message}
        </ErrorContainer>
      </DashboardContainer>
    );
  }

  // Yapısal veriler
  const webPageStructuredData = generateWebPageStructuredData(
    DEMO_USER_DATA.ans_country
  );
  const organizationStructuredData = generateOrganizationStructuredData();

  return (
    <DashboardContainer>
      {/* SEO ve Yapısal Veriler */}
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={seoData.url}
      />

      <JsonLd data={webPageStructuredData} />
      <JsonLd data={organizationStructuredData} />

      {/* Bilgilendirme Section */}
      <InfoSection>
        <NoticeCard>
          <InfoTitle>
            <span>📄</span>
            Tüm Belgeleri Görüntülüyorsunuz
          </InfoTitle>
          
          <InfoText>
            Bu sayfa, Vizepedia&apos;daki <strong>tüm belge havuzunu</strong> örnek olarak göstermek için demo olarak hazırlanmıştır.
          </InfoText>
          
          <InfoText>
            👉 <strong>Başvuru sürecinizi başlattığınızda</strong>, verdiğiniz cevaplara göre <strong>sadece sizin başvurunuza özel belgeler</strong> listelenecek. Böylece vakit kaybetmeden ihtiyacınız olan adımları takip edebileceksiniz.
          </InfoText>
          
          <CTABox>
            <h3>🔑 Hemen Başlatın ve Kişiselleştirilmiş Belgelere Ulaşın</h3>
            <p>
              Başvuru sürecinizi tamamladığınızda, size özel belge listeniz birkaç dakika içinde hazır olacak!
            </p>
          </CTABox>
        </NoticeCard>
      </InfoSection>




      <AnimatedFlag countryCode={countryCode} />

      <CustomRow type="horizontal">
        <CreatedAtContainer>
          <span
            role="img"
            aria-label="calendar"
            style={{
              marginRight: "6px",
              fontSize: isMobile ? "0.95rem" : "1.1rem",
            }}
          >
            📆
          </span>{" "}
          {formattedDate}
        </CreatedAtContainer>
      </CustomRow>

      <DashboardItems>
        {!isMobile && (
          <>
            <StepIndicatorWrapper>
              <Heading as="h14">Tüm Belgeler</Heading>

              <StepIndicator
                documents={allDocuments || []}
                completedDocuments={DEMO_COMPLETED_DOCUMENTS}
                applicationId={DEMO_USER_DATA.id}
                userSelections={[DEMO_USER_DATA]}
                userType="demo"
                isLoading={isLoadingDocuments}
                isError={isErrorDocuments}
              />
            </StepIndicatorWrapper>

            <InfoContainerWrapper>
              <Heading as="h14">Örnek Başvuru Adresi - Almanya</Heading>

              <FirmMap firmLocation={DEMO_FIRM_LOCATION} />
            </InfoContainerWrapper>

            
          </>
        )}

        {/* Mobile view */}
        {isMobile && (
          <MobileCarousel
            completedDocuments={DEMO_COMPLETED_DOCUMENTS}
            documents={allDocuments || []}
            firmLocation={DEMO_FIRM_LOCATION}
            isFirmLocationSuccess={true}
            applicationId={DEMO_USER_DATA.id}
            userSelections={[DEMO_USER_DATA]}
            userType="demo"
            isLoading={isLoadingDocuments}
            isError={isErrorDocuments}
          />
        )}
      </DashboardItems>
      <HowItWorksSection>
        <SectionTitle>Vizepedia Nasıl Çalışır?</SectionTitle>
        <SectionSubtitle>
          Vize başvurunuzu 3 basit adımda tamamlayın. Her adımda size rehberlik ediyoruz!
        </SectionSubtitle>
        
        <StepsContainer>
          <StepCard>
            <StepNumber>1</StepNumber>
            <StepIcon>📝</StepIcon>
            <StepTitle>Bilgilerinizi Girin</StepTitle>
            <StepDescription>
              Gideceğiniz ülke, vize türü, mesleğiniz ve seyahat detaylarınızı girin. 
              Size özel belge listesi otomatik olarak oluşturulur.
            </StepDescription>
          </StepCard>
          
          <StepCard>
            <StepNumber>2</StepNumber>
            <StepIcon>✅</StepIcon>
            <StepTitle>Belgelerinizi Toplayın</StepTitle>
            <StepDescription>
              Kişiselleştirilmiş belge listenizi görün. Her belgeyi hazırladıkça işaretleyin 
              ve ilerlemenizi takip edin. Tüm belgeler detaylı açıklamalarla!
            </StepDescription>
          </StepCard>
          
          <StepCard>
            <StepNumber>3</StepNumber>
            <StepIcon>📍</StepIcon>
            <StepTitle>Başvurunuzu Yapın</StepTitle>
            <StepDescription>
              En yakın başvuru merkezini harita üzerinde görün. Randevu alın ve 
              belgelerinizle başvuru merkezine gidin. Vize süreciniz başladı!
            </StepDescription>
          </StepCard>
        </StepsContainer>
      </HowItWorksSection>
    </DashboardContainer>
  );
};

export default StaticDashboardContent;