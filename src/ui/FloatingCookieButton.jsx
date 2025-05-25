// components/FloatingCookieButton.jsx

import styled from "styled-components";
import { useCookieConsent } from "../hooks/useCookieConsent";
import { useState } from "react";

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9998;

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
  }
`;

const FloatingButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-brand-600);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-brand-700);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  background: var(--color-grey-900);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  transition: all 0.2s ease;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 15px;
    border: 5px solid transparent;
    border-top-color: var(--color-grey-900);
  }

  @media (max-width: 768px) {
    bottom: 55px;
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
`;

export const FloatingCookieButton = () => {
  const { openPreferences } = useCookieConsent();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <FloatingContainer>
      <FloatingButton
        onClick={openPreferences}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Çerez Ayarları"
      >
        🍪
      </FloatingButton>
      <Tooltip show={showTooltip}>Çerez Ayarları</Tooltip>
    </FloatingContainer>
  );
};
