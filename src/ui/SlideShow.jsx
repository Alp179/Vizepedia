import styled from "styled-components";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Slide Container
const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-top: 100px;
`;

// Kartların bulunduğu container
const CardsWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 300}px)`};
`;

// Her bir kart
const Card = styled.div`
  min-width: 300px;
  height: 400px;
  margin: 10px;
  background: lightblue;
  border-radius: 16px;
  flex-shrink: 0;
`;

// Sağ ve sol butonlar
const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #3498db;
`;

const LeftButton = styled(Button)`
  left: 20px;
`;

const RightButton = styled(Button)`
  right: 20px;
`;

function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [1, 2, 3, 4, 5, 6, 7, 8]; // Kart sayısını dinamik olarak değiştirebilirsiniz.

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
    <SlideContainer>
      <LeftButton onClick={handlePrevClick}>
        <FiChevronLeft />
      </LeftButton>

      <CardsWrapper currentIndex={currentIndex}>
        {cards.map((card, index) => (
          <Card key={index}>Kart {card}</Card>
        ))}
      </CardsWrapper>

      <RightButton onClick={handleNextClick}>
        <FiChevronRight />
      </RightButton>
    </SlideContainer>
  );
}

export default SlideShow;
