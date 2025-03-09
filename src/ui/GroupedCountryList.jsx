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

const RegionHeader = styled.button`
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
  
  &:hover {
    background-color: rgba(0, 255, 162, 0.08);
  }
  
  &:focus {
    outline: none;
  }
`;

const ExpandIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: var(--color-grey-600);
    transition: all 0.3s ease;
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
    transform: ${props => props.isOpen ? 'scaleY(0)' : 'scaleY(1)'};
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
  margin-left: 8px;
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
    "Avrupa Birliği Ülkeleri": true,
    "Avrupa (Diğer)": false,
    "Asya Ülkeleri": false,
    "Amerika ve Diğer": false
  });
  
  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };
  
  // Toplam ülke sayısını hesapla
  const totalCountries = Object.values(groupedCountries).flat().length;
  
  return (
    <GroupedCountryContainer>
      {Object.entries(groupedCountries).map(([region, countries]) => (
        <RegionContainer key={region}>
          <RegionHeader onClick={() => toggleGroup(region)}>
            {region}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CountryCount>{countries.length}</CountryCount>
              <ExpandIcon isOpen={openGroups[region]} />
            </div>
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

// PropTypes tanımını kaldırdık çünkü artık prop almıyoruz
// Eğer prop kullanımı istenirse, yukardaki işlevsiz PropTypes tanımı yerine gerçek kullanım eklenebilir

export default GroupedCountryList;