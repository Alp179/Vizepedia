/* eslint-disable react/prop-types */
import styled, { keyframes } from "styled-components";

const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <Main className={className} {...props}>
      <Background>
        <AuroraEffect showRadialGradient={showRadialGradient} />
      </Background>
      {children}
    </Main>
  );
};

export default AuroraBackground;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  color: #1e293b;
  transition: background-color 0.3s;
  position: relative;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const auroraAnimation = keyframes`
  0% {
    background-position: 0% 50%, 50% 50%;
  }
  50% {
    background-position: 100% 50%, 50% 50%;
  }
  100% {
    background-position: 0% 50%, 50% 50%;
  }
`;

const AuroraEffect = styled.div`
  position: absolute;
  inset: -10px;
  background-image: repeating-linear-gradient(
      100deg,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.7) 7%,
      transparent 10%,
      transparent 12%,
      rgba(255, 255, 255, 0.7) 16%
    ),
    repeating-linear-gradient(
      100deg,
      #3b82f6 10%,
      #818cf8 15%,
      #60a5fa 20%,
      #a5b4fc 25%,
      #2563eb 30%
    );
  background-size: 300%, 200%;
  background-position: 50% 50%, 50% 50%;
  filter: blur(10px);
  opacity: 0.5;
  pointer-events: none;
  mix-blend-mode: difference;
  animation: ${auroraAnimation} 20s infinite linear;

  ${({ showRadialGradient }) =>
    showRadialGradient &&
    `mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);`}

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        100deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.7) 7%,
        transparent 10%,
        transparent 12%,
        rgba(0, 0, 0, 0.7) 16%
      ),
      repeating-linear-gradient(
        100deg,
        #3b82f6 10%,
        #818cf8 15%,
        #60a5fa 20%,
        #a5b4fc 25%,
        #2563eb 30%
      );
    background-size: 200%, 100%;
    animation: ${auroraAnimation} 30s linear infinite;
    background-attachment: fixed;
    filter: invert(1);

    ${({ showRadialGradient }) =>
      showRadialGradient &&
      `mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);`}
  }
`;
