import styled, { keyframes } from "styled-components";

// Animasyonlar - Float animasyonunu hızlandırma
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Pulse animasyonunu hızlandırma ve biraz daha belirgin hale getirme
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;


const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Ana Why Başlığı - Daha çarpıcı
const FeatureTitle = styled.h2`
  text-align: center;
  font-size: 48px;
  color: var(--color-grey-904);
  z-index: 3000;
  margin-top: 80px;
  margin-bottom: 20px;
  font-weight: 700;
  background: linear-gradient(90deg, #004466, #00ffa2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #004466, #00ffa2);
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
  }
  
  @media (max-width: 1200px) {
    font-size: 40px;
  }
  @media (max-width: 360px) {
    font-size: 32px;
    margin-top: 50px;
  }
`;

// Ana kart container - Daha iyi responsive
const FeaturesContainer = styled.div`
  margin: 100px auto 60px;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: stretch;
  max-width: 1400px;
  flex-wrap: wrap;
  padding: 0 20px;
  
  @media (max-width: 1225px) {
    gap: 20px;
    margin-top: 70px;
  }
  
  @media (max-width: 732px) {
    flex-direction: column;
    align-items: center;
    margin-top: 60px;
    gap: 40px;
  }
`;

// Ana kart - Daha modern etki ve tıklama efekti
const FeatureCard = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 280px;
  height: 520px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease; /* Geçişi hızlandırma */
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.index * 0.15}s;
  opacity: 0;
  z-index: 5;
  transform: translateY(20px);
  cursor: pointer; /* Tıklanabilir olduğunu belirtme */
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(0, 255, 162, 0.3), rgba(0, 68, 102, 0.3));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.2s ease; /* Geçişi hızlandırma */
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.1); /* Büyütme efekti ekleme */
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
    
    img {
      animation: ${float} 2s ease infinite; /* Süreyi 3s'den 2s'ye düşürme */
      transform: scale(1.05); /* Resmi biraz büyütme */
    }
  }
  
  &:active {
    transform: translateY(-5px) scale(1.05); /* Tıklama anında daha belirgin büyüme */
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 1225px) {
    max-width: 320px;
    height: 490px;
  }
  
  @media (max-width: 450px) {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 450px;
  }
`;

// Kart başlığı - Daha net ve vurgulu
const CardTitle = styled.h3`
  font-size: 26px;
  font-weight: 700;
  color: var(--color-grey-904);
  margin: 35px 0 15px 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background: linear-gradient(to bottom, #00ffa2, #004466);
    border-radius: 2px;
  }
  
  @media (max-width: 732px) {
    font-size: 28px;
  }
  
  @media (max-width: 360px) {
    font-size: 24px;
    margin-top: 30px;
  }
`;

// Kart içeriği - Daha okunabilir
const CardContent = styled.p`
  color: var(--color-grey-904);
  margin: 0 30px;
  font-size: 16px;
  line-height: 1.8;
  flex-grow: 1;
  
  @media (max-width: 732px) {
    font-size: 18px;
  }
  
  @media (max-width: 360px) {
    font-size: 16px;
  }
`;

// Tüm resimler için ortak stil - geçişleri hızlandırma
const CardImage = styled.img`
  user-select: none;
  pointer-events: none;
  margin-top: auto;
  align-self: flex-end;
  width: auto;
  height: 180px;
  object-fit: contain;
  transition: all 0.25s ease; /* Geçişi hızlandırma */
  
  @media (max-width: 732px) {
    height: 160px;
  }
`;

// İkinci kısım için container
const SecondaryFeaturesContainer = styled.div`
  margin: 50px auto;
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: stretch;
  max-width: 1200px;
  padding: 0 20px;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

// İkinci kısım için yatay kart - tıklama efekti ekleme
const HorizontalFeatureCard = styled.div`
  width: 100%;
  max-width: 550px;
  height: auto;
  min-height: 220px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  display: flex;
  overflow: hidden;
  position: relative;
  transition: all 0.25s ease; /* Geçişi hızlandırma */
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.index * 0.2}s;
  opacity: 0;
  z-index: 5;
  cursor: pointer; /* Tıklanabilir olduğunu belirtme */
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(0, 255, 162, 0.3), rgba(0, 68, 102, 0.3));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.2s ease; /* Geçişi hızlandırma */
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02); /* Büyütme efekti ekleme */
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
    
    img {
      animation: ${pulse} 2s ease infinite; /* Süreyi 3s'den 2s'ye düşürme */
      transform: scale(1.08); /* Resmi biraz daha belirgin büyütme */
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.03); /* Tıklama anında daha belirgin büyüme */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 1200px) {
    max-width: 100%;
  }
  
  @media (max-width: 732px) {
    flex-direction: column;
    min-height: auto;
    width: 320px;
  }

  @media (max-width: 450px) {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 450px;
  }
`;

// Yatay kartların içeriği
const HorizontalCardContent = styled.div`
  flex: 1;
  padding: 18px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 732px) {
    padding: 25px;
  }
`;

// Yatay kartların görsel kısmı
const HorizontalCardImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  
  @media (max-width: 732px) {
    padding: 0 15px 20px;
    margin-top: -20px;
  }
`;

// Hızlandırılmış ve daha belirgin geçişler
const HorizontalCardImage = styled.img`
  user-select: none;
  pointer-events: none;
  width: auto;
  max-width: 180px;
  max-height: 150px;
  object-fit: contain;
  transition: all 0.25s ease; /* Geçişi hızlandırma */
  
  @media (max-width: 732px) {
    max-width: 140px;
  }
`;

export {
  FeatureTitle,
  FeaturesContainer,
  FeatureCard,
  CardTitle,
  CardContent,
  CardImage,
  SecondaryFeaturesContainer,
  HorizontalFeatureCard,
  HorizontalCardContent,
  HorizontalCardImageWrapper,
  HorizontalCardImage
};