import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const MenuIcon = styled.div`
  border-radius: 6px;
  display: block;
  height: 42px;
  z-index: 2989;
  cursor: pointer;
  @media (min-width: 870px) {
    display: none;
  }
  ham {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 400ms;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .hamRotate.active {
    transform: rotate(45deg);
  }
  .hamRotate180.active {
    transform: rotate(180deg);
  }
  .line {
    fill: none;
    transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
    stroke: ${(props) => (props.isOpen ? "var(--stroke-ham-1)" : "black")};
    stroke-width: 5.5;
    stroke-linecap: round;
  }
  .ham8 .top {
    stroke-dasharray: 40 160;
  }
  .ham8 .middle {
    stroke-dasharray: 40 142;
    transform-origin: 50%;
    transition: transform 400ms;
  }
  .ham8 .bottom {
    stroke-dasharray: 40 85;
    transform-origin: 50%;
    transition: transform 400ms, stroke-dashoffset 400ms;
  }
  .ham8.active .top {
    stroke-dashoffset: -64px;
  }
  .ham8.active .middle {
    transform: rotate(90deg);
  }
  .ham8.active .bottom {
    stroke-dashoffset: -64px;
  }
`;

const MenuContainer = styled.div`
  z-index: 3000;
  position: fixed;
  top: 100%; /* MainPageHeader'ın altından başlat */
  right: 0;
  width: 60%;
  border: 1px solid white;
  border-top: none;
  border-right: none;
  max-width: 230px;
  height: 410px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-bottom-left-radius: 16px;
  visibility: ${({ isOpen, hasTransitionEnded }) =>
    isOpen || !hasTransitionEnded
      ? "visible"
      : "hidden"}; /* visibility kapanma animasyonu bittikten sonra */
  opacity: ${({ isOpen }) =>
    isOpen ? "1" : "0"}; /* Opaklık kapanma sırasında */
  transform: ${({ isOpen }) =>
    isOpen ? "scaleY(1)" : "scaleY(0)"}; /* scale efekti */
  transform-origin: top; /* Animasyonun üstten başlaması */
  transition: transform 0.2s ease-in-out, opacity 0.3s ease-in-out;
  @media (min-width: 870px) {
    display: none;
  }
  @media (max-width: 600px) {
    width: 200px;
    height: 320px;
  }
`;

const MenuContents = styled.div`
  padding: 32px;
  gap: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media (max-width: 600px) {
    padding: 16px;
    gap: 16px;
  }
`;

const HakkimizdaveSSS = styled.p`
  font-size: 20px;
  color: var(--color-grey-600);
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const Baslayalim = styled.button`
  background: #004466;
  color: #87f9cd;
  border: 2px solid #87f9cd;
  width: 165px;
  height: 55px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    width: 160px;
    height: 53px;
    font-size: 16px;
  }
  &:hover {
    background: #87f9cd;
    color: #004466;
  }
`;

const OturumAc = styled.button`
  color: var(--color-grey-904);
  width: 165px;
  height: 55px;
  border-radius: 20px;
  border: 2px solid var(--color-grey-904);
  background: transparent;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    width: 160px;
    height: 53px;
    font-size: 16px;
  }
  &:hover {
    background: #004466;
    color: #87f9cd;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 90%;
  background: white;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: auto;
  margin-right: auto;
`;

const MainPageHamburger = ({ setMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTransitionEnded, setHasTransitionEnded] = useState(true); // Animasyonun bittiğini kontrol eden state
  const menuRef = useRef();
  const iconRef = useRef();

  const toggleMenu = () => {
    if (!isOpen) {
      setHasTransitionEnded(false); // Açılırken görünür yap
    }
    setIsOpen(!isOpen); // Menü açıkken tıklandığında kapanacak
    setMenuOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setMenuOpen(false); // Menü kapanınca blur'u kaldır
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setHasTransitionEnded(true); // Kapanma animasyonu tamamlanınca görünürlüğü kapat
      }, 300); // Animasyon süresiyle aynı olmalı
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <>
      <MenuIcon ref={iconRef} isOpen={isOpen} onClick={toggleMenu}>
        <svg
          className={`ham hamRotate ham8 ${isOpen ? "active" : ""}`}
          viewBox="0 0 100 100"
          width="40"
        >
          <path
            className="line top"
            d="m 30,33 h 40 c 3.7,0 7.5,3.1 7.5,8.6 0,5.5 -2.7,8.4 -7.5,8.4 h -20"
          />
          <path className="line middle" d="m 30,50 h 40" />
          <path
            className="line bottom"
            d="m 70,67 h -40 c 0,0 -7.5,-0.8 -7.5,-8.4 0,-7.5 7.5,-8.6 7.5,-8.6 h 20"
          />
        </svg>
      </MenuIcon>
      <MenuContainer
        isOpen={isOpen}
        hasTransitionEnded={hasTransitionEnded}
        ref={menuRef}
      >
        <MenuContents>
          <Baslayalim>Başlayalım</Baslayalim>
          <OturumAc>Oturum aç</OturumAc>
          <Divider />
          <HakkimizdaveSSS>Blog sayfamız</HakkimizdaveSSS>
          <HakkimizdaveSSS>Hakkımızda</HakkimizdaveSSS>
          <HakkimizdaveSSS>SSS</HakkimizdaveSSS>
        </MenuContents>
      </MenuContainer>
    </>
  );
};

MainPageHamburger.propTypes = {
  setMenuOpen: PropTypes.func.isRequired, // setMenuOpen bir fonksiyon olmalı
};

export default MainPageHamburger;
