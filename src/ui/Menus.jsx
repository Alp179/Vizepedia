/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiAdjustmentsHorizontal, HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";
import UserAvatar from "../features/authentication/UserAvatar";

const Menu = styled.div`
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    backdrop-filter: blur(40px);
    opacity: 0.5;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  color: var(--color-grey-600);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 2990;
  position: fixed;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 710px) {
    display: none;
  }

  right: calc(${(props) => props.position.x}px - 30px);
  top: ${(props) => props.position.y}px;

  /* Scale down animasyonu */
  transform: scaleY(${(props) => (props.isOpen ? 1 : 0)});
  transform-origin: top;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
`;

const StyledButton = styled.button`
  mix-blend-mode: difference;
  z-index: 2990;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    opacity: 0.5;
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id, onProfile }) {
  const { openId, close, open, position, setPosition } =
    useContext(MenusContext);
  const toggleRef = useRef(null);

  // Pozisyonu güncelleme fonksiyonu
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePosition = () => {
    if (toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.right,
        y: rect.bottom + window.scrollY + 8,
      });
    }
  };

  useEffect(() => {
    // İlk yerleştirme ve açık olan menü için pozisyon güncellemesi
    if (openId === id) {
      updatePosition();
    }

    // Pencere yeniden boyutlandığında veya kaydırıldığında pozisyonu güncelle
    const handleWindowChange = () => {
      if (openId === id) {
        updatePosition();
      }
    };

    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange);

    // Event listeners'ı temizleme
    return () => {
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange);
    };
  }, [id, openId, setPosition, updatePosition]);

  // Menüyü açıp kapatan handleClick fonksiyonu
  const handleClick = (event) => {
    event.stopPropagation();
    if (openId !== id) {
      open(id);
      // Pozisyonu güncelle
      updatePosition();
    } else {
      close();
    }
  };
  const xaaa = false;

  return (
    <StyledToggle ref={toggleRef} onClick={handleClick}>
      {onProfile ? <UserAvatar /> : <HiEllipsisVertical />}
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close, false);
  const isOpen = openId === id; // Menünün açık olup olmadığını kontrol ediyoruz.

  return createPortal(
    <StyledList position={position} ref={ref} isOpen={isOpen}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon} <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.List = List;
Menus.Button = Button;
Menus.Toggle = Toggle;

export default Menus;
