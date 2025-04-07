/* eslint-disable react/prop-types */
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const DotsContainer = styled.div`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;
  animation: ${fadeIn} 0.8s ease-in-out;
  
  @media (max-width: 1024px) {
    left: 10px;
  }
  
  @media (max-width: 768px) {
    left: 5px;
    gap: 12px;
  }
`;

// DotItem, TableOfContentsItem'a benzer şekilde tasarlandı
const DotItem = styled.li`
  list-style: none;
`;

// DotLink, İçindekiler tablosundaki a elemanına benzer şekilde tasarlandı
const DotLink = styled.a`
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.className === "active" ? '#0071e3' : 'rgba(255, 255, 255, 0.15)'};
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: ${props => props.className === "active" ? '#0071e3' : 'rgba(255, 255, 255, 0.3)'};
    transform: scale(1.2);
  }
  
  &::after {
    content: "${props => props.label}";
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    font-size: 14px;
    color: var(--color-grey-600);
    opacity: 0;
    transition: opacity 0.3s ease;
    background: rgba(0, 0, 0, 0.7);
    padding: 4px 8px;
    border-radius: 4px;
    display: none;
  }
  
  &:hover::after {
    display: block;
    opacity: 1;
  }
`;

function PaginationDots({ headings, activeHeading }) {
  return (
    <DotsContainer aria-label="Page sections navigation">
      {headings.map((heading) => (
        <DotItem key={heading.id}>
          <DotLink
            href={`#${heading.id}`}
            className={activeHeading === heading.id ? "active" : ""}
            aria-label={`Navigate to ${heading.text}`}
            label={heading.text}
            onClick={(e) => {
              e.preventDefault(); 
              const element = document.getElementById(heading.id);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        </DotItem>
      ))}
    </DotsContainer>
  );
}

export default PaginationDots;