import styled from "styled-components";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BlogLogo from "./BlogLogo";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Slide Container

const SlideSection = styled.div`
  background: var(--color-grey-907);
  background-size: cover;
  margin: 0;
  padding: 0;
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
  @media (max-width: 710px) {
    flex-flow: column;
    height: 760px;
  }
`;

const SlideExplanation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-left: 64px;
  max-width: 450px;
  @media (max-width: 1250px) {
    max-width: 300px;
    margin-left: 40px;
  }
  @media (max-width: 710px) {
    gap: 12px;
    justify-content: center;
    align-items: center;
    margin-left: 0;
    text-align: center;
  }
  @media (max-width: 325px) {
    max-width: 260px;
  }
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
  @media (max-width: 1250px) {
    font-size: 28px;
  }
  @media (max-width: 710px) {
    font-size: 26px;
  }
  @media (max-width: 325px) {
    font-size: 22px;
  }
`;

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70%;
  position: relative;
  overflow: hidden;
  @media (max-width: 710px) {
    width: 100%;
  }
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
  @media (max-width: 325px) {
    width: 260px;
    height: 520px;
  }
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
  display: flex;
  align-items: center;
  color: #007bff;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  background: none;
  border: none;
  position: absolute;
  left: 20px;
  bottom: 20px;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: 5px;
    transition: margin-left 0.2s ease;
  }

  &:hover svg {
    margin-left: 10px;
  }
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
        <BlogLogo variant="overview" />
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
              <DevaminiGor>
                Devamını gör
                <ArrowForwardIcon />
              </DevaminiGor>
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
