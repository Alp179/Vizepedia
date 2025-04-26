/* eslint-disable react/prop-types */

import  { useEffect } from "react";
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
    left: -60px;
  }

  &.right {
    right: -60px;
  }

  @media (max-width: 680px) {
    width: 45px;
    height: 45px;
    font-size: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const NavigationButtons = ({ 
  onPrevClick, 
  onNextClick, 
  isPrevDisabled, 
  isNextDisabled, 
  targetButtonId 
}) => {
  
  useEffect(() => {
    // SourceButton ile NavigationButton'ları hizalama fonksiyonu
    const adjustNavigationButtons = () => {
      if (window.innerWidth <= 680) {
        const targetButton = document.getElementById(targetButtonId);
        if (targetButton) {
          const buttonRect = targetButton.getBoundingClientRect();
          const leftButton = document.querySelector(".left");
          const rightButton = document.querySelector(".right");

          if (leftButton && rightButton) {
            // Butonların yüksekliklerini targetButton ile hizala
            const verticalCenter = buttonRect.top + buttonRect.height / 2;
            const buttonRadius = 22.5; // Button height (45px) / 2

            leftButton.style.position = "fixed";
            leftButton.style.top = `${verticalCenter - buttonRadius}px`;
            leftButton.style.transform = "none";
            leftButton.style.left = "10px";

            rightButton.style.position = "fixed";
            rightButton.style.top = `${verticalCenter - buttonRadius}px`;
            rightButton.style.transform = "none";
            rightButton.style.right = "10px";
          }
        }
      } else {
        // Desktop görünümde eski konumlarına getir
        const navigationButtons = document.querySelectorAll(".left, .right");
        navigationButtons.forEach((button) => {
          button.style.position = "absolute";
          button.style.top = "50%";
          button.style.transform = "translateY(-50%)";

          if (button.classList.contains("left")) {
            button.style.left = "-60px";
            button.style.right = "auto";
          } else {
            button.style.right = "-60px";
            button.style.left = "auto";
          }
        });
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
  }, [targetButtonId]);

  return (
    <>
      <NavigationButton
        className="left"
        onClick={onPrevClick}
        disabled={isPrevDisabled}
      >
        &lt;
      </NavigationButton>
      
      <NavigationButton
        className="right"
        onClick={onNextClick}
        disabled={isNextDisabled}
      >
        &gt;
      </NavigationButton>
    </>
  );
};

export default NavigationButtons;