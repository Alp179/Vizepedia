import styled from "styled-components";
import { useState } from "react";

const GroupedCountryContainer = styled.div`
  margin: 20px 0;
`;

const RegionContainer = styled.div`
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(0, 255, 162, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const RegionHeader = styled.div`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 17px;
  font-weight: 600;
  color: var(--color-grey-800);
  position: relative;
  user-select: none;
  
  &:hover {
    background-color: rgba(0, 255, 162, 0.08);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
`;

const ExpandIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
  margin-left: 8px;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: var(--color-grey-600);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &::before {
    top: 9px;
    left: 4px;
    width: 12px;
    height: 2px;
  }
  
  &::after {
    top: 4px;
    left: 9px;
    width: 2px;
    height: 12px;
    transform: ${props => props.isOpen ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)'};
  }
`;

const CountriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  padding: ${props => props.isOpen ? '8px 16px 16px' : '0 16px'};
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isOpen ? '1' : '0'};
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const CountryItem = styled.div`
  font-size: 15px;
  color: var(--color-grey-600);
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    color: var(--color-grey-800);
    background-color: rgba(0, 255, 162, 0.1);
  }

  &::before {
    content: "•";
    color: var(--color-grey-600);
    margin-right: 8px;
    font-size: 16px;
  }
`;

const CountryCount = styled.span`
  display: inline-block;
  background-color: rgba(0, 68, 102, 0.1);
  color: var(--color-grey-800);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 14px;
`;

const CountryTotal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 15px;
  color: var(--color-grey-600);
  border-radius: 20px;
  background-color: rgba(0, 255, 162, 0.05);
  
  strong {
    margin: 0 5px;
    color: var(--color-grey-800);
  }
`;

// Prop kullanmayan versiyonu - sabit gruplandırma ile
const GroupedCountryList = () => {
  // Bölgelere göre gruplandırma
  const groupedCountries = {
    "Avrupa Birliği Ülkeleri": [
      "Almanya", "Avusturya", "Belçika", "Çek Cumhuriyeti", "Danimarka", 
      "Estonya", "Finlandiya", "Fransa", "Yunanistan", "Hollanda", 
      "Hırvatistan", "İtalya", "Letonya", "Litvanya", "Lüksemburg", 
      "Malta", "Polonya", "Portekiz", "Slovakya", "Slovenya", 
      "İspanya", "İsveç"
    ],
    "Avrupa (Diğer)": [
      "İsviçre", "Norveç", "İzlanda", "Lihtenştayn", "Birleşik Krallık"
    ],
    "Asya Ülkeleri": [
      "Çin", "Rusya"
    ],
    "Amerika ve Diğer": [
      "Amerika Birleşik Devletleri", "Kanada", "Birleşik Arap Emirlikleri"
    ]
  };
  
  // İlk grup açık, diğerleri kapalı başlasın
  const [openGroups, setOpenGroups] = useState({
    "Avrupa Birliği Ülkeleri": false,
    "Avrupa (Diğer)": false,
    "Asya Ülkeleri": false,
    "Amerika ve Diğer": false
  });
  
  const toggleGroup = (groupName) => {
    setOpenGroups(prev => {
      const newState = {
        ...prev,
        [groupName]: !prev[groupName]
      };
      
      // Durum değiştikten sonra üst Faq komponenti yüksekliğini güncellemek için
      // setTimeout kullanarak DOM'un güncellenmesini bekleyelim
      setTimeout(() => {
        // Global olarak tanımladığımız updateFaqContentHeight fonksiyonunu çağır
        if (window.updateFaqContentHeight) {
          window.updateFaqContentHeight();
        }
      }, 300); // Geçiş animasyonunun tamamlanması için yeterli süre (300ms)
      
      return newState;
    });
  };
  
  // Toplam ülke sayısını hesapla
  const totalCountries = Object.values(groupedCountries).flat().length;
  
  return (
    <GroupedCountryContainer>
      {Object.entries(groupedCountries).map(([region, countries]) => (
        <RegionContainer key={region}>
          {/* onClick olayını direkt RegionHeader'a taşıdık */}
          <RegionHeader onClick={() => toggleGroup(region)}>
            {region}
            <StatusIndicator>
              <CountryCount>{countries.length}</CountryCount>
              <ExpandIcon isOpen={openGroups[region]} />
            </StatusIndicator>
          </RegionHeader>
          <CountriesContainer isOpen={openGroups[region]}>
            {countries.map((country, index) => (
              <CountryItem key={index}>{country}</CountryItem>
            ))}
          </CountriesContainer>
        </RegionContainer>
      ))}
      
      <CountryTotal>
        Toplam <strong>{totalCountries}</strong> ülke için vize başvuru rehberi
      </CountryTotal>
    </GroupedCountryContainer>
  );
};

export default GroupedCountryList;