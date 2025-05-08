/* eslint-disable react/prop-types */

import { useEffect } from "react";
import styled from "styled-components";

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-grey-903);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  will-change: transform, top;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #004466;
    color: #00ffa2;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
    box-shadow: none;

    &:hover {
      background: rgba(255, 255, 255, 0.95);
      color: #1a365d;
    }
  }

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }

  @media (min-width: 681px) {
    &.left {
      left: 20px;
    }
    &.right {
      right: 20px;
    }
  }

  @media (max-width: 680px) {
    width: 45px;
    height: 45px;
    font-size: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const NavigationButtonsContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 0;
  top: 0;
  left: 0;
  z-index: 1000;
  pointer-events: none;
`;

const NavigationButtons = ({ 
  onPrevClick, 
  onNextClick, 
  isPrevDisabled, 
  isNextDisabled,
}) => {
  
  useEffect(() => {
    // Butonları konumlandırma fonksiyonu
    const adjustNavigationButtons = () => {
      const targetButton = document.querySelector(".action-button");
      const leftButton = document.querySelector(".left");
      const rightButton = document.querySelector(".right");
      const container = document.querySelector(".nav-buttons-container");
      
      if (!leftButton || !rightButton || !container) return;

      // 710px değerine göre farklı konumlandırma
      if (window.innerWidth > 710) {
        // Büyük ekranlarda ekranın dikey ortasına hizala
        container.style.top = "50%";
        container.style.position = "fixed";
        container.style.zIndex = "1000";
        
        const buttonRadius = window.innerWidth <= 680 ? 22.5 : 25; // Button height / 2

        leftButton.style.position = "absolute";
        leftButton.style.top = `${-buttonRadius}px`;
        leftButton.style.left = window.innerWidth <= 680 ? "10px" : "20px";

        rightButton.style.position = "absolute";
        rightButton.style.top = `${-buttonRadius}px`;
        rightButton.style.right = window.innerWidth <= 680 ? "10px" : "20px";
      } else {
        // 710px ve altında "Tamamla" butonuyla hizala
        if (targetButton) {
          const buttonRect = targetButton.getBoundingClientRect();
          const verticalCenter = buttonRect.top + buttonRect.height / 2;
          
          container.style.top = `${verticalCenter}px`;
          container.style.position = "fixed";
          container.style.zIndex = "1000";
          
          // Mobil görünümde farklı stil
          if (window.innerWidth <= 680) {
            const buttonRadius = 22.5; // Button height (45px) / 2

            leftButton.style.position = "absolute";
            leftButton.style.top = `${-buttonRadius}px`;
            leftButton.style.left = "10px";

            rightButton.style.position = "absolute";
            rightButton.style.top = `${-buttonRadius}px`;
            rightButton.style.right = "10px";
          } else {
            // 680px ile 710px arası görünümde stiller
            leftButton.style.position = "absolute";
            leftButton.style.top = "-25px"; // Button height (50px) / 2
            leftButton.style.left = "20px";

            rightButton.style.position = "absolute";
            rightButton.style.top = "-25px"; // Button height (50px) / 2
            rightButton.style.right = "20px";
          }
        }
      }
    };

    // Sayfa yüklendiğinde ve scroll edildiğinde butonları hizala
    const handleScroll = () => {
      requestAnimationFrame(adjustNavigationButtons);
    };

    adjustNavigationButtons();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Düzenli olarak pozisyonu güncelle (scroll olayından bağımsız olarak)
    const intervalId = setInterval(adjustNavigationButtons, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <NavigationButtonsContainer className="nav-buttons-container">
      <NavigationButton
        className="left"
        onClick={onPrevClick}
        disabled={isPrevDisabled}
        style={{ pointerEvents: "auto" }}
      >
        &lt;
      </NavigationButton>
      
      <NavigationButton
        className="right"
        onClick={onNextClick}
        disabled={isNextDisabled}
        style={{ pointerEvents: "auto" }}
      >
        &gt;
      </NavigationButton>
    </NavigationButtonsContainer>
  );
};

export default NavigationButtons;