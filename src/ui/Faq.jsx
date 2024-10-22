import { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

// Styled components
const FaqContainer = styled.div`
  padding-bottom: 1rem;
  border-bottom: 0.5px solid #85abdc;
  cursor: pointer;
`;

const Question = styled.div`
  display: flex;
  justify-content: space-between; /* Chevron'u sağa almak için */
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  color: #004466;
  padding: 36px 0;
  transition: all 0.5s ease;
  ${(props) =>
    props.open &&
    `
    background: linear-gradient(180deg, #1500FF 4.17%, #5900FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
  @media (max-width: 1000px) {
    font-size: 18px;
  }
  @media (max-width: 450px) {
    font-size: 16px;
  }
`;

const Title = styled.h3`
  color: var(--color-grey-600);
  text-align: left;
  margin: 0;
  transition: all 1s ease;
`;

const Answer = styled.div`
  max-height: ${(props) => (props.open ? `calc(${props.height}px + 100px)` : "0")};
  overflow: hidden;
  transition: max-height 0.6s ease-in-out;
  line-height: 1.6;
  font-size: 20px;
  padding-top: ${(props) => (props.open ? "16px" : "0")};
  @media (max-width: 1000px) {
    font-size: 18px;
  }
  @media (max-width: 450px) {
    font-size: 16px;
  }
`;

// Chevron Icon styled component
const ChevronIcon = styled.svg`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  fill: ${(props) => (props.open ? "#004466" : "var(--color-grey-600)")}; /* Chevron rengini değiştirmek için fill kullanıyoruz */
  transform: ${(props) => (props.open ? "rotate(180deg)" : "rotate(0deg)")}; /* Yönü değiştiriyoruz */
  transition: transform 0.4s ease; /* Animasyon */
`;

// Main FAQ component
export default function Faq({ title, children }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const answerRef = useRef(null);

  // İçeriği açtığımızda yüksekliği ölçelim
  const toggleOpen = () => {
    setOpen(!open);
    if (answerRef.current) {
      setHeight(answerRef.current.scrollHeight);
    }
  };

  return (
    <FaqContainer onClick={toggleOpen}>
      <Question open={open}>
        <Title>{title}</Title>
        <ChevronIcon
          open={open}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 15.5l-6-6 1.42-1.42L12 12.66l4.58-4.58L18 9.5l-6 6z" />
        </ChevronIcon>
      </Question>
      <Answer ref={answerRef} open={open} height={height}>
        {children}
      </Answer>
    </FaqContainer>
  );
}

// PropTypes validation
Faq.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
