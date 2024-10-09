import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FaqContainer = styled.div`
  padding-bottom: 1rem;
  border-bottom: 0.5px solid #85abdc;
  cursor: pointer;
`;

const Question = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  color: #004466;
  padding: 36px 0;
  transition: all 0.5s ease;
  ${(props) => props.open && `
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
  max-height: ${(props) => (props.open ? "400px" : "0")};
  overflow: hidden;
  transition: max-height 1.4s ease-in;
  padding-top: ${(props) => (props.open ? "0" : "0")};
  line-height: 1.6;
  font-size: 20px;
  @media (max-width: 1000px) {
    font-size: 18px;
  }
  @media (max-width: 450px) {
    font-size: 16px;
  }
`;

export default function Faq({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <FaqContainer onClick={() => setOpen(!open)}>
      <Question open={open}>
        <Title>{title}</Title>
      </Question>
      <Answer open={open}>{children}</Answer>
    </FaqContainer>
  );

  
}

Faq.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };