import styled, { keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';

// Animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const FaqSection = styled.section`
  margin: 100px auto;
  max-width: 1200px;
  width: 90%;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 450px) {
    margin-top: 150px;
  }
`;

const FaqTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;
  color: var(--color-grey-600);
  text-align: center;
  margin-bottom: 10px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, var(--color-grey-500) 0%, var(--color-grey-600) 50%, var(--color-grey-500) 100%);
    border-radius: 3px;
  }
  
  @media (max-width: 1000px) {
    font-size: 32px;
  }
  
  @media (max-width: 450px) {
    font-size: 28px;
  }
`;

const FaqSubtitle = styled.p`
  margin: 30px 0 50px;
  font-size: 24px;
  color: var(--color-grey-600);
  text-align: center;
  
  @media (max-width: 1000px) {
    font-size: 20px;
  }
  
  @media (max-width: 450px) {
    font-size: 18px;
    margin-bottom: 30px;
  }
`;

const FaqItemContainer = styled.div`
  background: var(--color-grey-919, #f8f9fa);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(0, 255, 162, 0.3) 25%, 
      rgba(0, 68, 102, 0.2) 50%, 
      rgba(0, 255, 162, 0.3) 75%, 
      rgba(255, 255, 255, 0) 100%);
    background-size: 200% auto;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, 
                  linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
      animation: ${shimmer} 3s infinite linear;
    }
  }
  
  &:nth-child(1) { animation: ${fadeIn} 0.3s ease-out; }
  &:nth-child(2) { animation: ${fadeIn} 0.4s ease-out; }
  &:nth-child(3) { animation: ${fadeIn} 0.5s ease-out; }
  &:nth-child(4) { animation: ${fadeIn} 0.6s ease-out; }
  &:nth-child(5) { animation: ${fadeIn} 0.7s ease-out; }
`;

const FaqHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-grey-904);
  transition: all 0.3s ease;
  outline: none;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    padding: 18px 22px;
    font-size: 16px;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.02);
    color: var(--color-grey-900);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 255, 162, 0.2);
  }
`;

const FaqIcon = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
  margin-left: 15px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: ${({ isOpen }) => isOpen ? 'rgba(0, 68, 102, 0.1)' : 'rgba(0, 255, 162, 0.1)'};
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: ${({ isOpen }) => isOpen ? 'var(--color-grey-800)' : 'var(--color-grey-600)'};
    transition: all 0.3s ease;
    border-radius: 1px;
  }
  
  &::before {
    top: 11px;
    left: 6px;
    width: 12px;
    height: 2px;
  }
  
  &::after {
    top: 6px;
    left: 11px;
    width: 2px;
    height: 12px;
    transform: ${({ isOpen }) => (isOpen ? 'scaleY(0)' : 'scaleY(1)')};
  }
`;

// isOpen prop için prop-types tanımı
FaqIcon.propTypes = {
  isOpen: PropTypes.bool
};

const FaqContentWrapper = styled.div`
  padding: ${({ isOpen }) => (isOpen ? "0 28px 28px" : "0 28px")};
  max-height: ${({ isOpen, height }) => (isOpen ? `${height}px` : "0")};
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  
  @media (max-width: 768px) {
    padding: ${({ isOpen }) => (isOpen ? "0 22px 22px" : "0 22px")};
  }
`;

// isOpen ve height için prop-types tanımı
FaqContentWrapper.propTypes = {
  isOpen: PropTypes.bool,
  height: PropTypes.number
};

const FaqContent = styled.div`
  p {
    padding: 12px;
    margin-bottom: 18px;
    font-size: 16px;
    line-height: 1.8;
    color: var(--color-grey-600);
    
    &:last-child {
      margin-bottom: 0;
    }
    
    @media (max-width: 768px) {
      font-size: 15px;
      line-height: 1.7;
    }
  }
`;

const CountryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px 0;
  margin: 20px 0;
  
  @media (max-width: 850px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  @media (max-width: 470px) {
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  @media (max-width: 337px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

const CountryItem = styled.div`
  font-size: 17px;
  color: var(--color-grey-600);
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  padding: 8px 12px;
  border-radius: 6px;
  
  @media (max-width: 1000px) {
    font-size: 16px;
  }
  
  @media (max-width: 450px) {
    font-size: 15px;
  }
  
  &:hover {
    transform: translateX(5px);
    color: var(--color-grey-800);
    background-color: rgba(0, 255, 162, 0.05);
    animation: ${pulse} 1s ease infinite;
  }

  &::before {
    content: "•";
    color: var(--color-grey-600);
    margin-right: 10px;
    font-size: 18px;
    transition: color 0.2s ease;
  }
  
  &:hover::before {
    color: var(--color-grey-800);
  }
`;

function Faq({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, children]);

  return (
    <FaqItemContainer>
      <FaqHeader onClick={() => setIsOpen(!isOpen)}>
        {title}
        <FaqIcon isOpen={isOpen} />
      </FaqHeader>
      <FaqContentWrapper isOpen={isOpen} height={contentHeight}>
        <FaqContent ref={contentRef}>
          {children}
        </FaqContent>
      </FaqContentWrapper>
    </FaqItemContainer>
  );
}

// Faq bileşeni için prop-types tanımı
Faq.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export { FaqSection, FaqTitle, FaqSubtitle, Faq, CountryList, CountryItem };