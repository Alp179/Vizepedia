/* eslint-disable react/prop-types */
import styled from "styled-components";

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media (min-width: 1285px) {
    width: 1000px;
  }
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 68, 102, 0.15);
  gap: 40px;
  z-index: 3000;
  overflow: hidden;
  border: 1px solid rgba(0, 68, 102, 0.08);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 36px rgba(0, 68, 102, 0.2);
  }
  
  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  @media (max-width: 1350px) {
    flex-flow: column;
    gap: 28px;
    width: 500px;
    padding-bottom: 28px;
    align-items: center;
    margin-right: auto;
  }
  @media (max-width: 760px) {
    width: 400px;
    padding: 22px;
  }
  @media (max-width: 710px) {
    margin: 0;
    gap: 8px;
    width: 330px;
    height: 550px; /* 100px daha büyük yükseklik */
    transform: scale(0.97); /* Daha az küçültme */
    transform-origin: top center;
  }
  @media (max-width: 389px) {
    width: 300px;
    padding: 18px;
    gap: 20px;
    overflow: visible;
    height: 550px; /* Sabit yükseklik korunuyor */
    transform: scale(0.92); /* Daha küçük ekranlarda biraz daha küçült */
  }
`;

/* MapContainer için güncelleme */
const MapContainer = styled.div`
  height: auto;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.01);
  }
  
  @media (max-width: 1350px) {
    width: 420px;
    height: 420px;
  }
  @media (max-width: 760px) {
    width: 100%;
    height: 300px;
    border-radius: 10px;
  }
  @media (max-width: 710px) {
    width: 100%;
    height: 220px; /* Daha büyük harita yüksekliği */
    border-radius: 10px;
  }
  @media (max-width: 500px) {
    width: 100%;
    height: 220px; /* Aynı büyük yükseklik */
    border-radius: 10px;
  }
  @media (max-width: 389px) {
    height: 200px; /* En küçük ekranlarda da daha büyük */
    width: 100%;
  }
`;

/* InfoDetails için güncelleme */
const InfoDetails = styled.div`
  flex: 1;
  color: var(--color-grey-600);
  display: flex;
  z-index: 3000;
  flex-direction: column;
  gap: 0;
  padding: 10px 0;
  max-width: 100%;
  word-wrap: break-word;
  
  @media (max-width: 1350px) {
    padding: 0;
    width: 100%;
  }
  
  @media (max-width: 710px) {
    gap: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 310px; /* InfoDetails için daha fazla alan */
  }
`;

/* Firma bilgileri içeren div için stil ekleyerek InfoItems arasındaki boşluğu ayarla */
const FirmInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 710px) {
    margin-bottom: -5px;
    flex: 1;
    justify-content: space-evenly;
  }
`;
const InfoItem = styled.div`
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  padding: 12px 10px 12px 16px;
  border-bottom: 1px solid rgba(0, 68, 102, 0.15);
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    height: calc(100% - 16px);
    width: 5px;
    background: linear-gradient(to bottom, #004466, #00ffa2);
    border-radius: 3px;
    opacity: 0.8;
    transition: width 0.2s ease;
  }
  
  &:hover {
    background-color: rgba(0, 68, 102, 0.05);
    
    &:before {
      width: 7px;
    }
  }
  
  @media (max-width: 710px) {
    padding: 8px 5px 8px 12px; /* Padding'i azalt */
    margin-bottom: 4px; /* Öğeler arası biraz boşluk ekle */
  }
  
  @media (max-width: 389px) {
    font-size: 1.2rem;
    padding: 6px 5px 6px 12px; /* Padding'i daha da azalt */
    flex-wrap: wrap;
  }
`;

/* InfoLabel için güncelleme */
const InfoLabel = styled.strong`
  margin-right: 10px;
  color: #004466;
  font-size: 1.45rem;
  letter-spacing: 0.2px;
  min-width: 150px;
  
  @media (max-width: 710px) {
    font-size: 18px;
    min-width: 120px;
  }
`;

/* InfoValue için güncelleme */
const InfoValue = styled.span`
  color: #333;
  font-weight: 400;
  font-size: 1.4rem;
  
  @media (max-width: 710px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 500px) {
    font-size: 1.2rem;
    padding-left: 8px;
  }
`;

/* FirmName için güncelleme */
const FirmName = styled.h3`
  color: #004466;
  margin: 0 0 20px 0;
  padding-bottom: 14px;
  font-size: 2.6rem;
  border-bottom: 2px solid rgba(0, 68, 102, 0.15);
  
  @media (max-width: 710px) {
    font-size: 28px;
    margin-bottom: 15px; /* Başlık altında daha fazla boşluk */
    padding-bottom: 10px;
  }
  
  
`;

/* FirmLink için güncelleme */
const FirmLink = styled.a`
  color: #004466;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  display: inline-block;
  margin-top: 25px;
  padding: 12px 20px;
  border-radius: 30px;
  background-color: rgba(0, 68, 102, 0.08);
  box-shadow: 0 2px 6px rgba(0, 68, 102, 0.1);
  font-size: 1.25rem;
  
  &:hover {
    color: white;
    background-color: #004466;
    box-shadow: 0 4px 8px rgba(0, 68, 102, 0.2);
    text-decoration: none;
    transform: translateY(-2px);
  }
  
  @media (max-width: 710px) {
    margin-top: 20px;
    padding: 12px 15px;
    font-size: 18px;
    margin-bottom: 10px; /* Alt kısmında biraz boşluk bırak */
  }
  
  @media (max-width: 500px) {
    width: 100%;
    text-align: center;
    padding: 10px 10px;
    margin-top: 12px;
    background-color: rgba(0, 68, 102, 0.12);
    border: 1px solid rgba(0, 68, 102, 0.15);
    word-break: break-word;
    white-space: normal;
    line-height: 1.4;
  }
`;

const PriceValue = styled(InfoValue)`
  font-weight: 600;
  font-size: 18px;
  color: #006699;
`;

const FirmMap = ({ firmLocation }) => {
  if (!firmLocation) return null;
  
  return (
    <InfoContainer>
      <MapContainer
        dangerouslySetInnerHTML={{ __html: firmLocation.firmAdress }}
      />
      <InfoDetails>
        <FirmName>{firmLocation.firm_name}</FirmName>
        
        <FirmInfoContainer>
          <InfoItem>
            <InfoLabel>Vize Ücreti:</InfoLabel>
            <PriceValue>{firmLocation.visa_fee} €</PriceValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Servis Ücreti:</InfoLabel>
            <PriceValue>{firmLocation.service_fee} €</PriceValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Ofis Saatleri:</InfoLabel>
            <InfoValue>{firmLocation.office_hours}</InfoValue>
          </InfoItem>
        </FirmInfoContainer>
        
        <FirmLink
          href={firmLocation.firm_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          İstanbul harici başvuru merkezleri için tıklayın
        </FirmLink>
      </InfoDetails>
    </InfoContainer>
  );
};

export default FirmMap;