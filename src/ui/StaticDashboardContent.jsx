import { useState, useLayoutEffect, useMemo } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AnimatedFlag from "../ui/AnimatedFlag";
import StepIndicator from "../ui/StepIndicator";
import FirmMap from "../ui/FirmMap";
import MobileCarousel from "../ui/MobileCarousel";

// Real user data from your system
const DEMO_USER_DATA = {
  id: 405,
  userId: '6c76fda7-555c-4b68-894c-7f0a985b2336',
  ans_country: 'Almanya',
  ans_purpose: 'Turistik',
  ans_profession: 'Çalışan',
  ans_vehicle: 'Uçak',
  ans_accommodation: 'Otel',
  ans_kid: 'Hayır',
  ans_hassponsor: false,
  ans_sponsor_profession: null,
  has_appointment: true,
  has_filled_form: true,
  created_at: '2025-05-11T10:43:19.8535+00:00'
};

// Real documents data from your system
const DEMO_DOCUMENTS = [
  {
    id: 1,
    docName: "Biyometrik Fotoğraf",
    description: "Biyometrik fotoğraf (3.5x4.5 cm, beyaz zemin)",
    category: "Fotoğraf",
    docStage: "hazir",
    is_required: true,
    order_index: 1
  },
  {
    id: 2,
    docName: "Kimlik Fotokopisi",
    description: "Kimlik kartının ön ve arka yüzünün renkli fotokopisi",
    category: "Kimlik Belgeleri",
    docStage: "hazir",
    is_required: true,
    order_index: 2
  },
  {
    id: 3,
    docName: "Nüfus Kayıt Örneği",
    description: "Nüfus müdürlüğünden alınmış güncel nüfus kayıt örneği",
    category: "Kimlik Belgeleri",
    docStage: "planla",
    is_required: true,
    order_index: 3
  },
  {
    id: 4,
    docName: "Seyahat Sağlık Sigortası",
    description: "Minimum 30.000 Euro teminatı olan seyahat sağlık sigortası",
    category: "Sigorta",
    docStage: "planla",
    is_required: true,
    order_index: 4
  },
  {
    id: 5,
    docName: "İkametgah Belgesi",
    description: "Muhtarlıktan veya nüfus müdürlüğünden alınmış ikametgah belgesi",
    category: "İkamet Belgeleri",
    docStage: "planla",
    is_required: true,
    order_index: 5
  },
  {
    id: 6,
    docName: "Pasaport",
    description: "Geçerli pasaportunuzun tüm sayfalarının renkli fotokopisi",
    category: "Kimlik Belgeleri",
    docStage: "hazir",
    is_required: true,
    order_index: 6
  },
  {
    id: 7,
    docName: "Malvarlık Belgeleri",
    description: "Emlak, araç veya diğer malvarlık belgeleriniz",
    category: "Mali Belgeler",
    docStage: "bizimle",
    is_required: true,
    order_index: 7
  },
  {
    id: 8,
    docName: "Faaliyet Belgesi",
    description: "İş yerinizin faaliyet belgesinin fotokopisi",
    category: "İş Belgeleri",
    docStage: "bizimle",
    is_required: true,
    order_index: 8
  },
  {
    id: 9,
    docName: "SGK İşe Giriş Belgesi",
    description: "SGK'dan alınmış işe giriş belgeniz",
    category: "İş Belgeleri",
    docStage: "bizimle",
    is_required: true,
    order_index: 9
  },
  {
    id: 10,
    docName: "Son 3 Aylık Maaş Bordrosu",
    description: "Son 3 aya ait maaş bordrolarınız",
    category: "Mali Belgeler",
    docStage: "bizimle",
    is_required: true,
    order_index: 10
  },
  {
    id: 11,
    docName: "Son 3 Aylık Banka Hesap Dökümü",
    description: "Son 3 aya ait banka hesap dökümünüz",
    category: "Mali Belgeler",
    docStage: "bizimle",
    is_required: true,
    order_index: 11
  },
  {
    id: 12,
    docName: "Uçak Rezervasyonu",
    description: "Gidiş-dönüş uçak rezervasyon belgeniz",
    category: "Seyahat Belgeleri",
    docStage: "planla",
    is_required: true,
    order_index: 12
  },
  {
    id: 13,
    docName: "Otel Rezervasyonu",
    description: "Onaylanmış otel rezervasyon belgeniz",
    category: "Seyahat Belgeleri",
    docStage: "planla",
    is_required: true,
    order_index: 13
  }
];

// Real firm location data from your system
const DEMO_FIRM_LOCATION = {
  id: 1,
  country: "Almanya",
  firm_name: "iDATA",
  created_at: "2024-07-19T09:27:16.169042+00:00",
  firmAdress: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.108123359664!2d29.036280976129724!3d41.02289037134854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab866f5561b29%3A0xce4c1a88b59559d2!2siDATA%20%C4%B0stanbul%20Altunizade!5e0!3m2!1str!2str!4v1721569966672!5m2!1str!2str" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
  firm_url: "https://www.idata.com.tr/de/tr/office",
  visa_fee: "80",
  service_fee: "25",
  office_hours: "Pazartesi-Cuma: 09:00-17:00"
};

// Demo completed documents (realistic progress - some completed, some not)
const DEMO_COMPLETED_DOCUMENTS = {
  405: {
    "Biyometrik Fotoğraf": true,
    "Kimlik Fotokopisi": true,
    "Pasaport": true,
    "Uçak Rezervasyonu": true,
    "Otel Rezervasyonu": true
    // Other documents intentionally left incomplete for realistic demo
  }
};

// Styled components (same as original Dashboard)
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

const StaticDashboardContent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);

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

      <DashboardItems>
        {!isMobile && (
          <>
            <StepIndicatorWrapper>
              <Heading as="h14">{DEMO_USER_DATA.ans_country}</Heading>
              
              <StepIndicator
                documents={DEMO_DOCUMENTS}
                completedDocuments={DEMO_COMPLETED_DOCUMENTS}
                applicationId={DEMO_USER_DATA.id}
                userSelections={[DEMO_USER_DATA]}
                userType="demo"
                isLoading={false}
                isError={false}
              />
            </StepIndicatorWrapper>

            <InfoContainerWrapper>
              <Heading as="h14">Başvuru adresi</Heading>
              
              <FirmMap firmLocation={DEMO_FIRM_LOCATION} />
            </InfoContainerWrapper>
          </>
        )}

        {/* Mobile view */}
        {isMobile && (
          <MobileCarousel
            completedDocuments={DEMO_COMPLETED_DOCUMENTS}
            documents={DEMO_DOCUMENTS}
            firmLocation={DEMO_FIRM_LOCATION}
            isFirmLocationSuccess={true}
            applicationId={DEMO_USER_DATA.id}
            userSelections={[DEMO_USER_DATA]}
            userType="demo"
            isLoading={false}
            isError={false}
          />
        )}
      </DashboardItems>
    </DashboardContainer>
  );
};

export default StaticDashboardContent;