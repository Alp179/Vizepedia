import styled from "styled-components";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Logo from "./Logo";

// Slide Container

const SlideSection = styled.div`
  background: url("https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/blog-overview-background.png?t=2024-10-04T13%3A41%3A08.876Z");
  height: 750px;
  background-position: center;
  opacity: 0.92;
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  background-size: cover;
  margin-top: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SlideExplanation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-left: 64px;
  max-width: 450px;
`;

const SlideText = styled.p`
  background: linear-gradient(180deg, #1500ff 4.17%, #5900ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
  -moz-hyphens: none;
  -ms-hyphens: none;
  -webkit-hyphens: none;
  hyphens: none;
  font-size: 32px;
`;

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70%;
  position: relative;
  overflow: hidden;
`;

// Kartların bulunduğu container
const CardsWrapper = styled.div`
  width: 100%;
  display: flex;
  transition: transform 0.5s ease;
  transform: ${({ currentIndex }) =>
    `translateX(-${currentIndex * 325}px)`}; /* Kart genişliği + 10px */
`;

// Her bir kart
const Card = styled.div`
  width: 305px;
  height: 490px;
  margin: 10px;
  border-radius: 16px;
  flex-shrink: 0;
  backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 4px 24px -1px rgba(0, 0, 0, 0.2);
`;

const CardImage = styled.img`
  border-radius: 16px 16px 0px 0px;
  overflow: hidden;
  width: 100%;
  height: 305px;
  background: red;
`;

const CardDate = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 12px;
  margin-left: 20px;
`;

const CardHeading = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: var(--color-grey-600);
  margin-left: 20px;
  margin-top: 5px;
  margin-right: 10px;
`;

const DevaminiGor = styled.button`
  position: absolute;
  left: 20px;
  bottom: 20px;
`;

// Sağ ve sol butonlar
const Button = styled.button`
  z-index: 3000;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 100%;
  border: none;
  cursor: pointer;
  font-size: 5rem;
  color: #3498db;
`;

const LeftButton = styled(Button)`
  left: 10px;
`;

const RightButton = styled(Button)`
  right: 10px;
`;

function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Kart sayısını dinamik olarak değiştirebilirsiniz.

  const handlePrevClick = () => {
    if (currentIndex === 0) {
      setCurrentIndex(cards.length - 1);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex === cards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <SlideSection>
      <SlideExplanation>
        <Logo variant="mainpage" />
        <SlideText>
          Seyahat, lezzet ve kültür maceralarınızda size eşlik edecek ilham
          verici içeriklerle tanışın!
        </SlideText>
      </SlideExplanation>
      <SlideContainer>
        <LeftButton onClick={handlePrevClick}>
          <FiChevronLeft />
        </LeftButton>

        <CardsWrapper currentIndex={currentIndex}>
          {cards.map((index) => (
            <Card key={index}>
              <CardImage />
              <CardDate>DD.MM.YYYY</CardDate>
              <CardHeading>
                Blog Başlıkları Buraya Gelecek, Dolu Görünsün
              </CardHeading>
              <DevaminiGor>Devamını gör</DevaminiGor>
            </Card>
          ))}
        </CardsWrapper>

        <RightButton onClick={handleNextClick}>
          <FiChevronRight />
        </RightButton>
      </SlideContainer>
    </SlideSection>
  );
}

export default SlideShow;
